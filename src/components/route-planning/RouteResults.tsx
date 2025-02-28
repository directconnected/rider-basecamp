
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
  const [preferredAttraction, setPreferredAttraction] = useState<AttractionType>('any');

  useEffect(() => {
    const storedPreferredLodging = localStorage.getItem('preferredLodging');
    if (storedPreferredLodging) {
      setPreferredLodging(storedPreferredLodging);
    }
    
    const storedPreferredAttraction = localStorage.getItem('preferredAttraction');
    if (storedPreferredAttraction) {
      setPreferredAttraction(storedPreferredAttraction as AttractionType);
    }
  }, []);

  useEffect(() => {
    const calculateAdditionalStops = async () => {
      if (currentRoute?.geometry?.coordinates) {
        try {
          const preferredRestaurant = localStorage.getItem('preferredRestaurant') || 'any';
          
          const restaurants = await calculateRestaurantStops(currentRoute, 150, preferredRestaurant);
          setRestaurantStops(restaurants);
          console.log('Calculated restaurant stops:', restaurants);

          if (preferredLodging === 'campground') {
            const camping = await calculateCampingStops(currentRoute, Math.floor(routeDetails.distance / hotelStops.length));
            setCampingStops(camping);
            console.log('Calculated camping stops:', camping);
          } else {
            setCampingStops([]);
          }

          console.log('Calculating attractions with type:', preferredAttraction);
          const attractions = await calculateAttractionStops(currentRoute, 100, preferredAttraction);
          setAttractionStops(attractions);
          console.log('Calculated attraction stops:', attractions);
        } catch (error) {
          console.error('Error calculating additional stops:', error);
        }
      }
    };

    calculateAdditionalStops();
  }, [currentRoute, routeDetails, hotelStops, preferredLodging, preferredAttraction]);

  useEffect(() => {
    console.log('Route Details:', routeDetails);
    console.log('Current Route:', currentRoute);
    console.log('Fuel Stops:', fuelStops);
    console.log('Hotel Stops:', hotelStops);
    console.log('Restaurant Stops:', restaurantStops);
    console.log('Camping Stops:', campingStops);
    console.log('Attraction Stops:', attractionStops);
    console.log('Start Coordinates:', startCoords);
    console.log('End Coordinates:', endCoords);
    console.log('Preferred Lodging Type:', preferredLodging);
    console.log('Preferred Attraction Type:', preferredAttraction);

    if (!routeDetails) {
      console.error('Route details is missing');
      return;
    }

    if (!currentRoute?.geometry?.coordinates) {
      console.error('Current route is missing or has invalid structure');
      return;
    }

    if (!Array.isArray(fuelStops)) {
      console.error('Fuel stops is not an array');
      return;
    }

    if (!Array.isArray(hotelStops)) {
      console.error('Hotel stops is not an array');
      return;
    }
  }, [routeDetails, currentRoute, fuelStops, hotelStops, restaurantStops, campingStops, attractionStops, startCoords, endCoords, preferredLodging, preferredAttraction]);

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
