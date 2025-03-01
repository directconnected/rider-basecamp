
import mapboxgl from 'mapbox-gl';
import { useToast } from "@/components/ui/use-toast";
import { initializeMapbox, geocodeLocation } from "@/services/mapService";
import { calculateFuelStops, calculateHotelStops, planRoute } from "@/services/routeService";
import { FormData, RouteDetails, FuelStop, HotelStop } from "./useRoutePlanning";
import { fetchNearbyFuelStops } from "@/services/routePointsService";

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
      
      // Try to use database fuel stops first, fall back to calculated ones if needed
      const totalDistanceInMiles = Math.round(route.distance / 1609.34);
      const numFuelStops = Math.max(1, Math.ceil(totalDistanceInMiles / fuelMileage));
      const databaseFuelStops: FuelStop[] = [];
      
      // Try to get fuel stops from the database at roughly evenly-spaced intervals
      for (let i = 1; i <= numFuelStops; i++) {
        const stopDistance = (i * fuelMileage) > totalDistanceInMiles 
          ? totalDistanceInMiles - 20 // Just before the destination
          : i * fuelMileage;
          
        const stopIndex = Math.floor((stopDistance / totalDistanceInMiles) * route.geometry.coordinates.length);
        if (stopIndex < route.geometry.coordinates.length) {
          const [lon, lat] = route.geometry.coordinates[stopIndex];
          const nearbyFuelStops = await fetchNearbyFuelStops(lat, lon, 1);
          
          if (nearbyFuelStops.length > 0) {
            const fuelStop = {
              ...nearbyFuelStops[0],
              distance: stopDistance,
            };
            databaseFuelStops.push(fuelStop);
          }
        }
      }
      
      // Use database fuel stops if we found enough, otherwise use the calculation
      const calculatedFuelStops = await calculateFuelStops(route, fuelMileage);
      const fuelStopsToUse = databaseFuelStops.length >= numFuelStops / 2 
        ? databaseFuelStops 
        : calculatedFuelStops;
      
      // Save preferences to localStorage for reference by other components
      if (formData.preferredLodging) {
        localStorage.setItem('preferredLodging', formData.preferredLodging);
        console.log('useRouteCalculation saved preferredLodging:', formData.preferredLodging);
      }
      if (formData.preferredRestaurant) {
        localStorage.setItem('preferredRestaurant', formData.preferredRestaurant);
        console.log('useRouteCalculation saved preferredRestaurant:', formData.preferredRestaurant);
      }
      if (formData.preferredAttraction) {
        localStorage.setItem('preferredAttraction', formData.preferredAttraction);
        console.log('useRouteCalculation saved preferredAttraction:', formData.preferredAttraction);
      }

      const calculatedHotelStops = await calculateHotelStops(
        route, 
        milesPerDay, 
        formData.preferredLodging
      );
      
      setFuelStops(fuelStopsToUse);
      setHotelStops(calculatedHotelStops);

      const totalMiles = Math.round(route.distance / 1609.34);

      setRouteDetails({
        distance: totalMiles,
        duration: Math.round(route.duration / 3600),
        startPoint: formData.startPoint,
        destination: formData.destination
      });

      toast({
        title: "Route Planned",
        description: `Your route has been planned with ${fuelStopsToUse.length} fuel stops and ${calculatedHotelStops.length} overnight stays.`,
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
