
import { supabase } from "@/integrations/supabase/client";
import { findNearbyPoints } from "@/utils/distanceUtils";
import { AttractionType, AttractionStop } from "@/components/route-planning/types";

/**
 * Fetches nearby attractions by preferred type
 */
export const fetchNearbyAttractions = async (
  latitude: number,
  longitude: number,
  preferredType: AttractionType = 'any',
  maxResults: number = 3
): Promise<AttractionStop[]> => {
  try {
    let query = supabase
      .from('route_points')
      .select('*')
      .eq('point_type', 'attraction');
    
    if (preferredType !== 'any') {
      query = query.eq('attraction_type', preferredType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching attractions:', error);
      return [];
    }

    const nearbyAttractions = findNearbyPoints(latitude, longitude, data || []);
    
    return nearbyAttractions.slice(0, maxResults).map(attraction => ({
      location: [attraction.longitude, attraction.latitude] as [number, number],
      name: `Attraction at ${Math.round(attraction.distance)} miles`,
      attractionName: attraction.name,
      distance: Math.round(attraction.distance),
      rating: attraction.rating || 4.0,
      attractionType: attraction.attraction_type || preferredType,
      website: attraction.website || undefined,
      phone_number: attraction.phone || undefined
    }));
  } catch (error) {
    console.error('Error in fetchNearbyAttractions:', error);
    return [];
  }
};
