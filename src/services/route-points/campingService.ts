
import { supabase } from "@/integrations/supabase/client";
import { findNearbyPoints } from "@/utils/distanceUtils";
import { CampingStop } from "@/components/route-planning/types";

/**
 * Fetches nearby campgrounds
 */
export const fetchNearbyCampgrounds = async (
  latitude: number,
  longitude: number,
  maxResults: number = 2,
  preferredType: string = 'any'
): Promise<CampingStop[]> => {
  try {
    let query = supabase
      .from('route_points')
      .select('*')
      .eq('point_type', 'camping');
    
    if (preferredType !== 'any') {
      query = query.eq('camping_type', preferredType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching campgrounds:', error);
      return [];
    }

    const nearbyCampgrounds = findNearbyPoints(latitude, longitude, data || []);
    
    return nearbyCampgrounds.slice(0, maxResults).map(campground => ({
      location: [campground.longitude, campground.latitude] as [number, number],
      name: `Campground at ${Math.round(campground.distance)} miles`,
      campgroundName: campground.name,
      distance: Math.round(campground.distance),
      rating: campground.rating || 4.0,
      campingType: campground.camping_type || 'campground',
      website: campground.website || undefined,
      phone_number: campground.phone || undefined,
      amenities: campground.amenities || []
    }));
  } catch (error) {
    console.error('Error in fetchNearbyCampgrounds:', error);
    return [];
  }
};
