import { createClient } from '@supabase/supabase-js';
import { Database } from '../../supabase/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const findNearbyGasStation = async (coordinates: [number, number], radius: number = 5000): Promise<any | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: 'gas_station'
      }
    });

    if (error) {
      console.error('Error finding nearby gas station:', error);
      return null;
    }

    if (!data || !data.results || data.results.length === 0) {
      console.log('No gas stations found');
      return null;
    }

    const gasStation = data.results[0];

    return {
      name: gasStation.name,
      address: gasStation.vicinity || gasStation.formatted_address,
      location: [gasStation.geometry.location.lng, gasStation.geometry.location.lat]
    };
  } catch (error) {
    console.error('Error in findNearbyGasStation:', error);
    return null;
  }
};

export const findNearbyLodging = async (
  coordinates: [number, number],
  radius: number = 5000,
  lodgingType: string = 'any'
): Promise<any | null> => {
  try {
    console.log(`Finding lodging near ${coordinates} with radius ${radius} and type ${lodgingType}`);

    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: 'lodging',
        specificType: lodgingType === 'any' ? null : lodgingType
      }
    });

    if (error) {
      console.error('Error finding nearby lodging:', error);
      return null;
    }

    if (!data || !data.results || data.results.length === 0) {
      console.log('No lodging found');
      return null;
    }

    const lodging = data.results[0];

    return {
      name: lodging.name,
      address: lodging.vicinity || lodging.formatted_address,
      location: [lodging.geometry.location.lng, lodging.geometry.location.lat],
	  rating: lodging.rating,
	  website: lodging.website,
	  phone_number: lodging.formatted_phone_number
    };
  } catch (error) {
    console.error('Error in findNearbyLodging:', error);
    return null;
  }
};

export const findNearbyRestaurant = async (
  coordinates: [number, number],
  radius: number = 5000,
  restaurantType: string = 'any'
): Promise<any | null> => {
  try {
    console.log(`Finding restaurant near ${coordinates} with radius ${radius} and type ${restaurantType}`);
    
    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: 'restaurant',
        specificType: restaurantType === 'any' ? null : restaurantType
      }
    });
    
    if (error) {
      console.error('Error finding nearby restaurant:', error);
      return null;
    }
    
    if (!data || !data.results || data.results.length === 0) {
      console.log('No restaurant found');
      return null;
    }
    
    const restaurant = data.results[0];
    
    // Get and store the actual restaurant type from the API response
    let actualType = 'restaurant';
    if (restaurant.types && restaurant.types.length > 0) {
      // Filter out generic types
      const specificTypes = restaurant.types.filter((type: string) => 
        !['food', 'point_of_interest', 'establishment', 'restaurant', 'place'].includes(type)
      );
      
      if (specificTypes.length > 0) {
        actualType = specificTypes[0]; // Use the first specific type
      }
    }
    
    console.log('Found restaurant:', restaurant.name, 'with type:', actualType);
    
    return {
      name: restaurant.name,
      address: restaurant.vicinity || restaurant.formatted_address,
      location: [restaurant.geometry.location.lng, restaurant.geometry.location.lat],
      rating: restaurant.rating,
      website: restaurant.website,
      phone_number: restaurant.formatted_phone_number,
      restaurantType: actualType // Store the actual restaurant type
    };
  } catch (error) {
    console.error('Error in findNearbyRestaurant:', error);
    return null;
  }
};

export const findNearbyAttraction = async (
  coordinates: [number, number],
  radius: number = 5000,
  attractionType: string = 'any'
): Promise<any | null> => {
  try {
    console.log(`Finding attraction near ${coordinates} with radius ${radius} and type ${attractionType}`);

    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: 'tourist_attraction',
        specificType: attractionType === 'any' ? null : attractionType
      }
    });

    if (error) {
      console.error('Error finding nearby attraction:', error);
      return null;
    }

    if (!data || !data.results || data.results.length === 0) {
      console.log('No attractions found');
      return null;
    }

	const attraction = data.results[0];
	
    // Extract specific attraction types
    let actualType = 'tourist_attraction';
    if (attraction.types && attraction.types.length > 0) {
      const specificTypes = attraction.types.filter((type: string) =>
        !['point_of_interest', 'establishment', 'place'].includes(type)
      );
      if (specificTypes.length > 0) {
        actualType = specificTypes[0];
      }
    }

    return {
      name: attraction.name,
      address: attraction.vicinity || attraction.formatted_address,
      location: [attraction.geometry.location.lng, attraction.geometry.location.lat],
	  rating: attraction.rating,
	  website: attraction.website,
	  phone_number: attraction.formatted_phone_number,
	  attractionType: actualType
    };
  } catch (error) {
    console.error('Error in findNearbyAttraction:', error);
    return null;
  }
};
