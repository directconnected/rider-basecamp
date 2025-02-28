
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

export const findNearbyCampgrounds = async (coordinates: [number, number], radius: number = 25000): Promise<CampgroundResult[]> => {
  try {
    console.log(`Searching for campgrounds near coordinates:`, coordinates, 'with radius:', radius);
    
    // Try directly using the campsites table if the Places API fails
    // This is a fallback approach
    const { data: campsiteData, error: dbError } = await supabase
      .from('campsites')
      .select('*')
      .order('camp')
      .limit(20);
    
    if (!dbError && campsiteData && campsiteData.length > 0) {
      console.log(`Found ${campsiteData.length} campgrounds in database`);
      
      // Process and return the found places from the database
      return campsiteData.map(site => ({
        name: site.camp || 'Unknown Campground',
        address: site.town ? `${site.town}, ${site.state}` : (site.state || 'Unknown Location'),
        location: [site.lon || 0, site.lat || 0],
        rating: 4.0, // Default rating since DB doesn't have this
        website: site.url,
        phone_number: site.phone,
        types: ['campground']
      }));
    }
    
    // Try Google Places API
    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        location: [coordinates[1], coordinates[0]], 
        type: 'campground',
        radius,
        rankby: 'prominence',
        fields: ['name', 'vicinity', 'formatted_address', 'geometry', 'rating', 'price_level', 'website', 'formatted_phone_number', 'types'],
        keyword: 'campground',
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
    
    // Process and return the found places
    return data.places.map(place => ({
      name: place.name,
      address: place.vicinity || place.formatted_address,
      location: [place.geometry.location.lng, place.geometry.location.lat],
      rating: place.rating,
      website: place.website,
      phone_number: place.formatted_phone_number,
      types: place.types
    }));
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
  
  if (attractionType === 'any') {
    return findPlace(coordinates, 'tourist_attraction', radius);
  }
  
  // Map our UI attraction types to Google Places API types
  const typeMap: Record<string, 'museum' | 'park' | 'tourist_attraction' | 'amusement_park' | 'art_gallery' | 'historic_site' | 'natural_feature' | 'point_of_interest'> = {
    'museum': 'museum',
    'park': 'park',
    'tourist_attraction': 'tourist_attraction',
    'amusement_park': 'amusement_park',
    'art_gallery': 'art_gallery',
    'historic_site': 'point_of_interest',  // Google doesn't have historic_site type, use point_of_interest with keyword
    'natural_feature': 'natural_feature',
    'point_of_interest': 'point_of_interest'
  };
  
  // Get the appropriate Google Places type
  const placeType = typeMap[attractionType] || 'tourist_attraction';
  
  // For some types, we need to use keywords to further refine the search
  let keyword: string | undefined;
  if (attractionType === 'historic_site') {
    keyword = 'historic';
  } else if (attractionType !== 'any' && attractionType !== placeType) {
    // If our UI type doesn't match Google's type exactly, use it as a keyword
    keyword = attractionType.replace('_', ' ');
  }
  
  console.log(`Searching for attraction of type ${placeType}${keyword ? ` with keyword ${keyword}` : ''}`);
  return findPlace(coordinates, placeType, radius, keyword);
};
