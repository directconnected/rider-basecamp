
export interface Stop {
  name: string;
  location: [number, number];
  distance: number;
}

export interface RatedStop extends Stop {
  rating?: number;
  website?: string;
  phone_number?: string;
}

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
}

export interface AttractionStop extends RatedStop {
  attractionName: string;
  attractionType?: string;
}

export interface RouteItineraryProps {
  startPoint: string;
  destination: string;
  distance: number;
  duration: number;
  fuelStops: Stop[];
  hotelStops: HotelStop[];
  restaurantStops?: RestaurantStop[];
  campingStops?: CampingStop[];
  attractionStops?: AttractionStop[];
  currentRoute?: any;
}

export type LodgingType = 'hotel' | 'motel' | 'resort' | 'inn' | 'bed_and_breakfast' | 'campground' | 'any';
export type RestaurantType = 'fine_dining' | 'casual' | 'fast_food' | 'cafe' | 'steakhouse' | 'seafood' | 'italian' | 'mexican' | 'asian' | 'any';
export type AttractionType = 'museum' | 'park' | 'tourist_attraction' | 'amusement_park' | 'art_gallery' | 'historic_site' | 'natural_feature' | 'point_of_interest' | 'any';
