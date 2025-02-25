
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
}

export interface RestaurantStop extends RatedStop {
  restaurantName: string;
}

export interface CampingStop extends RatedStop {
  campgroundName: string;
}

export interface AttractionStop extends RatedStop {
  attractionName: string;
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
