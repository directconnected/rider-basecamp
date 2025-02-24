
import { supabase } from "@/integrations/supabase/client";

interface PlaceResult {
  name: string;
  address: string;
  location: [number, number];
  rating?: number;
  price_level?: number;
}

export const findNearbyLodging = async (coordinates: [number, number], radius: number = 5000): Promise<PlaceResult | null> => {
  try {
    console.log('Finding lodging near coordinates:', coordinates);
    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        location: coordinates,
        type: 'lodging',
        radius
      }
    });

    if (error) {
      console.error('Error finding lodging:', error);
      return null;
    }

    if (!data?.places?.[0]) {
      console.log('No lodging found near coordinates:', coordinates);
      return null;
    }

    const place = data.places[0];
    console.log('Found lodging:', place.name);
    
    return {
      name: place.name,
      address: place.vicinity || place.formatted_address,
      location: [place.geometry.location.lng, place.geometry.location.lat],
      rating: place.rating,
      price_level: place.price_level
    };
  } catch (error) {
    console.error('Error in findNearbyLodging:', error);
    return null;
  }
};

export const findNearbyGasStation = async (coordinates: [number, number], radius: number = 5000): Promise<PlaceResult | null> => {
  try {
    console.log('Finding gas station near coordinates:', coordinates);
    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        location: coordinates,
        type: 'gas_station',
        radius
      }
    });

    if (error) {
      console.error('Error finding gas station:', error);
      return null;
    }

    if (!data?.places?.[0]) {
      console.log('No gas station found near coordinates:', coordinates);
      return null;
    }

    const place = data.places[0];
    console.log('Found gas station:', place.name);
    
    return {
      name: place.name,
      address: place.vicinity || place.formatted_address,
      location: [place.geometry.location.lng, place.geometry.location.lat],
      rating: place.rating,
      price_level: place.price_level
    };
  } catch (error) {
    console.error('Error in findNearbyGasStation:', error);
    return null;
  }
};
