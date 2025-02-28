
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { LodgingType, RestaurantType, AttractionType } from "@/components/route-planning/types";

interface FormData {
  startPoint: string;
  destination: string;
  startDate: string;
  duration: string;
  fuelMileage: string;
  milesPerDay: string;
  preferredLodging: LodgingType;
  preferredRestaurant: RestaurantType;
  preferredAttraction: AttractionType;
}

interface RouteDetails {
  distance: number;
  duration: number;
  startPoint: string;
  destination: string;
}

interface FuelStop {
  location: [number, number];
  name: string;
  distance: number;
  rating?: number;
  website?: string;
  phone_number?: string;
}

interface HotelStop {
  location: [number, number];
  name: string;
  hotelName: string;
  distance: number;
  rating?: number;
  website?: string;
  phone_number?: string;
  lodgingType?: string;
}

interface RestaurantStop {
  location: [number, number];
  name: string;
  restaurantName: string;
  distance: number;
  rating?: number;
  website?: string;
  phone_number?: string;
  restaurantType?: string;
}

interface CampingStop {
  location: [number, number];
  name: string;
  campgroundName: string;
  distance: number;
  rating?: number;
  website?: string;
  phone_number?: string;
  campingType?: string;
}

export const useRoutePlanning = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    startPoint: "",
    destination: "",
    startDate: "",
    duration: "1",
    fuelMileage: "150",
    milesPerDay: "300",
    preferredLodging: "any",
    preferredRestaurant: "any",
    preferredAttraction: "any"
  });
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [currentRoute, setCurrentRoute] = useState<any>(null);
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [endCoords, setEndCoords] = useState<[number, number] | null>(null);
  const [fuelStops, setFuelStops] = useState<FuelStop[]>([]);
  const [hotelStops, setHotelStops] = useState<HotelStop[]>([]);
  const [forceRefresh, setForceRefresh] = useState(0);

  const handleFormDataChange = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
    
    // Mark that preferences have changed
    if (newData.preferredLodging || newData.preferredRestaurant || newData.preferredAttraction) {
      localStorage.setItem('preferencesChanged', 'true');
    }
  };

  // Function to force a reset of results when preferences change
  const resetResults = () => {
    setForceRefresh(prev => prev + 1);
    // We don't reset the route details or coordinates, just force a re-render
  };

  return {
    isLoading,
    formData,
    routeDetails,
    currentRoute,
    startCoords,
    endCoords,
    fuelStops,
    hotelStops,
    forceRefresh,
    handleFormDataChange,
    setIsLoading,
    setRouteDetails,
    setCurrentRoute,
    setStartCoords,
    setEndCoords,
    setFuelStops,
    setHotelStops,
    resetResults,
    toast
  };
};

export type { 
  FormData, 
  RouteDetails, 
  FuelStop, 
  HotelStop, 
  RestaurantStop, 
  CampingStop 
};
