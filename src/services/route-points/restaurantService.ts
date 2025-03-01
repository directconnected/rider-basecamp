
import { supabase } from "@/integrations/supabase/client";
import { findNearbyPoints } from "@/utils/distanceUtils";
import { RestaurantType, RestaurantStop } from "@/components/route-planning/types";

/**
 * Fetches nearby restaurants by preferred type
 */
export const fetchNearbyRestaurants = async (
  latitude: number,
  longitude: number,
  preferredType: RestaurantType = 'any',
  maxResults: number = 3
): Promise<RestaurantStop[]> => {
  try {
    let query = supabase
      .from('route_points')
      .select('*')
      .eq('point_type', 'restaurant');
    
    if (preferredType !== 'any') {
      query = query.eq('restaurant_type', preferredType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }

    const nearbyRestaurants = findNearbyPoints(latitude, longitude, data || []);
    
    return nearbyRestaurants.slice(0, maxResults).map(restaurant => ({
      location: [restaurant.longitude, restaurant.latitude] as [number, number],
      name: `Restaurant at ${Math.round(restaurant.distance)} miles`,
      restaurantName: restaurant.name,
      distance: Math.round(restaurant.distance),
      rating: restaurant.rating || 4.0,
      restaurantType: restaurant.restaurant_type || preferredType,
      website: restaurant.website || undefined,
      phone_number: restaurant.phone || undefined
    }));
  } catch (error) {
    console.error('Error in fetchNearbyRestaurants:', error);
    return [];
  }
};
