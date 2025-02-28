
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
  
  // Use this to force recalculation when preferences change
  const [needsRefresh, setNeedsRefresh] = useState<boolean>(true);
  
  // Store previous preferences to detect changes
  const prevLodgingRef = useRef<string>('any');
  const prevRestaurantRef = useRef<RestaurantType>('any');
  const prevAttractionRef = useRef<AttractionType>('any');

  // Check for preference changes in localStorage
  useEffect(() => {
    const intervalId = setInterval(() => {
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
        setNeedsRefresh(true);
        console.log('Preferences changed, will recalculate stops');
      }
    }, 500);
    
    return () => clearInterval(intervalId);
  }, [preferredLodging, preferredRestaurant, preferredAttraction]);

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
      
      if (isCalculating) return;
      
      // Check if we need to recalculate
      if (!needsRefresh && !preferenceChanged && restaurantStops.length > 0) {
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
        
        // Reset all collections before recalculating
        setRestaurantStops([]);
        setAttractionStops([]);
        if (preferredLodging === 'campground') {
          setCampingStops([]);
        }
        
        // Restaurant stops
        console.log('Calculating restaurant stops with type:', preferredRestaurant);
        const restaurants = await calculateRestaurantStops(currentRoute, 150, preferredRestaurant);
        console.log('Calculated restaurant stops:', restaurants);
        setRestaurantStops(restaurants);
        
        // Verify restaurant types - debug logging
        if (restaurants.length > 0) {
          console.log('Restaurant types calculated:', restaurants.map(r => ({
            name: r.restaurantName,
            type: r.restaurantType
          })));
        } else {
          console.log('No restaurant stops found for type:', preferredRestaurant);
        }

        // Camping stops (only if preferred lodging is campground)
        if (preferredLodging === 'campground') {
          console.log('Calculating camping stops for campground preference');
          const camping = await calculateCampingStops(
            currentRoute, 
            Math.floor(routeDetails.distance / (hotelStops.length || 1))
          );
          setCampingStops(camping);
          console.log('Calculated camping stops:', camping);
        }

        // Attraction stops with proper type filtering
        console.log('Calculating attraction stops with type:', preferredAttraction);
        const attractions = await calculateAttractionStops(currentRoute, 100, preferredAttraction);
        console.log('Calculated attraction stops:', attractions);
        setAttractionStops(attractions);
        
        // Verify attraction types - debug logging
        if (attractions.length > 0) {
          console.log('Attraction types calculated:', attractions.map(a => ({
            name: a.attractionName,
            type: a.attractionType
          })));
        } else {
          console.log('No attraction stops found for type:', preferredAttraction);
        }
        
        // Reset the refresh flag
        setNeedsRefresh(false);
        
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
  }, [currentRoute, routeDetails, hotelStops, preferredLodging, preferredRestaurant, preferredAttraction, needsRefresh]);

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
