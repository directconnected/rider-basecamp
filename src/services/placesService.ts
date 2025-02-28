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
    
    // Custom restaurant type mapping for accurate searches
    let searchType = 'restaurant';
    let specificType = null;
    
    // Map specific restaurant types to the right parameters
    if (restaurantType !== 'any') {
      switch (restaurantType) {
        case 'italian':
          specificType = 'italian_restaurant';
          break;
        case 'chinese':
          specificType = 'chinese_restaurant';
          break;
        case 'fast_food':
          searchType = 'fast_food';
          specificType = null;
          break;
        case 'fine_dining':
          specificType = 'fine_dining';
          break;
        case 'casual_dining':
          specificType = 'casual_dining';
          break;
        default:
          specificType = restaurantType;
      }
    }
    
    console.log(`Searching for ${searchType} with specific type: ${specificType}`);
    
    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: searchType,
        specificType: specificType
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
    
    // Determine the actual restaurant type from the API response
    let actualType = 'restaurant';
    
    // If we're specifically looking for a type, verify the result matches
    if (restaurantType !== 'any') {
      // Check if the returned restaurant has the requested cuisine type
      const hasRequestedType = restaurant.types?.includes(specificType) || 
                             restaurant.types?.includes(restaurantType) ||
                             (restaurant.name?.toLowerCase().includes(restaurantType));
      
      // If it does match what we asked for, use that type
      if (hasRequestedType) {
        actualType = restaurantType;
      } else {
        // Otherwise, try to determine the actual type from its categories
        if (restaurant.types && restaurant.types.length > 0) {
          const cuisineTypes = ['italian', 'chinese', 'mexican', 'japanese', 'thai', 'indian', 'french'];
          
          // Look for cuisine types in the response
          for (const cuisine of cuisineTypes) {
            if (restaurant.types.includes(`${cuisine}_restaurant`) || 
                restaurant.types.includes(cuisine)) {
              actualType = cuisine;
              break;
            }
          }
          
          // Look for restaurant categories
          if (actualType === 'restaurant') {
            if (restaurant.types.includes('fast_food')) {
              actualType = 'fast_food';
            } else if (restaurant.types.includes('cafe')) {
              actualType = 'cafe';
            } else if (restaurant.types.includes('bar')) {
              actualType = 'bar';
            }
          }
        }
      }
    } else {
      // If we're not looking for a specific type, determine the best category
      if (restaurant.types && restaurant.types.length > 0) {
        // First check for specific cuisine types
        const cuisineMapping = {
          'italian_restaurant': 'italian',
          'chinese_restaurant': 'chinese',
          'mexican_restaurant': 'mexican',
          'japanese_restaurant': 'japanese',
          'thai_restaurant': 'thai',
          'indian_restaurant': 'indian',
          'french_restaurant': 'french',
        };
        
        for (const [apiType, displayType] of Object.entries(cuisineMapping)) {
          if (restaurant.types.includes(apiType)) {
            actualType = displayType;
            break;
          }
        }
        
        // Check for restaurant categories if no cuisine was found
        if (actualType === 'restaurant') {
          const categoryMapping = {
            'fast_food': 'fast food',
            'cafe': 'cafe',
            'bar': 'bar',
            'bakery': 'bakery',
            'meal_takeaway': 'meal takeaway',
            'meal_delivery': 'meal delivery',
          };
          
          for (const [apiType, displayType] of Object.entries(categoryMapping)) {
            if (restaurant.types.includes(apiType)) {
              actualType = displayType;
              break;
            }
          }
        }
      }
    }
    
    // Manual overrides for known chains to ensure accuracy
    if (restaurant.name) {
      const name = restaurant.name.toLowerCase();
      if (name.includes('mcdonald') || name.includes('burger king') || 
          name.includes('wendy') || name.includes('taco bell')) {
        actualType = 'fast food';
      } else if (name.includes('cracker barrel')) {
        actualType = 'american';
      } else if (name.includes('subway')) {
        actualType = 'sandwich';
      } else if (name.includes('olive garden')) {
        actualType = 'italian';
      } else if (name.includes('panda express')) {
        actualType = 'chinese';
      } else if (name.includes('ruby tuesday')) {
        actualType = 'american';
      } else if (name.includes('lone star')) {
        actualType = 'steakhouse';
      } else if (name.includes('red lobster')) {
        actualType = 'seafood';
      } else if (name.includes('bbq') || name.includes('barbecue')) {
        actualType = 'bbq';
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
      restaurantType: actualType
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

    // Maps our internal type to Google Places API type
    let searchType = attractionType;
    if (attractionType === 'any' || attractionType === 'tourist_attractions') {
      searchType = 'tourist_attraction';
    }

    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: searchType,
        // Only send specificType if it's not a built-in Google Place type
        specificType: ['museum', 'park', 'tourist_attraction', 'amusement_park', 'art_gallery'].includes(searchType) 
          ? null 
          : attractionType
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

    // If we specifically searched for a type, use that type
    if (attractionType !== 'any' && attractionType !== 'tourist_attractions') {
      actualType = attractionType;
    }

    console.log(`Found attraction: ${attraction.name} with type: ${actualType}`);

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
