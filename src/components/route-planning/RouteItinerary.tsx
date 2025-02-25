
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List, FileDown, Hotel, UtensilsCrossed, Tent, Landmark, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadGPX } from "@/utils/gpxGenerator";

interface RouteItineraryProps {
  startPoint: string;
  destination: string;
  distance: number;
  duration: number;
  fuelStops: Array<{
    name: string;
    location: [number, number];
    distance: number;
  }>;
  hotelStops: Array<{
    name: string;
    location: [number, number];
    distance: number;
    hotelName: string;
  }>;
  restaurantStops?: Array<{
    name: string;
    location: [number, number];
    distance: number;
    restaurantName: string;
  }>;
  campingStops?: Array<{
    name: string;
    location: [number, number];
    distance: number;
    campgroundName: string;
  }>;
  attractionStops?: Array<{
    name: string;
    location: [number, number];
    distance: number;
    attractionName: string;
    rating?: number;
  }>;
  currentRoute?: any;
}

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

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Hotel className="h-5 w-5" />
            Suggested Stays:
          </h3>
          <div className="space-y-3">
            {Array.isArray(hotelStops) && hotelStops.map((stop, index) => (
              <div key={`hotel-${index}`} className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <p className="text-base">
                  {stop.hotelName} in {stop.name} - {Math.round(stop.distance)} miles from start
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5" />
            Suggested Restaurants:
          </h3>
          <div className="space-y-3">
            {Array.isArray(restaurantStops) && restaurantStops.map((stop, index) => (
              <div key={`restaurant-${index}`} className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <p className="text-base">
                  {stop.restaurantName} in {stop.name} - {Math.round(stop.distance)} miles from start
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Tent className="h-5 w-5" />
            Suggested Camping:
          </h3>
          <div className="space-y-3">
            {Array.isArray(campingStops) && campingStops.map((stop, index) => (
              <div key={`camping-${index}`} className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <p className="text-base">
                  {stop.campgroundName} in {stop.name} - {Math.round(stop.distance)} miles from start
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            Suggested Things to Do:
          </h3>
          <div className="space-y-3">
            {Array.isArray(attractionStops) && attractionStops.map((stop, index) => (
              <div key={`attraction-${index}`} className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <div className="flex items-center gap-2">
                  <p className="text-base">
                    {stop.attractionName} in {stop.name} - {Math.round(stop.distance)} miles from start
                  </p>
                  {stop.rating && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{stop.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <p className="text-base">
            Arrive at {destination} - {distance} miles total
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Travel Tips:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Plan to refuel at each suggested fuel stop to ensure you don't run low on gas</li>
            <li>Book accommodations in advance at the suggested overnight stops</li>
            <li>Take regular breaks every 2-3 hours to stay alert</li>
            <li>Check weather conditions before departing</li>
            <li>Keep emergency contacts and roadside assistance numbers handy</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteItinerary;
