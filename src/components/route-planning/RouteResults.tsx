
import React, { useEffect, useState, useRef } from 'react';
import RouteDetails from './RouteDetails';
import RouteMap from './RouteMap';
import RouteItinerary from './RouteItinerary';
import { RouteDetails as RouteDetailsType, FuelStop, HotelStop } from '@/hooks/useRoutePlanning';
import { 
  calculateRestaurantStops, 
  calculateCampingStops, 
  calculateAttractionStops 
} from '@/services/route-planning';
import { RestaurantStop, CampingStop, AttractionStop, AttractionType, RestaurantType } from './types';
import { useToast } from '@/components/ui/use-toast';

interface RouteResultsProps {
  routeDetails: RouteDetailsType;
  startCoords: [number, number];
  endCoords: [number, number];
  currentRoute: any;
  fuelStops: FuelStop[];
  hotelStops: HotelStop[];
}

const RouteResults: React.FC<RouteResultsProps> = ({
  routeDetails,
  startCoords,
  endCoords,
  currentRoute,
  fuelStops,
  hotelStops,
}) => {
  const { toast } = useToast();
  const [restaurantStops, setRestaurantStops] = useState<RestaurantStop[]>([]);
  const [campingStops, setCampingStops] = useState<CampingStop[]>([]);
  const [attractionStops, setAttractionStops] = useState<AttractionStop[]>([]);
  const [preferredLodging, setPreferredLodging] = useState<string>('any');
  const [preferredRestaurant, setPreferredRestaurant] = useState<RestaurantType>('any');
  const [preferredAttraction, setPreferredAttraction] = useState<AttractionType>('any');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  // Use refs to track when preferences change
  const prevLodgingRef = useRef<string>('any');
  const prevRestaurantRef = useRef<RestaurantType>('any');
  const prevAttractionRef = useRef<AttractionType>('any');
  const intervalIdRef = useRef<number | null>(null);

  // Define the checkForPreferenceChanges function here
  const checkForPreferenceChanges = () => {
    const storedLodging = localStorage.getItem('preferredLodging');
    const storedRestaurant = localStorage.getItem('preferredRestaurant');
    const storedAttraction = localStorage.getItem('preferredAttraction');
    
    let changed = false;
    
    if (storedLodging && storedLodging !== preferredLodging) {
      setPreferredLodging(storedLodging);
      changed = true;
      console.log('Preference changed: lodging from', preferredLodging, 'to', storedLodging);
    }
    
    if (storedRestaurant && storedRestaurant !== preferredRestaurant) {
      setPreferredRestaurant(storedRestaurant as RestaurantType);
      changed = true;
      console.log('Preference changed: restaurant from', preferredRestaurant, 'to', storedRestaurant);
    }
    
    if (storedAttraction && storedAttraction !== preferredAttraction) {
      setPreferredAttraction(storedAttraction as AttractionType);
      changed = true;
      console.log('Preference changed: attraction from', preferredAttraction, 'to', storedAttraction);
    }
    
    if (changed) {
      // Set a flag to force recalculation on the next effect run
      localStorage.setItem('forceRefresh', 'true');
    }
  };

  // Load preferences from localStorage on initial render
  useEffect(() => {
    const storedLodging = localStorage.getItem('preferredLodging');
    if (storedLodging) {
      setPreferredLodging(storedLodging);
      prevLodgingRef.current = storedLodging;
      console.log('Loaded stored lodging preference:', storedLodging);
    }
    
    const storedRestaurant = localStorage.getItem('preferredRestaurant');
    if (storedRestaurant) {
      // Cast to RestaurantType for type safety
      setPreferredRestaurant(storedRestaurant as RestaurantType);
      prevRestaurantRef.current = storedRestaurant as RestaurantType;
      console.log('Loaded stored restaurant preference:', storedRestaurant);
    }
    
    const storedAttraction = localStorage.getItem('preferredAttraction');
    if (storedAttraction) {
      console.log('Loaded stored attraction preference:', storedAttraction);
      setPreferredAttraction(storedAttraction as AttractionType);
      prevAttractionRef.current = storedAttraction as AttractionType;
    }
    
    // Clear any pending preference change flags
    localStorage.setItem('preferencesChanged', 'false');
    localStorage.setItem('forceRefresh', 'false');
    
    // One-time check for preference changes when component mounts
    checkForPreferenceChanges();
    
    // Setup a polling interval to check for preference changes
    intervalIdRef.current = window.setInterval(() => {
      checkForPreferenceChanges();
    }, 1000) as unknown as number;
    
    // Clean up interval on unmount
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, []);

  // Check if preferences have changed
  const havePreferencesChanged = () => {
    const hasLodgingChanged = prevLodgingRef.current !== preferredLodging;
    const hasRestaurantChanged = prevRestaurantRef.current !== preferredRestaurant;
    const hasAttractionChanged = prevAttractionRef.current !== preferredAttraction;
    
    if (hasLodgingChanged || hasRestaurantChanged || hasAttractionChanged) {
      console.log('Preferences have changed:', {
        lodging: { from: prevLodgingRef.current, to: preferredLodging },
        restaurant: { from: prevRestaurantRef.current, to: preferredRestaurant },
        attraction: { from: prevAttractionRef.current, to: preferredAttraction }
      });
      
      // Update the refs to the current values
      prevLodgingRef.current = preferredLodging;
      prevRestaurantRef.current = preferredRestaurant;
      prevAttractionRef.current = preferredAttraction;
      
      return true;
    }
    
    return false;
  };

  // Calculate additional stops when route or preferences change
  useEffect(() => {
    const calculateAdditionalStops = async () => {
      if (!currentRoute?.geometry?.coordinates) return;
      
      const preferenceChanged = havePreferencesChanged();
      const forceRefresh = localStorage.getItem('forceRefresh') === 'true';
      
      if (isCalculating) return;
      
      // Check if we need to recalculate
      if (!preferenceChanged && !forceRefresh && restaurantStops.length > 0) {
        console.log('Skipping recalculation as nothing has changed');
        return;
      }
      
      setIsCalculating(true);
      
      try {
        toast({
          title: "Updating your route",
          description: "Recalculating stops based on your preferences...",
          duration: 3000,
        });
        
        // Restaurant stops
        console.log('Calculating restaurant stops with type:', preferredRestaurant);
        const restaurants = await calculateRestaurantStops(currentRoute, 150, preferredRestaurant);
        setRestaurantStops(restaurants);
        console.log('Calculated restaurant stops:', restaurants);
        console.log('Restaurant types:', restaurants.map(r => r.restaurantType));

        // Camping stops (only if preferred lodging is campground)
        if (preferredLodging === 'campground') {
          console.log('Calculating camping stops for campground preference');
          const camping = await calculateCampingStops(currentRoute, Math.floor(routeDetails.distance / hotelStops.length));
          setCampingStops(camping);
          console.log('Calculated camping stops:', camping);
        } else {
          setCampingStops([]);
        }

        // Attraction stops with proper type filtering
        console.log('Calculating attraction stops with type:', preferredAttraction);
        // Reduce interval for attraction stops to get more results
        const attractions = await calculateAttractionStops(currentRoute, 100, preferredAttraction);
        setAttractionStops(attractions);
        console.log('Calculated attraction stops:', attractions);
        console.log('Attraction types:', attractions.map(a => a.attractionType));
        
        // Clear the force refresh flag
        localStorage.setItem('forceRefresh', 'false');
        localStorage.setItem('preferencesChanged', 'false');
        
        toast({
          title: "Route updated",
          description: "Your route has been updated with new preferences.",
          duration: 3000,
        });
      } catch (error) {
        console.error('Error calculating additional stops:', error);
        toast({
          title: "Error updating route",
          description: "There was a problem updating your route. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsCalculating(false);
      }
    };

    calculateAdditionalStops();
  }, [currentRoute, routeDetails, hotelStops, preferredLodging, preferredRestaurant, preferredAttraction, isCalculating]);

  // Debug logging
  useEffect(() => {
    console.log('Route Details:', routeDetails);
    console.log('Current Route:', currentRoute?.distance);
    console.log('Fuel Stops:', fuelStops.length);
    console.log('Hotel Stops:', hotelStops.length);
    console.log('Restaurant Stops:', restaurantStops.length);
    console.log('Camping Stops:', campingStops.length);
    console.log('Attraction Stops:', attractionStops.length);
    console.log('Preferred Lodging Type:', preferredLodging);
    console.log('Preferred Restaurant Type:', preferredRestaurant);
    console.log('Preferred Attraction Type:', preferredAttraction);
  }, [routeDetails, currentRoute, fuelStops, hotelStops, restaurantStops, campingStops, attractionStops, preferredLodging, preferredRestaurant, preferredAttraction]);

  if (!routeDetails || !currentRoute?.geometry?.coordinates || !Array.isArray(fuelStops)) {
    console.error('Missing required data for route rendering');
    return null;
  }

  return (
    <>
      <RouteDetails 
        startPoint={routeDetails.startPoint}
        destination={routeDetails.destination}
        distance={routeDetails.distance}
        duration={routeDetails.duration}
      />
      <RouteMap
        startCoords={startCoords}
        endCoords={endCoords}
        route={currentRoute}
        fuelStops={fuelStops}
        hotelStops={hotelStops}
      />
      <RouteItinerary
        startPoint={routeDetails.startPoint}
        destination={routeDetails.destination}
        distance={routeDetails.distance}
        duration={routeDetails.duration}
        fuelStops={fuelStops}
        hotelStops={preferredLodging === 'campground' ? [] : hotelStops}
        restaurantStops={restaurantStops}
        campingStops={preferredLodging === 'campground' ? campingStops : []}
        attractionStops={attractionStops}
        currentRoute={currentRoute}
        preferredLodging={preferredLodging}
      />
    </>
  );
};

export default RouteResults;
