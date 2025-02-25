
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  startPoint: string;
  destination: string;
  startDate: string;
  duration: string;
  fuelMileage: string;
  milesPerDay: string;
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
}

interface HotelStop {
  location: [number, number];
  name: string;
  hotelName: string;
  distance: number;
  rating?: number;
  website?: string;
  phone_number?: string;
}

interface RestaurantStop {
  location: [number, number];
  name: string;
  restaurantName: string;
  distance: number;
  rating?: number;
  website?: string;
  phone_number?: string;
}

interface CampingStop {
  location: [number, number];
  name: string;
  campgroundName: string;
  distance: number;
  rating?: number;
  website?: string;
  phone_number?: string;
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
    milesPerDay: "300"
  });
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [currentRoute, setCurrentRoute] = useState<any>(null);
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [endCoords, setEndCoords] = useState<[number, number] | null>(null);
  const [fuelStops, setFuelStops] = useState<FuelStop[]>([]);
  const [hotelStops, setHotelStops] = useState<HotelStop[]>([]);

  const handleFormDataChange = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
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
    handleFormDataChange,
    setIsLoading,
    setRouteDetails,
    setCurrentRoute,
    setStartCoords,
    setEndCoords,
    setFuelStops,
    setHotelStops,
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
