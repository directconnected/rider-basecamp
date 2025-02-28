
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List, FileDown, Hotel, UtensilsCrossed, Tent, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadGPX } from "@/utils/gpxGenerator";
import StopSection from "./StopSection";
import TravelTips from "./TravelTips";
import { RouteItineraryProps, HotelStop, RestaurantStop, CampingStop, AttractionStop, RatedStop } from "./types";

const RouteItinerary = ({ 
  startPoint, 
  destination, 
  distance, 
  duration, 
  fuelStops,
  hotelStops,
  restaurantStops = [],
  campingStops = [],
  attractionStops = [],
  currentRoute 
}: RouteItineraryProps) => {
  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const handleDownloadGPX = () => {
    if (!currentRoute?.geometry?.coordinates) {
      console.error('Cannot generate GPX: Missing route coordinates');
      return;
    }
    downloadGPX(startPoint, destination, currentRoute, fuelStops);
  };

  // Combine hotel stays and camping into a single array for display
  const allStays: RatedStop[] = [
    ...hotelStops.map(hotel => ({
      ...hotel,
      lodgingType: hotel.lodgingType || 'hotel'
    })),
    ...campingStops.map(camp => ({
      ...camp,
      hotelName: camp.campgroundName,
      lodgingType: camp.campingType || 'campground'
    }))
  ].sort((a, b) => a.distance - b.distance);

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5 text-theme-600" />
          Route Itinerary
        </CardTitle>
        {currentRoute?.geometry?.coordinates && (
          <Button
            variant="outline"
            onClick={handleDownloadGPX}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Download GPX
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose max-w-none">
          <p className="text-lg">
            Your route from <span className="font-semibold">{startPoint}</span> to{" "}
            <span className="font-semibold">{destination}</span> covers{" "}
            <span className="font-semibold">{distance} miles</span> and takes approximately{" "}
            <span className="font-semibold">{formatDuration(duration)}</span>.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Suggested Fuel Stops:</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <p className="text-base">Start at {startPoint}</p>
            </div>
            
            {Array.isArray(fuelStops) && fuelStops.map((stop, index) => (
              <div key={`fuel-${index}`} className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <p className="text-base">
                  {stop.name} - {Math.round(stop.distance)} miles from start
                </p>
              </div>
            ))}
          </div>
        </div>

        <StopSection
          title="Suggested Stays"
          icon={Hotel}
          color="bg-purple-500"
          stops={allStays}
          getStopName={(stop) => {
            if ('campgroundName' in stop) {
              return (stop as CampingStop).campgroundName;
            } else {
              return (stop as HotelStop).hotelName;
            }
          }}
          getStopType={(stop) => {
            if ('campgroundName' in stop) {
              return 'campground';
            } else {
              return (stop as HotelStop).lodgingType || 'hotel';
            }
          }}
        />

        <StopSection
          title="Suggested Restaurants"
          icon={UtensilsCrossed}
          color="bg-orange-500"
          stops={restaurantStops}
          getStopName={(stop) => (stop as RestaurantStop).restaurantName}
          getStopType={(stop) => (stop as RestaurantStop).restaurantType || 'restaurant'}
        />

        <StopSection
          title="Suggested Things to Do"
          icon={Landmark}
          color="bg-blue-500"
          stops={attractionStops}
          getStopName={(stop) => (stop as AttractionStop).attractionName}
          getStopType={(stop) => (stop as AttractionStop).attractionType || 'attraction'}
        />

        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <p className="text-base">
            Arrive at {destination} - {distance} miles total
          </p>
        </div>

        <TravelTips />
      </CardContent>
    </Card>
  );
};

export default RouteItinerary;
