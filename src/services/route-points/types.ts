
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
