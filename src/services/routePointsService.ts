import { supabase } from "@/integrations/supabase/client";
import { CampgroundResult } from "@/hooks/camping/types"; 
import { findNearbyPoints } from "@/utils/distanceUtils";
import { 
  RestaurantType, 
  AttractionType, 
  LodgingType,
  RestaurantStop,
  HotelStop,
  CampingStop,
  AttractionStop
} from "@/components/route-planning/types";

/**
 * Interface representing the route points from the database
 */
export interface RoutePoint {
  id: string;
  name: string;
  point_type: 'fuel' | 'hotel' | 'restaurant' | 'camping' | 'attraction';
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  rating: number | null;
  review_count: number | null;
  price_level: number | null;
  lodging_type: string | null;
  restaurant_type: string | null;
  attraction_type: string | null;
  camping_type: string | null;
  amenities: string[] | null;
}

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
