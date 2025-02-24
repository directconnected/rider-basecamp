
import { supabase } from "@/integrations/supabase/client";

interface PlaceResult {
  name: string;
  address: string;
  location: [number, number];
  rating?: number;
  price_level?: number;
}

const findPlace = async (
  coordinates: [number, number], 
  type: 'lodging' | 'gas_station', 
  initialRadius: number = 5000
): Promise<PlaceResult | null> => {
  // Try with increasingly larger search radii
  const searchRadii = [initialRadius, 10000, 20000, 40000];
  
  for (const radius of searchRadii) {
    try {
      console.log(`Searching for ${type} near coordinates:`, coordinates, 'with radius:', radius);
      const { data, error } = await supabase.functions.invoke('find-nearby-places', {
        body: {
          // coordinates[0] is longitude, coordinates[1] is latitude
          // Google Places API expects [latitude, longitude]
          location: [coordinates[1], coordinates[0]], 
          type,
          radius
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
      console.log(`Found ${type}:`, place.name, 'at radius:', radius, 'coordinates:', place.geometry.location);
      
      // Convert Google Places API response (which uses lat/lng) back to [lng, lat] format
      return {
        name: place.name,
        address: place.vicinity || place.formatted_address,
        location: [place.geometry.location.lng, place.geometry.location.lat], // Ensure correct order
        rating: place.rating,
        price_level: place.price_level
      };
    } catch (error) {
      console.error(`Error in findPlace for ${type}:`, error);
      continue;
    }
  }
  
  return null;
};

export const findNearbyLodging = async (coordinates: [number, number], radius: number = 5000): Promise<PlaceResult | null> => {
  return findPlace(coordinates, 'lodging', radius);
};

export const findNearbyGasStation = async (coordinates: [number, number], radius: number = 5000): Promise<PlaceResult | null> => {
  return findPlace(coordinates, 'gas_station', radius);
};
