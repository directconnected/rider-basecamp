
// Common types for all stops
export interface BaseStop {
  location: [number, number];
  name: string;
  distance: number;
}

// Interface for stops that have ratings
export interface RatedStop extends BaseStop {
  rating?: number;
  website?: string;
  phone_number?: string;
}

// Specific stop types
export interface HotelStop extends RatedStop {
  hotelName: string;
  lodgingType?: string;
}

export interface RestaurantStop extends RatedStop {
  restaurantName: string;
  restaurantType?: string;
}

export interface CampingStop extends RatedStop {
  campgroundName: string;
  campingType?: string;
  amenities?: string[]; // Adding amenities property to CampingStop
}

export interface AttractionStop extends RatedStop {
  attractionName: string;
  attractionType?: string;
}

// Props for RouteItinerary component
export interface RouteItineraryProps {
  startPoint: string;
  destination: string;
  distance: number;
  duration: number;
  fuelStops: BaseStop[];
  hotelStops: HotelStop[];
  restaurantStops?: RestaurantStop[];
  campingStops?: CampingStop[];
  attractionStops?: AttractionStop[];
  currentRoute: any;
  preferredLodging?: string;
}

// Lodging types
export type LodgingType = 'any' | 'hotel' | 'motel' | 'resort' | 'inn' | 'bed_and_breakfast' | 'campground';

// Restaurant types
export type RestaurantType = 
  'any' | 
  'italian' | 
  'mexican' | 
  'chinese' | 
  'american' | 
  'thai' | 
  'japanese' | 
  'indian' | 
  'fast_food' | 
  'pizza' | 
  'seafood' | 
  'steakhouse' | 
  'vegetarian' | 
  'breakfast' | 
  'cafe' | 
  'barbecue' | 
  'fine_dining' | 
  'casual' | 
  'asian';

// Attraction types
export type AttractionType = 
  'any' | 
  'museum' | 
  'park' | 
  'tourist_attraction' | 
  'amusement_park' | 
  'art_gallery' | 
  'historic_site' | 
  'natural_feature' | 
  'point_of_interest';
