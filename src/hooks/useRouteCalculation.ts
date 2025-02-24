
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import mapboxgl from 'mapbox-gl';
import { initializeMapbox, geocodeLocation, getLocationName } from "@/services/mapService";
import { calculateFuelStops, planRoute } from "@/services/routeService";
import { FormData, RouteDetails, PointOfInterest, FuelStop } from "./useRoutePlanning";

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
      setRouteDetails: (details: RouteDetails) => void;
      setSuggestions: (suggestions: PointOfInterest[]) => void;
    }
  ) => {
    const {
      setIsLoading,
      setStartCoords,
      setEndCoords,
      setCurrentRoute,
      setFuelStops,
      setRouteDetails,
      setSuggestions
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
      
      const calculatedFuelStops = await calculateFuelStops(route);
      setFuelStops(calculatedFuelStops);

      const totalMiles = Math.round(route.distance / 1609.34);
      const milesPerDay = parseInt(formData.milesPerDay);
      const numDays = Math.ceil(totalMiles / milesPerDay);
      const coordinates = route.geometry.coordinates;
      const suggestions = [];

      // Calculate stops based on days
      for (let i = 1; i <= numDays; i++) {
        const progress = i / numDays;
        const index = Math.floor(coordinates.length * progress);
        if (index < coordinates.length) {
          const coord = coordinates[index];
          
          // Add restaurant for lunch (midday)
          if (i < numDays) {
            const lunchProgress = (i - 0.5) / numDays;
            const lunchIndex = Math.floor(coordinates.length * lunchProgress);
            if (lunchIndex < coordinates.length) {
              const lunchCoord = coordinates[lunchIndex];
              const restaurantName = await getLocationName([lunchCoord[0], lunchCoord[1]], 'restaurant');
              const locationName = await getLocationName([lunchCoord[0], lunchCoord[1]]);
              
              suggestions.push({
                name: restaurantName,
                type: 'restaurant' as const,
                location: [lunchCoord[0], lunchCoord[1]],
                description: `Restaurant in ${locationName} for lunch on day ${i} (${Math.round(lunchProgress * totalMiles)} miles)`
              });
            }
          }

          // Add accommodation options for overnight
          const hotelName = await getLocationName([coord[0], coord[1]], 'hotel');
          const campingName = await getLocationName([coord[0], coord[1]], 'camping');
          const locationName = await getLocationName([coord[0], coord[1]]);

          suggestions.push({
            name: hotelName,
            type: 'hotel' as const,
            location: [coord[0], coord[1]],
            description: `Hotel in ${locationName} for night ${i} (${Math.round(progress * totalMiles)} miles)`
          });

          suggestions.push({
            name: campingName,
            type: 'camping' as const,
            location: [coord[0], coord[1]],
            description: `Campground in ${locationName} for night ${i} (${Math.round(progress * totalMiles)} miles)`
          });
        }
      }

      setRouteDetails({
        distance: totalMiles,
        duration: Math.round(route.duration / 3600),
        startPoint: formData.startPoint,
        destination: formData.destination
      });

      console.log('Setting suggestions:', suggestions);
      setSuggestions(suggestions);

      toast({
        title: "Route Planned",
        description: "Your route has been planned with suggested stops and fuel stops.",
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
