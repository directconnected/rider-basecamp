
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import mapboxgl from 'mapbox-gl';
import { initializeMapbox, geocodeLocation } from "@/services/mapService";
import { calculateFuelStops, calculateHotelStops, planRoute } from "@/services/routeService";
import { FormData, RouteDetails, FuelStop, HotelStop } from "./useRoutePlanning";

export const useRouteCalculation = () => {
  const { toast } = useToast();

  const calculateRoute = async (
    formData: FormData,
    callbacks: {
      setIsLoading: (loading: boolean) => void;
      setStartCoords: (coords: [number, number]) => void;
      setEndCoords: (coords: [number, number]) => void;
      setCurrentRoute: (route: any) => void;
      setFuelStops: (stops: FuelStop[]) => void;
      setHotelStops: (stops: HotelStop[]) => void;
      setRouteDetails: (details: RouteDetails) => void;
    }
  ) => {
    const {
      setIsLoading,
      setStartCoords,
      setEndCoords,
      setCurrentRoute,
      setFuelStops,
      setHotelStops,
      setRouteDetails,
    } = callbacks;

    setIsLoading(true);
    try {
      if (!mapboxgl.accessToken) {
        const initialized = await initializeMapbox();
        if (!initialized) {
          toast({
            title: "Map Error",
            description: "Could not initialize the map service. Please try again later.",
            variant: "destructive"
          });
          return;
        }
      }

      const start = await geocodeLocation(formData.startPoint);
      const end = await geocodeLocation(formData.destination);

      if (!start || !end) {
        toast({
          title: "Location Error",
          description: "Could not find one or both locations. Please check your input and try again.",
          variant: "destructive"
        });
        return;
      }

      setStartCoords(start);
      setEndCoords(end);

      const route = await planRoute(start, end);
      
      if (!route?.geometry?.coordinates || route.geometry.coordinates.length === 0) {
        toast({
          title: "Route Error",
          description: "Could not calculate a valid route between these locations.",
          variant: "destructive"
        });
        return;
      }

      setCurrentRoute(route);
      
      const fuelMileage = parseInt(formData.fuelMileage);
      const milesPerDay = parseInt(formData.milesPerDay);
      
      const calculatedFuelStops = await calculateFuelStops(route, fuelMileage);
      const calculatedHotelStops = await calculateHotelStops(route, milesPerDay);
      
      setFuelStops(calculatedFuelStops);
      setHotelStops(calculatedHotelStops);

      const totalMiles = Math.round(route.distance / 1609.34);
      const numDays = Math.ceil(totalMiles / milesPerDay);

      setRouteDetails({
        distance: totalMiles,
        duration: Math.round(route.duration / 3600),
        startPoint: formData.startPoint,
        destination: formData.destination
      });

      toast({
        title: "Route Planned",
        description: `Your route has been planned with ${calculatedFuelStops.length} fuel stops and ${calculatedHotelStops.length} overnight stays.`,
      });
    } catch (error) {
      console.error("Route planning error:", error);
      toast({
        title: "Error",
        description: `There was an error planning your route: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { calculateRoute };
};
