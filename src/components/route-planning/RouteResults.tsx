
import React, { useEffect } from 'react';
import RouteDetails from './RouteDetails';
import RouteMap from './RouteMap';
import RouteItinerary from './RouteItinerary';
import { RouteDetails as RouteDetailsType, FuelStop } from '@/hooks/useRoutePlanning';

interface RouteResultsProps {
  routeDetails: RouteDetailsType;
  startCoords: [number, number];
  endCoords: [number, number];
  currentRoute: any;
  fuelStops: FuelStop[];
}

const RouteResults: React.FC<RouteResultsProps> = ({
  routeDetails,
  startCoords,
  endCoords,
  currentRoute,
  fuelStops,
}) => {
  useEffect(() => {
    // Debug logging
    console.log('Route Details:', routeDetails);
    console.log('Current Route:', currentRoute);
    console.log('Fuel Stops:', fuelStops);
    console.log('Start Coordinates:', startCoords);
    console.log('End Coordinates:', endCoords);

    // Validation checks
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

    // Validate each fuel stop has required properties
    fuelStops.forEach((stop, index) => {
      if (!stop.location || !Array.isArray(stop.location) || stop.location.length !== 2) {
        console.error(`Invalid location for fuel stop at index ${index}:`, stop);
      }
      if (typeof stop.distance !== 'number') {
        console.error(`Invalid distance for fuel stop at index ${index}:`, stop);
      }
      if (typeof stop.name !== 'string') {
        console.error(`Invalid name for fuel stop at index ${index}:`, stop);
      }
    });
  }, [routeDetails, currentRoute, fuelStops, startCoords, endCoords]);

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
      />
      <RouteItinerary
        startPoint={routeDetails.startPoint}
        destination={routeDetails.destination}
        distance={routeDetails.distance}
        duration={routeDetails.duration}
        fuelStops={fuelStops}
        currentRoute={currentRoute}
      />
    </>
  );
};

export default RouteResults;
