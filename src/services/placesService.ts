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

    // Handle different lodging types
    let placeType = 'lodging';
    let keyword = null;
    
    // Special handling for bed and breakfast
    if (lodgingType === 'bed_and_breakfast') {
      keyword = 'bed and breakfast';
    } else if (lodgingType !== 'any') {
      keyword = lodgingType.replace(/_/g, ' ');
    }
    
    console.log(`Searching for ${placeType} with keyword: "${keyword}"`);

    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: placeType,
        keyword: keyword
      }
    });

    if (error) {
      console.error('Error finding nearby lodging:', error);
      return null;
    }

    if (!data || !data.results || data.results.length === 0) {
      console.log(`No lodging found for type ${lodgingType}`);
      return null;
    }

    // For specific lodging types, try to find a better match
    let bestMatch = data.results[0];
    
    if (lodgingType !== 'any') {
      // Try to find exact matches in the name or types
      const typeKeywords = {
        'hotel': ['hotel'],
        'motel': ['motel'],
        'resort': ['resort'],
        'bed_and_breakfast': ['bed and breakfast', 'b&b', 'b & b', 'inn'],
        'inn': ['inn'],
        'lodge': ['lodge'],
        'cabin': ['cabin'],
        'apartment': ['apartment', 'condo', 'flat'],
        'hostel': ['hostel']
      };
      
      // Look for specific keywords in name or types
      const keywords = typeKeywords[lodgingType as keyof typeof typeKeywords] || [];
      
      for (const result of data.results) {
        const nameLower = result.name.toLowerCase();
        const isMatch = keywords.some(keyword => nameLower.includes(keyword));
        
        if (isMatch) {
          bestMatch = result;
          console.log(`Found better match for ${lodgingType}: ${result.name}`);
          break;
        }
      }
    }

    return {
      name: bestMatch.name,
      address: bestMatch.vicinity || bestMatch.formatted_address,
      location: [bestMatch.geometry.location.lng, bestMatch.geometry.location.lat],
      rating: bestMatch.rating,
      website: bestMatch.website,
      phone_number: bestMatch.formatted_phone_number,
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
    let keyword = null;
    
    // Map specific restaurant types to the appropriate search parameters
    if (requestedType !== 'any' as RestaurantType) {
      switch (requestedType) {
        case 'italian':
          keyword = 'italian restaurant';
          break;
        case 'mexican':
          keyword = 'mexican restaurant';
          break;
        case 'chinese':
          keyword = 'chinese restaurant';
          break;
        case 'american':
          keyword = 'american restaurant';
          break;
        case 'thai':
          keyword = 'thai restaurant';
          break;
        case 'japanese':
          keyword = 'japanese restaurant';
          break;
        case 'indian':
          keyword = 'indian restaurant';
          break;
        case 'fast_food':
          keyword = 'fast food';
          break;
        case 'pizza':
          keyword = 'pizza';
          break;
        case 'seafood':
          keyword = 'seafood restaurant';
          break;
        case 'steakhouse':
          keyword = 'steakhouse';
          break;
        case 'vegetarian':
          keyword = 'vegetarian restaurant';
          break;
        case 'breakfast':
          keyword = 'breakfast restaurant';
          break;
        case 'cafe':
          placeType = 'cafe';
          break;
        case 'barbecue':
          keyword = 'bbq restaurant';
          break;
        case 'fine_dining':
          keyword = 'fine dining restaurant';
          break;
        case 'casual':
          keyword = 'casual dining restaurant';
          break;
        case 'asian':
          keyword = 'asian restaurant';
          break;
        default:
          // Type assertion to string to avoid 'never' type error
          keyword = (requestedType as string).replace(/_/g, ' ') + ' restaurant';
      }
    }
    
    console.log(`Searching for ${placeType} with keyword: "${keyword}"`);
    
    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: placeType,
        keyword: keyword
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
    
    // For specific types, try to verify the result matches what we want
    let bestMatch = data.results[0];
    
    // Keywords that should appear in the name or types for each restaurant type
    const typeKeywords: Record<string, string[]> = {
      'italian': ['italian', 'pasta', 'pizzeria'],
      'mexican': ['mexican', 'taco', 'burrito'],
      'chinese': ['chinese', 'asian', 'wok', 'panda'],
      'american': ['american', 'burger', 'grill', 'diner'],
      'thai': ['thai'],
      'japanese': ['japanese', 'sushi', 'ramen'],
      'indian': ['indian', 'curry'],
      'fast_food': ['fast', 'mcdonald', 'burger king', 'wendy', 'taco bell', 'kfc'],
      'pizza': ['pizza', 'pizzeria'],
      'seafood': ['seafood', 'fish', 'lobster', 'crab'],
      'steakhouse': ['steak', 'steakhouse', 'grill', 'beef', 'outback', 'longhorn'],
      'vegetarian': ['vegetarian', 'vegan', 'plant'],
      'breakfast': ['breakfast', 'brunch', 'pancake', 'waffle', 'ihop', 'denny'],
      'cafe': ['cafe', 'coffee', 'starbucks', 'bakery', 'pastry'],
      'barbecue': ['bbq', 'barbecue', 'grill', 'smokehouse'],
      'fine_dining': ['fine dining', 'upscale', 'gourmet', 'fancy'],
      'casual': ['casual', 'family', 'pub', 'bar & grill'],
      'asian': ['asian', 'chinese', 'japanese', 'thai', 'vietnamese', 'korean']
    };
    
    // For specific requested types, look for a better match
    if (requestedType !== 'any' as RestaurantType) {
      const keywords = typeKeywords[requestedType as string] || [];
      
      // Try to find a better match from results
      let foundMatch = false;
      for (const result of data.results) {
        const nameLower = result.name.toLowerCase();
        const typesLower = result.types ? result.types.join(' ').toLowerCase() : '';
        const vicinity = result.vicinity ? result.vicinity.toLowerCase() : '';
        
        const isMatch = keywords.some(keyword => 
          nameLower.includes(keyword) || 
          typesLower.includes(keyword) || 
          vicinity.includes(keyword)
        );
        
        if (isMatch) {
          bestMatch = result;
          foundMatch = true;
          console.log(`Found better match for ${requestedType}: ${result.name}`);
          break;
        }
      }
      
      // If we don't find a good match but it's a specific type request, return the best we have anyway
      if (!foundMatch) {
        console.log(`No perfect matches found for ${requestedType} - using best available: ${bestMatch.name}`);
      }
    }
    
    console.log(`Restaurant "${bestMatch.name}" will be displayed with type: ${requestedType}`);
    
    return {
      name: bestMatch.name,
      address: bestMatch.vicinity || bestMatch.formatted_address,
      location: [bestMatch.geometry.location.lng, bestMatch.geometry.location.lat],
      rating: bestMatch.rating,
      website: bestMatch.website,
      phone_number: bestMatch.formatted_phone_number,
      restaurantType: requestedType
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
    let keyword = null;
    
    if (attractionType !== 'any' as AttractionType) {
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
          // Type assertion to string to avoid 'never' type error
          keyword = (attractionType as string).replace(/_/g, ' ');
      }
    }

    console.log(`Searching for ${placeType} with keyword: "${keyword}"`);

    const { data, error } = await supabase.functions.invoke('find-nearby-places', {
      body: {
        coordinates,
        radius,
        type: placeType,
        keyword: keyword
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
    
    // Ensure we're not returning a hotel or restaurant as an attraction
    const nonValidTypes = ['lodging', 'restaurant', 'cafe', 'food', 'bar'];
    
    // Find the first result that's not a hotel or restaurant
    let validAttraction = null;
    
    for (const result of data.results) {
      // Skip if result has any of the non-valid types
      const isNonValid = result.types && result.types.some((type: string) => nonValidTypes.includes(type));
      
      if (!isNonValid) {
        validAttraction = result;
        break;
      }
    }
    
    // If we can't find a valid attraction from filtered results, just use the first result
    if (!validAttraction && data.results.length > 0) {
      console.log('Could not find attractions without hotel/restaurant types, using first result');
      validAttraction = data.results[0];
    } else if (!validAttraction) {
      console.log('No attractions found');
      return null;
    }

    // When we specifically requested a type, use that type for consistency  
    let displayType: AttractionType = attractionType !== 'any' as AttractionType ? 
      attractionType : 'tourist_attraction';
    
    console.log(`Attraction "${validAttraction.name}" will be displayed with type: ${displayType}`);

    return {
      name: validAttraction.name,
      address: validAttraction.vicinity || validAttraction.formatted_address,
      location: [validAttraction.geometry.location.lng, validAttraction.geometry.location.lat],
      rating: validAttraction.rating,
      website: validAttraction.website,
      phone_number: validAttraction.formatted_phone_number,
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
      types: campground.types,
      state: state || (campground.address_components ? 
        campground.address_components.find((comp: any) => comp.types.includes('administrative_area_level_1'))?.short_name : 
        undefined)
    }));
  } catch (error) {
    console.error('Error in findNearbyCampgrounds:', error);
    return [];
  }
};
