
import React from 'react';
import RouteDetails from './RouteDetails';
import RouteMap from './RouteMap';
import RouteItinerary from './RouteItinerary';
import SuggestedStops from './SuggestedStops';
import { RouteDetails as RouteDetailsType, PointOfInterest, FuelStop } from '@/hooks/useRoutePlanning';

interface RouteResultsProps {
  routeDetails: RouteDetailsType;
  startCoords: [number, number];
  endCoords: [number, number];
  currentRoute: any;
  fuelStops: FuelStop[];
  suggestions: PointOfInterest[];
}

const RouteResults: React.FC<RouteResultsProps> = ({
  routeDetails,
  startCoords,
  endCoords,
  currentRoute,
  fuelStops,
  suggestions
}) => {
  console.log('Suggestions in RouteResults:', suggestions); // Debug log

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
      />
      <SuggestedStops suggestions={suggestions} />
    </>
  );
};

export default RouteResults;
