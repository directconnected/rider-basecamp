
import { supabase } from "@/integrations/supabase/client";
import { findNearbyPoints } from "@/utils/distanceUtils";
import { LodgingType, HotelStop } from "@/components/route-planning/types";

/**
 * Fetches nearby hotels by preferred lodging type
 */
export const fetchNearbyHotels = async (
  latitude: number,
  longitude: number,
  preferredType: LodgingType = 'any',
  maxResults: number = 2
): Promise<HotelStop[]> => {
  try {
    let query = supabase
      .from('route_points')
      .select('*')
      .eq('point_type', 'hotel');
    
    if (preferredType !== 'any' && preferredType !== 'campground') {
      query = query.eq('lodging_type', preferredType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching hotels:', error);
      return [];
    }

    const nearbyHotels = findNearbyPoints(latitude, longitude, data || []);
    
    return nearbyHotels.slice(0, maxResults).map(hotel => ({
      location: [hotel.longitude, hotel.latitude] as [number, number],
      name: `Lodging at ${Math.round(hotel.distance)} miles`,
      hotelName: hotel.name,
      distance: Math.round(hotel.distance),
      rating: hotel.rating || 4.0,
      lodgingType: hotel.lodging_type || 'hotel',
      website: hotel.website || undefined,
      phone_number: hotel.phone || undefined
    }));
  } catch (error) {
    console.error('Error in fetchNearbyHotels:', error);
    return [];
  }
};
