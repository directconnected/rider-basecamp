
import { supabase } from "@/integrations/supabase/client";
import { findNearbyPoints } from "@/utils/distanceUtils";

/**
 * Fetches nearby fuel stops
 */
export const fetchNearbyFuelStops = async (
  latitude: number,
  longitude: number,
  maxResults: number = 5
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('route_points')
      .select('*')
      .eq('point_type', 'fuel');

    if (error) {
      console.error('Error fetching fuel stops:', error);
      return [];
    }

    const nearbyStops = findNearbyPoints(latitude, longitude, data || []);
    return nearbyStops.slice(0, maxResults).map(stop => ({
      location: [stop.longitude, stop.latitude] as [number, number],
      name: stop.name,
      distance: Math.round(stop.distance),
      rating: stop.rating
    }));
  } catch (error) {
    console.error('Error in fetchNearbyFuelStops:', error);
    return [];
  }
};
