
import React, { useEffect } from 'react';
import { RouteDetails as RouteDetailsType } from '@/hooks/useRoutePlanning';

interface DebugLoggerProps {
  routeDetails: RouteDetailsType;
  currentRoute: any;
  fuelStops: any[];
  hotelStops: any[];
  restaurantStops: any[];
  campingStops: any[];
  attractionStops: any[];
  preferredLodging: string;
  preferredRestaurant: string;
  preferredAttraction: string;
}

/**
 * Component that logs debug information
 */
const DebugLogger: React.FC<DebugLoggerProps> = ({
  routeDetails,
  currentRoute,
  fuelStops,
  hotelStops,
  restaurantStops,
  campingStops,
  attractionStops,
  preferredLodging,
  preferredRestaurant,
  preferredAttraction
}) => {
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
  }, [
    routeDetails, 
    currentRoute, 
    fuelStops, 
    hotelStops, 
    restaurantStops, 
    campingStops, 
    attractionStops, 
    preferredLodging, 
    preferredRestaurant, 
    preferredAttraction
  ]);

  return null; // This component doesn't render anything visible
};

export default DebugLogger;
