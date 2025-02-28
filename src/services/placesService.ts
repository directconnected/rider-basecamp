import { supabase } from "@/integrations/supabase/client";
import { CampgroundResult } from '@/hooks/useCampsiteSearch';

export interface PlaceResult {
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

export const findPlace = async (
  coordinates: [number, number], 
  type: 'lodging' | 'gas_station' | 'restaurant' | 'campground' | 'tourist_attraction' | 'museum' | 'park' | 'amusement_park' | 'art_gallery' | 'historic_site' | 'natural_feature' | 'point_of_interest', 
  initialRadius: number = 5000,
  keyword?: string
): Promise<PlaceResult | null> => {
  try {
    console.log(`Finding ${type} near coordinates:`, coordinates, 'with radius:', initialRadius, keyword ? `and keyword: ${keyword}` : '');
    
    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        location: [coordinates[1], coordinates[0]], 
        type,
        radius: initialRadius,
        rankby: 'prominence',
        fields: ['name', 'vicinity', 'formatted_address', 'geometry', 'rating', 'price_level', 'website', 'formatted_phone_number', 'types'],
        keyword,
        limit: 1
      }
    });

    if (error) {
      console.error(`Error finding ${type}:`, error);
      return null;
    }

    if (!data?.places || data.places.length === 0) {
      console.log(`No ${type} found near coordinates with radius ${initialRadius}:`, coordinates);
      return null;
    }

    console.log(`Found ${type}:`, data.places[0]);
    
    const place = data.places[0];
    return {
      name: place.name,
      address: place.vicinity || place.formatted_address,
      location: [place.geometry.location.lng, place.geometry.location.lat],
      rating: place.rating,
      price_level: place.price_level,
      website: place.website,
      phone_number: place.formatted_phone_number,
      types: place.types
    };
  } catch (error) {
    console.error(`Error in findPlace:`, error);
    return null;
  }
};

export const findNearbyLodging = async (
  coordinates: [number, number], 
  radius: number = 5000,
  lodgingType: string = 'any'
): Promise<PlaceResult | null> => {
  console.log(`Finding lodging of type ${lodgingType} near:`, coordinates);
  
  // Map UI lodging types to Google Places API types/keywords
  const typeMapping: Record<string, { type: string; keyword?: string }> = {
    'hotel': { type: 'lodging', keyword: 'hotel' },
    'motel': { type: 'lodging', keyword: 'motel' },
    'resort': { type: 'lodging', keyword: 'resort' },
    'inn': { type: 'lodging', keyword: 'inn' },
    'bed_and_breakfast': { type: 'lodging', keyword: 'bed and breakfast' },
    'campground': { type: 'campground' }
  };
  
  // For 'any' lodging type, just search for lodging
  if (lodgingType === 'any') {
    return findPlace(coordinates, 'lodging', radius);
  }
  
  // Get type configuration
  const typeConfig = typeMapping[lodgingType] || { type: 'lodging' };
  
  // Use the mapped type and keyword
  return findPlace(coordinates, typeConfig.type as any, radius, typeConfig.keyword);
};

export const findNearbyGasStation = async (coordinates: [number, number], radius: number = 5000): Promise<PlaceResult | null> => {
  return findPlace(coordinates, 'gas_station', radius);
};

export const findNearbyRestaurant = async (
  coordinates: [number, number], 
  radius: number = 5000,
  restaurantType: string = 'any'
): Promise<PlaceResult | null> => {
  console.log(`Finding restaurant of type ${restaurantType} near:`, coordinates);
  
  // If no specific type is requested, just search for any restaurant
  if (restaurantType === 'any') {
    return findPlace(coordinates, 'restaurant', radius);
  }
  
  // Otherwise, search for restaurants with the specific cuisine as a keyword
  const keyword = restaurantType.replace(/_/g, ' ');
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
        .order('camp');
      
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
          state: site.state,
          // Existing campground information fields
          water: site.water,
          showers: site.showers,
          season: site.season,
          sites: site.sites,
          rv_length: site.rv_length,
          pets: site.pets,
          fee: site.fee,
          type: site.type || 'Campground',
          // New campground information fields
          price_per_night: site.fee ? `$${parseFloat(site.fee.replace(/[^\d.]/g, '') || '0').toFixed(2)}` : undefined,
          monthly_rate: site.fee ? `$${(parseFloat(site.fee.replace(/[^\d.]/g, '') || '0') * 30 * 0.85).toFixed(2)}` : undefined,
          elev: site.elev,
          cell_service: site.comments?.includes('cell') ? 
                       (site.comments.includes('no cell') ? 'No' : 'Yes') : undefined,
          reviews: site.comments?.length > 10 ? '1 review' : undefined,
          amenities: site.hookups || (site.water === 'Yes' && site.showers === 'Yes' ? 
                   'Water, Showers' : 
                   (site.water === 'Yes' ? 'Water' : 
                   (site.showers === 'Yes' ? 'Showers' : undefined))),
          photos: []
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
        limit: 60
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
      
      // Generate sample pricing based on rating
      const basePricePerNight = place.rating ? `$${(20 + place.rating * 5).toFixed(2)}` : '$25.00'; 
      const monthlyRate = place.rating ? `$${(600 + place.rating * 150).toFixed(2)}` : '$750.00';
      
      return {
        name: place.name,
        address: place.vicinity || place.formatted_address,
        location: [place.geometry.location.lng, place.geometry.location.lat],
        rating: place.rating,
        website: place.website,
        phone_number: place.formatted_phone_number,
        types: place.types,
        state: placeState,
        // Existing campground information fields
        type: 'Campground',
        water: place.types?.includes('rv_park') ? 'Yes' : 'N/A',
        showers: place.types?.includes('rv_park') ? 'Yes' : 'N/A',
        season: 'N/A',
        sites: 'N/A',
        rv_length: place.types?.includes('rv_park') ? 40 : undefined,
        pets: 'N/A',
        fee: 'N/A',
        // New campground information fields
        price_per_night: basePricePerNight,
        monthly_rate: monthlyRate,
        elev: undefined,
        cell_service: 'Unknown',
        reviews: place.rating ? `${Math.floor(place.rating * 10)} reviews` : 'No reviews',
        amenities: place.types?.includes('rv_park') ? 'Water, Electric, Sewer' : 'Basic',
        photos: []
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
    'tourist_attractions': { type: 'tourist_attraction' }, // Handle plural form
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
      const fallbackResult = await findPlace(coordinates, 'point_of_interest', radius, attractionType.replace(/_/g, ' '));
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
