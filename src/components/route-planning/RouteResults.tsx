
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
      <div>
        <SuggestedStops suggestions={suggestions} />
        {suggestions && suggestions.length > 0 ? (
          <p className="text-xs text-gray-500 mt-2">Suggestions loaded: {suggestions.length}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-2">No suggestions available</p>
        )}
      </div>
    </>
  );
};

export default RouteResults;
