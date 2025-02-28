
import { createClient } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

// Use a more generic typing approach since we don't have access to the database.types
type Database = any;

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

// Add the missing exported functions:

export const findNearbyCampground = async (
  coordinates: [number, number],
  radius: number = 5000
): Promise<any | null> => {
  try {
    console.log(`Finding campground near ${coordinates} with radius ${radius}`);

    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: 'campground'
      }
    });

    if (error) {
      console.error('Error finding nearby campground:', error);
      return null;
    }

    if (!data || !data.results || data.results.length === 0) {
      console.log('No campgrounds found');
      return null;
    }

    const campground = data.results[0];

    return {
      name: campground.name,
      address: campground.vicinity || campground.formatted_address,
      location: [campground.geometry.location.lng, campground.geometry.location.lat],
      rating: campground.rating,
      website: campground.website,
      phone_number: campground.formatted_phone_number
    };
  } catch (error) {
    console.error('Error in findNearbyCampground:', error);
    return null;
  }
};

export const findNearbyCampgrounds = async (
  coordinates: [number, number],
  radius: number = 5000,
  state?: string
): Promise<any[]> => {
  try {
    console.log(`Finding campgrounds near ${coordinates} with radius ${radius}${state ? ` in ${state}` : ''}`);

    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: 'campground',
        state: state
      }
    });

    if (error) {
      console.error('Error finding nearby campgrounds:', error);
      return [];
    }

    if (!data || !data.results || data.results.length === 0) {
      console.log('No campgrounds found');
      return [];
    }

    // Process the results to standardize the format
    return data.results.map((campground: any) => ({
      name: campground.name,
      address: campground.vicinity || campground.formatted_address,
      location: [campground.geometry.location.lng, campground.geometry.location.lat],
      rating: campground.rating,
      website: campground.website,
      phone_number: campground.formatted_phone_number,
      state: state || (campground.address_components ? 
        campground.address_components.find((comp: any) => comp.types.includes('administrative_area_level_1'))?.short_name : 
        undefined)
    }));
  } catch (error) {
    console.error('Error in findNearbyCampgrounds:', error);
    return [];
  }
};
