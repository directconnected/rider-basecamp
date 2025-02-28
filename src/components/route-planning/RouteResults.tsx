
import React, { useEffect, useState } from 'react';
import RouteDetails from './RouteDetails';
import RouteMap from './RouteMap';
import RouteItinerary from './RouteItinerary';
import { RouteDetails as RouteDetailsType, FuelStop, HotelStop } from '@/hooks/useRoutePlanning';
import { 
  calculateRestaurantStops, 
  calculateCampingStops, 
  calculateAttractionStops 
} from '@/services/route-planning';
import { RestaurantStop, CampingStop, AttractionStop, AttractionType } from './types';

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
  const [restaurantStops, setRestaurantStops] = useState<RestaurantStop[]>([]);
  const [campingStops, setCampingStops] = useState<CampingStop[]>([]);
  const [attractionStops, setAttractionStops] = useState<AttractionStop[]>([]);
  const [preferredLodging, setPreferredLodging] = useState<string>('any');
  const [preferredRestaurant, setPreferredRestaurant] = useState<string>('any');
  const [preferredAttraction, setPreferredAttraction] = useState<AttractionType>('any');

  // Load preferences from localStorage on initial render
  useEffect(() => {
    const storedLodging = localStorage.getItem('preferredLodging');
    if (storedLodging) {
      setPreferredLodging(storedLodging);
      console.log('Loaded stored lodging preference:', storedLodging);
    }
    
    const storedRestaurant = localStorage.getItem('preferredRestaurant');
    if (storedRestaurant) {
      setPreferredRestaurant(storedRestaurant);
      console.log('Loaded stored restaurant preference:', storedRestaurant);
    }
    
    const storedAttraction = localStorage.getItem('preferredAttraction');
    if (storedAttraction) {
      console.log('Loaded stored attraction preference:', storedAttraction);
      setPreferredAttraction(storedAttraction as AttractionType);
    }
  }, []);

  // Calculate additional stops when route or preferences change
  useEffect(() => {
    const calculateAdditionalStops = async () => {
      if (currentRoute?.geometry?.coordinates) {
        try {
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
          const attractions = await calculateAttractionStops(currentRoute, 100, preferredAttraction);
          setAttractionStops(attractions);
          console.log('Calculated attraction stops:', attractions);
          console.log('Attraction types:', attractions.map(a => a.attractionType));
        } catch (error) {
          console.error('Error calculating additional stops:', error);
        }
      }
    };

    calculateAdditionalStops();
  }, [currentRoute, routeDetails, hotelStops, preferredLodging, preferredRestaurant, preferredAttraction]);

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
