
import { supabase } from "@/integrations/supabase/client";
import { findNearbyPoints } from "@/utils/distanceUtils";
import { RoutePoint } from "./types";

/**
 * Fetch all types of points within a given radius
 */
export const fetchPointsInRadius = async (
  latitude: number,
  longitude: number,
  radiusMiles: number = 50
): Promise<RoutePoint[]> => {
  try {
    const { data, error } = await supabase
      .from('route_points')
      .select('*');

    if (error) {
      console.error('Error fetching points in radius:', error);
      return [];
    }

    // Cast the data to ensure TypeScript knows it's compatible with RoutePoint
    const typedData = data.map(item => ({
      ...item,
      point_type: item.point_type as 'fuel' | 'hotel' | 'restaurant' | 'camping' | 'attraction'
    }));

    // Filter points by distance using the utility function
    return findNearbyPoints(latitude, longitude, typedData || [], radiusMiles);
  } catch (error) {
    console.error('Error in fetchPointsInRadius:', error);
    return [];
  }
};
