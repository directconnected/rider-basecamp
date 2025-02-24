
import React, { useEffect } from 'react';
import RouteDetails from './RouteDetails';
import RouteMap from './RouteMap';
import RouteItinerary from './RouteItinerary';
import { RouteDetails as RouteDetailsType, FuelStop, HotelStop } from '@/hooks/useRoutePlanning';

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
  useEffect(() => {
    // Debug logging
    console.log('Route Details:', routeDetails);
    console.log('Current Route:', currentRoute);
    console.log('Fuel Stops:', fuelStops);
    console.log('Hotel Stops:', hotelStops);
    console.log('Start Coordinates:', startCoords);
    console.log('End Coordinates:', endCoords);

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
  }, [routeDetails, currentRoute, fuelStops, hotelStops, startCoords, endCoords]);

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
        hotelStops={hotelStops}
        currentRoute={currentRoute}
      />
    </>
  );
};

export default RouteResults;
