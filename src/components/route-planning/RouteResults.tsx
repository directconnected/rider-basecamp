
import React, { useState } from 'react';
import RouteDetails from './RouteDetails';
import RouteMap from './RouteMap';
import RouteItinerary from './RouteItinerary';
import { RouteDetails as RouteDetailsType, FuelStop, HotelStop } from '@/hooks/useRoutePlanning';
import { RestaurantStop, CampingStop, AttractionStop, AttractionType, RestaurantType } from './types';
import PreferenceTracker from './PreferenceTracker';
import StopsCalculator from './StopsCalculator';
import DebugLogger from './DebugLogger';

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
  const [preferredRestaurant, setPreferredRestaurant] = useState<RestaurantType>('any');
  const [preferredAttraction, setPreferredAttraction] = useState<AttractionType>('any');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  // Use this to force recalculation when preferences change
  const [needsRefresh, setNeedsRefresh] = useState<boolean>(true);

  // Check if preferences have changed
  const havePreferencesChanged = () => {
    // This function is now managed in the PreferenceTracker component
    // but we still need to return something for compatibility
    return false;
  };

  if (!routeDetails || !currentRoute?.geometry?.coordinates || !Array.isArray(fuelStops)) {
    console.error('Missing required data for route rendering');
    return null;
  }

  // Create force refresh function to make it easier to debug
  const forceRefreshStops = () => {
    setNeedsRefresh(true);
  };

  return (
    <>
      {/* Components that track preferences and calculate stops */}
      <PreferenceTracker
        onPreferencesChanged={() => setNeedsRefresh(true)}
        setPreferredLodging={setPreferredLodging}
        setPreferredRestaurant={setPreferredRestaurant}
        setPreferredAttraction={setPreferredAttraction}
        preferredLodging={preferredLodging}
        preferredRestaurant={preferredRestaurant}
        preferredAttraction={preferredAttraction}
      />
      
      <StopsCalculator
        isCalculating={isCalculating}
        setIsCalculating={setIsCalculating}
        needsRefresh={needsRefresh}
        setNeedsRefresh={setNeedsRefresh}
        currentRoute={currentRoute}
        routeDetails={routeDetails}
        hotelStops={hotelStops}
        preferredLodging={preferredLodging}
        preferredRestaurant={preferredRestaurant}
        preferredAttraction={preferredAttraction}
        setRestaurantStops={setRestaurantStops}
        setCampingStops={setCampingStops}
        setAttractionStops={setAttractionStops}
        restaurantStops={restaurantStops}
        havePreferencesChanged={havePreferencesChanged}
      />
      
      <DebugLogger
        routeDetails={routeDetails}
        currentRoute={currentRoute}
        fuelStops={fuelStops}
        hotelStops={hotelStops}
        restaurantStops={restaurantStops}
        campingStops={campingStops}
        attractionStops={attractionStops}
        preferredLodging={preferredLodging}
        preferredRestaurant={preferredRestaurant}
        preferredAttraction={preferredAttraction}
      />

      {/* Visible components */}
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
