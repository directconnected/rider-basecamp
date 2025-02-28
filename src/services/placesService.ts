
import { createClient } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { RestaurantType, AttractionType } from '@/components/route-planning/types';

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
        specificType: lodgingType === 'any' ? null : lodgingType,
        keyword: lodgingType === 'any' ? null : lodgingType.replace('_', ' ')
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
      phone_number: lodging.formatted_phone_number,
      lodgingType: lodgingType
    };
  } catch (error) {
    console.error('Error in findNearbyLodging:', error);
    return null;
  }
};

export const findNearbyRestaurant = async (
  coordinates: [number, number],
  radius: number = 5000,
  requestedType: RestaurantType = 'any'
): Promise<any | null> => {
  try {
    console.log(`Finding restaurant near ${coordinates} with radius ${radius} and type ${requestedType}`);
    
    // Map our internal types to Google Places API types and keywords
    let placeType = 'restaurant';
    let keyword = '';
    
    // Map specific restaurant types to the appropriate search parameters
    if (requestedType !== 'any') {
      switch (requestedType) {
        case 'italian':
          placeType = 'restaurant';
          keyword = 'italian restaurant';
          break;
        case 'mexican':
          placeType = 'restaurant';
          keyword = 'mexican restaurant';
          break;
        case 'chinese':
          placeType = 'restaurant';
          keyword = 'chinese restaurant';
          break;
        case 'american':
          placeType = 'restaurant';
          keyword = 'american restaurant';
          break;
        case 'thai':
          placeType = 'restaurant';
          keyword = 'thai restaurant';
          break;
        case 'japanese':
          placeType = 'restaurant';
          keyword = 'japanese restaurant';
          break;
        case 'indian':
          placeType = 'restaurant';
          keyword = 'indian restaurant';
          break;
        case 'fast_food':
          placeType = 'restaurant';
          keyword = 'fast food';
          break;
        case 'pizza':
          placeType = 'restaurant';
          keyword = 'pizza';
          break;
        case 'seafood':
          placeType = 'restaurant';
          keyword = 'seafood restaurant';
          break;
        case 'steakhouse':
          placeType = 'restaurant';
          keyword = 'steakhouse';
          break;
        case 'vegetarian':
          placeType = 'restaurant';
          keyword = 'vegetarian restaurant';
          break;
        case 'breakfast':
          placeType = 'restaurant';
          keyword = 'breakfast';
          break;
        case 'cafe':
          placeType = 'cafe';
          break;
        case 'barbecue':
          placeType = 'restaurant';
          keyword = 'bbq restaurant';
          break;
        case 'fine_dining':
          placeType = 'restaurant';
          keyword = 'fine dining';
          break;
        case 'casual':
          placeType = 'restaurant';
          keyword = 'casual dining';
          break;
        case 'asian':
          placeType = 'restaurant';
          keyword = 'asian restaurant';
          break;
        default:
          keyword = requestedType.replace('_', ' ');
      }
    }
    
    console.log(`Searching for ${placeType} with keyword: "${keyword}"`);
    
    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: placeType,
        keyword: keyword || null
      }
    });
    
    if (error) {
      console.error('Error finding nearby restaurant:', error);
      return null;
    }
    
    if (!data || !data.results || data.results.length === 0) {
      console.log(`No restaurants found for type "${requestedType}"`);
      return null;
    }
    
    const restaurant = data.results[0];
    console.log('Found restaurant:', restaurant.name, 'types:', restaurant.types);
    
    // When we specifically requested a type, use that type
    let displayType = requestedType !== 'any' ? requestedType : 'restaurant';
    
    // If we didn't request a specific type, try to determine the type from the result
    if (requestedType === 'any' && restaurant.types) {
      // Check for specific cuisine types in the API response
      const typeMapping: Record<string, RestaurantType> = {
        'restaurant': 'restaurant',
        'cafe': 'cafe',
        'bar': 'bar',
        'meal_takeaway': 'fast_food',
        'bakery': 'cafe',
        'food': 'restaurant'
      };
      
      // Check for cuisine in name
      const cuisineKeywords: Record<string, RestaurantType> = {
        'italian': 'italian',
        'mexican': 'mexican',
        'chinese': 'chinese',
        'thai': 'thai',
        'japanese': 'japanese',
        'indian': 'indian',
        'pizza': 'pizza',
        'seafood': 'seafood',
        'steak': 'steakhouse',
        'steakhouse': 'steakhouse',
        'bbq': 'barbecue',
        'barbecue': 'barbecue',
        'sandwich': 'sandwich',
        'burger': 'american',
        'american': 'american',
        'breakfast': 'breakfast',
        'asian': 'asian'
      };
      
      // First try to find a cuisine from the name
      const nameLower = restaurant.name.toLowerCase();
      const cuisineFound = Object.keys(cuisineKeywords).find(key => nameLower.includes(key));
      
      if (cuisineFound) {
        displayType = cuisineKeywords[cuisineFound];
      } else {
        // If no cuisine in name, try to use the place types
        for (const type of restaurant.types) {
          if (typeMapping[type]) {
            displayType = typeMapping[type];
            break;
          }
        }
      }
      
      // Manual overrides for well-known chains
      if (nameLower.includes('mcdonald') || nameLower.includes('burger king') || 
          nameLower.includes('wendy') || nameLower.includes('taco bell')) {
        displayType = 'fast_food';
      } else if (nameLower.includes('cracker barrel')) {
        displayType = 'american';
      } else if (nameLower.includes('olive garden')) {
        displayType = 'italian';
      } else if (nameLower.includes('panda express')) {
        displayType = 'chinese';
      } else if (nameLower.includes('ruby tuesday')) {
        displayType = 'american';
      } else if (nameLower.includes('outback') || nameLower.includes('longhorn')) {
        displayType = 'steakhouse';
      } else if (nameLower.includes('red lobster')) {
        displayType = 'seafood';
      } else if (nameLower.includes('subway')) {
        displayType = 'fast_food';
      }
    }
    
    console.log(`Restaurant "${restaurant.name}" will be displayed with type: ${displayType}`);
    
    return {
      name: restaurant.name,
      address: restaurant.vicinity || restaurant.formatted_address,
      location: [restaurant.geometry.location.lng, restaurant.geometry.location.lat],
      rating: restaurant.rating,
      website: restaurant.website,
      phone_number: restaurant.formatted_phone_number,
      restaurantType: displayType
    };
  } catch (error) {
    console.error('Error in findNearbyRestaurant:', error);
    return null;
  }
};

export const findNearbyAttraction = async (
  coordinates: [number, number],
  radius: number = 5000,
  attractionType: AttractionType = 'any'
): Promise<any | null> => {
  try {
    console.log(`Finding attraction near ${coordinates} with radius ${radius} and type ${attractionType}`);

    // Maps our internal type to Google Places API type and keywords
    let placeType = 'tourist_attraction';
    let keyword = '';
    
    if (attractionType !== 'any') {
      switch (attractionType) {
        case 'museum':
          placeType = 'museum';
          break;
        case 'park':
          placeType = 'park';
          break;
        case 'tourist_attraction':
          placeType = 'tourist_attraction';
          break;
        case 'amusement_park':
          placeType = 'amusement_park';
          break;
        case 'art_gallery':
          placeType = 'art_gallery';
          break;
        case 'historic_site':
          placeType = 'tourist_attraction';
          keyword = 'historic site';
          break;
        case 'natural_feature':
          placeType = 'natural_feature';
          break;
        case 'point_of_interest':
          placeType = 'point_of_interest';
          break;
        default:
          keyword = attractionType.replace('_', ' ');
      }
    }

    console.log(`Searching for ${placeType} with keyword: "${keyword}"`);

    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: placeType,
        keyword: keyword || null
      }
    });

    if (error) {
      console.error('Error finding nearby attraction:', error);
      return null;
    }

    if (!data || !data.results || data.results.length === 0) {
      console.log(`No attractions found for type "${attractionType}"`);
      return null;
    }

    const attraction = data.results[0];
    console.log('Found attraction:', attraction.name, 'types:', attraction.types);
    
    // When we specifically requested a type, use that type for consistency
    let displayType = attractionType !== 'any' ? attractionType : 'tourist_attraction';
    
    // If we didn't request a specific type, determine the best type to display
    if (attractionType === 'any' && attraction.types) {
      const attractionTypeMapping: Record<string, AttractionType> = {
        'museum': 'museum',
        'park': 'park',
        'tourist_attraction': 'tourist_attraction',
        'amusement_park': 'amusement_park',
        'art_gallery': 'art_gallery',
        'natural_feature': 'natural_feature',
        'point_of_interest': 'point_of_interest'
      };
      
      for (const type of attraction.types) {
        if (attractionTypeMapping[type]) {
          displayType = attractionTypeMapping[type];
          break;
        }
      }
    }
    
    console.log(`Attraction "${attraction.name}" will be displayed with type: ${displayType}`);

    return {
      name: attraction.name,
      address: attraction.vicinity || attraction.formatted_address,
      location: [attraction.geometry.location.lng, attraction.geometry.location.lat],
      rating: attraction.rating,
      website: attraction.website,
      phone_number: attraction.formatted_phone_number,
      attractionType: displayType
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
      phone_number: campground.formatted_phone_number,
      campingType: 'campground'
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
      campingType: 'campground',
      state: state || (campground.address_components ? 
        campground.address_components.find((comp: any) => comp.types.includes('administrative_area_level_1'))?.short_name : 
        undefined)
    }));
  } catch (error) {
    console.error('Error in findNearbyCampgrounds:', error);
    return [];
  }
};
