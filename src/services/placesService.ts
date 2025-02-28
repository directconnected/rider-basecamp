import { supabase } from "@/integrations/supabase/client";
import { CampgroundResult } from '@/hooks/useCampsiteSearch';

interface PlaceResult {
  name: string;
  address: string;
  location: [number, number];
  rating?: number;
  price_level?: number;
  website?: string;
  phone_number?: string;
  types?: string[];
  state?: string;
}

const findPlace = async (
  coordinates: [number, number], 
  type: 'lodging' | 'gas_station' | 'restaurant' | 'campground' | 'tourist_attraction' | 'museum' | 'park' | 'amusement_park' | 'art_gallery' | 'historic_site' | 'natural_feature' | 'point_of_interest', 
  initialRadius: number = 5000,
  keyword?: string
): Promise<PlaceResult | null> => {
  // Try with increasingly larger search radii
  const searchRadii = [initialRadius, 10000, 20000, 40000];
  
  for (const radius of searchRadii) {
    try {
      console.log(`Searching for ${type} near coordinates:`, coordinates, 'with radius:', radius, keyword ? `and keyword: ${keyword}` : '');
      const { data, error } = await supabase.functions.invoke('find-nearby-places', {
        body: {
          location: [coordinates[1], coordinates[0]], 
          type,
          radius,
          rankby: 'rating',
          fields: ['name', 'vicinity', 'formatted_address', 'geometry', 'rating', 'price_level', 'website', 'formatted_phone_number', 'types'],
          keyword
        }
      });

      if (error) {
        console.error(`Error finding ${type}:`, error);
        continue;
      }

      if (!data?.places?.[0]) {
        console.log(`No ${type} found near coordinates with radius ${radius}:`, coordinates);
        continue;
      }

      const place = data.places[0];
      console.log(`Found ${type}:`, place);
      
      // Extract state from address if available
      let state = null;
      if (place.vicinity) {
        const addressParts = place.vicinity.split(',');
        if (addressParts.length > 1) {
          const lastPart = addressParts[addressParts.length - 1].trim();
          const stateParts = lastPart.split(' ');
          if (stateParts.length > 0) {
            state = stateParts[0].trim();
          }
        }
      }
      
      return {
        name: place.name,
        address: place.vicinity || place.formatted_address,
        location: [place.geometry.location.lng, place.geometry.location.lat],
        rating: place.rating,
        price_level: place.price_level,
        website: place.website,
        phone_number: place.formatted_phone_number,
        types: place.types,
        state: state
      };
    } catch (error) {
      console.error(`Error in findPlace for ${type}:`, error);
      continue;
    }
  }
  
  return null;
};

export const findNearbyLodging = async (
  coordinates: [number, number], 
  radius: number = 5000,
  lodgingType: string = 'any'
): Promise<PlaceResult | null> => {
  if (lodgingType === 'any' || lodgingType === 'hotel' || lodgingType === 'motel' || 
      lodgingType === 'resort' || lodgingType === 'inn' || lodgingType === 'bed_and_breakfast') {
    // For hotels and similar lodging
    const keyword = lodgingType !== 'any' ? lodgingType.replace('_', ' ') : undefined;
    const result = await findPlace(coordinates, 'lodging', radius, keyword);
    return result;
  } else if (lodgingType === 'campground') {
    // For campgrounds
    return findNearbyCampground(coordinates, radius);
  }
  
  // Default to any lodging if type not specified
  const result = await findPlace(coordinates, 'lodging', radius);
  return result;
};

export const findNearbyGasStation = async (coordinates: [number, number], radius: number = 5000): Promise<PlaceResult | null> => {
  return findPlace(coordinates, 'gas_station', radius);
};

export const findNearbyRestaurant = async (
  coordinates: [number, number], 
  radius: number = 5000,
  restaurantType: string = 'any'
): Promise<PlaceResult | null> => {
  // Convert restaurantType to a keyword for the Places API
  const keyword = restaurantType !== 'any' ? restaurantType.replace('_', ' ') : undefined;
  return findPlace(coordinates, 'restaurant', radius, keyword);
};

export const findNearbyCampground = async (coordinates: [number, number], radius: number = 5000): Promise<PlaceResult | null> => {
  return findPlace(coordinates, 'campground', radius);
};

export const findNearbyCampgrounds = async (
  coordinates: [number, number], 
  radius: number = 25000,
  state?: string
): Promise<CampgroundResult[]> => {
  try {
    console.log(`Searching for campgrounds near coordinates:`, coordinates, 'with radius:', radius, state ? `in state: ${state}` : '');
    
    // Try directly using the campsites table if a specific state is provided
    if (state) {
      const { data: campsiteData, error: dbError } = await supabase
        .from('campsites')
        .select('*')
        .eq('state', state)
        .order('camp')
        .limit(20);
      
      if (!dbError && campsiteData && campsiteData.length > 0) {
        console.log(`Found ${campsiteData.length} campgrounds in ${state} from database`);
        
        // Process and return the found places from the database
        return campsiteData.map(site => ({
          name: site.camp || 'Unknown Campground',
          address: site.town ? `${site.town}, ${site.state}` : (site.state || 'Unknown Location'),
          location: [site.lon || 0, site.lat || 0],
          rating: 4.0, // Default rating since DB doesn't have this
          website: site.url,
          phone_number: site.phone,
          types: ['campground'],
          state: site.state
        }));
      }
    }
    
    // Try Google Places API
    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        location: [coordinates[1], coordinates[0]], 
        type: 'campground',
        radius,
        rankby: 'prominence',
        fields: ['name', 'vicinity', 'formatted_address', 'geometry', 'rating', 'price_level', 'website', 'formatted_phone_number', 'types'],
        keyword: state ? `campground ${state}` : 'campground',
        limit: 20 // Request more results
      }
    });

    if (error) {
      console.error(`Error finding campgrounds from Places API:`, error);
      return [];
    }

    if (!data?.places || data.places.length === 0) {
      console.log(`No campgrounds found near coordinates with radius ${radius} from Places API:`, coordinates);
      return [];
    }

    console.log(`Found ${data.places.length} campgrounds from Places API`);
    
    // Process the places and filter by state if needed
    let places = data.places.map(place => {
      // Extract state from address
      let placeState = null;
      if (place.vicinity) {
        const addressParts = place.vicinity.split(',');
        if (addressParts.length > 1) {
          const lastPart = addressParts[addressParts.length - 1].trim();
          const stateParts = lastPart.split(' ');
          if (stateParts.length > 0) {
            placeState = stateParts[0].trim();
          }
        }
      }
      
      return {
        name: place.name,
        address: place.vicinity || place.formatted_address,
        location: [place.geometry.location.lng, place.geometry.location.lat],
        rating: place.rating,
        website: place.website,
        phone_number: place.formatted_phone_number,
        types: place.types,
        state: placeState
      };
    });
    
    // Filter by state if one was provided
    if (state) {
      places = places.filter(place => {
        // If we have an extracted state, check if it matches
        if (place.state) {
          return place.state.toUpperCase() === state.toUpperCase() || 
                 place.address.includes(state) ||
                 (place.address.includes(', ' + state + ' '));
        }
        // Otherwise check if the address contains the state
        return place.address.includes(state) || 
               (place.address.includes(', ' + state + ' '));
      });
      
      console.log(`Filtered to ${places.length} campgrounds in ${state}`);
    }
    
    return places;
  } catch (error) {
    console.error(`Error in findNearbyCampgrounds:`, error);
    return [];
  }
};

export const findNearbyAttraction = async (
  coordinates: [number, number], 
  radius: number = 5000,
  attractionType: string = 'any'
): Promise<PlaceResult | null> => {
  console.log(`Finding nearby attraction of type: ${attractionType}`);
  
  // Map our UI attraction types to Google Places API types and keywords
  const typeMapping: Record<string, { type: string, keyword?: string }> = {
    'museum': { type: 'museum' },
    'park': { type: 'park' },
    'tourist_attraction': { type: 'tourist_attraction' },
    'amusement_park': { type: 'amusement_park' },
    'art_gallery': { type: 'art_gallery' },
    'historic_site': { type: 'point_of_interest', keyword: 'historic' },
    'natural_feature': { type: 'natural_feature' },
    'point_of_interest': { type: 'point_of_interest' }
  };
  
  if (attractionType === 'any') {
    return findPlace(coordinates, 'tourist_attraction', radius);
  }
  
  // Get the mapped type configuration
  const typeConfig = typeMapping[attractionType] || { type: 'tourist_attraction' };
  
  // Use the mapped type and keyword
  console.log(`Searching for attraction with type: ${typeConfig.type} and keyword: ${typeConfig.keyword || 'none'}`);
  
  try {
    // Attempt to find exactly the type requested
    const result = await findPlace(coordinates, typeConfig.type as any, radius, typeConfig.keyword);
    if (result) {
      console.log(`Found ${attractionType} attraction:`, result.name);
      return result;
    }
    
    // If the exact type wasn't found, and it's not 'any', try as a point_of_interest with the type as keyword
    if (attractionType !== 'any' && !result) {
      console.log(`No ${attractionType} found, trying as point_of_interest with keyword`);
      const fallbackResult = await findPlace(coordinates, 'point_of_interest', radius, attractionType.replace('_', ' '));
      if (fallbackResult) {
        console.log(`Found fallback ${attractionType} attraction:`, fallbackResult.name);
      }
      return fallbackResult;
    }
    
    return null;
  } catch (error) {
    console.error(`Error finding ${attractionType} attraction:`, error);
    return null;
  }
};
