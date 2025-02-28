
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
  currentRoute,
  preferredLodging = 'any'
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

  // Get the appropriate stays based on preferred lodging type
  let stayTitle = "Suggested Stays";
  let stayIcon = Hotel;
  let stayColor = "bg-purple-500";

  if (preferredLodging === 'campground') {
    stayTitle = "Suggested Campgrounds";
    stayIcon = Tent;
    stayColor = "bg-green-700";
  }

  // Only use the appropriate stays based on the preferred lodging type
  const allStays: RatedStop[] = preferredLodging === 'campground'
    ? campingStops.map(camp => ({
        ...camp,
        hotelName: camp.campgroundName,
        lodgingType: 'campground'
      }))
    : hotelStops.map(hotel => ({
        ...hotel,
        lodgingType: preferredLodging === 'any' ? 'any' : preferredLodging
      }));

  // Sort by distance
  allStays.sort((a, b) => a.distance - b.distance);

  // Get preferred attraction type from localStorage
  const preferredAttraction = localStorage.getItem('preferredAttraction') || 'any';
  console.log('Preferred attraction type from localStorage:', preferredAttraction);
  
  // Get preferred restaurant type from localStorage
  const preferredRestaurant = localStorage.getItem('preferredRestaurant') || 'any';
  
  // Filter restaurant stops to only include the preferred type
  const filteredRestaurantStops = preferredRestaurant === 'any' 
    ? restaurantStops 
    : restaurantStops.filter(stop => stop.restaurantType === preferredRestaurant);
  
  console.log(`Filtered restaurant stops from ${restaurantStops.length} to ${filteredRestaurantStops.length} for type ${preferredRestaurant}`);
  
  // Filter attraction stops to only include the preferred type
  const filteredAttractionStops = preferredAttraction === 'any' 
    ? attractionStops 
    : attractionStops.filter(stop => stop.attractionType === preferredAttraction);
  
  console.log(`Filtered attraction stops from ${attractionStops.length} to ${filteredAttractionStops.length} for type ${preferredAttraction}`);
  
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

        {allStays.length > 0 && (
          <StopSection
            title={stayTitle}
            icon={stayIcon}
            color={stayColor}
            stops={allStays}
            getStopName={(stop) => {
              if ('campgroundName' in stop) {
                return (stop as CampingStop).campgroundName;
              } else {
                return (stop as HotelStop).hotelName;
              }
            }}
            getStopType={(stop) => preferredLodging}
          />
        )}

        {filteredRestaurantStops.length > 0 && (
          <StopSection
            title="Suggested Restaurants"
            icon={UtensilsCrossed}
            color="bg-orange-500"
            stops={filteredRestaurantStops}
            getStopName={(stop) => (stop as RestaurantStop).restaurantName}
            getStopType={(stop) => (stop as RestaurantStop).restaurantType}
          />
        )}

        {filteredAttractionStops.length > 0 && (
          <StopSection
            title="Suggested Things to Do"
            icon={Landmark}
            color="bg-blue-500"
            stops={filteredAttractionStops}
            getStopName={(stop) => (stop as AttractionStop).attractionName}
            getStopType={(stop) => (stop as AttractionStop).attractionType}
          />
        )}

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
