
import { supabase } from "@/integrations/supabase/client";

interface PlaceResult {
  name: string;
  address: string;
  location: [number, number];
  rating?: number;
  price_level?: number;
  website?: string;
  phone_number?: string;
}

const findPlace = async (
  coordinates: [number, number], 
  type: 'lodging' | 'gas_station' | 'restaurant' | 'campground' | 'tourist_attraction', 
  initialRadius: number = 5000
): Promise<PlaceResult | null> => {
  // Try with increasingly larger search radii
  const searchRadii = [initialRadius, 10000, 20000, 40000];
  
  for (const radius of searchRadii) {
    try {
      console.log(`Searching for ${type} near coordinates:`, coordinates, 'with radius:', radius);
      const { data, error } = await supabase.functions.invoke('find-nearby-places', {
        body: {
          location: [coordinates[1], coordinates[0]], 
          type,
          radius,
          rankby: 'rating',
          fields: ['name', 'vicinity', 'formatted_address', 'geometry', 'rating', 'price_level', 'website', 'formatted_phone_number']
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
        phone_number: place.formatted_phone_number
      };
    } catch (error) {
      console.error(`Error in findPlace for ${type}:`, error);
      continue;
    }
  }
  
  return null;
};

export const findNearbyLodging = async (coordinates: [number, number], radius: number = 5000): Promise<PlaceResult | null> => {
  console.log('Finding nearby lodging at:', coordinates);
  const result = await findPlace(coordinates, 'lodging', radius);
  console.log('Found lodging result:', result);
  return result;
};

export const findNearbyGasStation = async (coordinates: [number, number], radius: number = 5000): Promise<PlaceResult | null> => {
  return findPlace(coordinates, 'gas_station', radius);
};

export const findNearbyRestaurant = async (coordinates: [number, number], radius: number = 5000): Promise<PlaceResult | null> => {
  return findPlace(coordinates, 'restaurant', radius);
};

export const findNearbyCampground = async (coordinates: [number, number], radius: number = 5000): Promise<PlaceResult | null> => {
  return findPlace(coordinates, 'campground', radius);
};

export const findNearbyAttraction = async (coordinates: [number, number], radius: number = 5000): Promise<PlaceResult | null> => {
  return findPlace(coordinates, 'tourist_attraction', radius);
};
