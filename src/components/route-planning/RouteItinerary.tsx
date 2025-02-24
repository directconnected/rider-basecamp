
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List } from "lucide-react";

interface RouteItineraryProps {
  startPoint: string;
  destination: string;
  distance: number;
  duration: number;
  fuelStops: Array<{
    name: string;
    distance: number;
  }>;
}

const RouteItinerary = ({ startPoint, destination, distance, duration, fuelStops }: RouteItineraryProps) => {
  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5 text-theme-600" />
          Route Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose max-w-none">
          <p className="text-lg">
            Your journey from <span className="font-semibold">{startPoint}</span> to{" "}
            <span className="font-semibold">{destination}</span> covers{" "}
            <span className="font-semibold">{distance} miles</span> and takes approximately{" "}
            <span className="font-semibold">{formatDuration(duration)}</span>.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Suggested Stops:</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <p className="text-base">Start at <span className="font-medium">{startPoint}</span></p>
            </div>
            
            {fuelStops.map((stop, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <p className="text-base">
                  {stop.name} - <span className="font-medium">{Math.round(stop.distance)} miles</span> from start
                </p>
              </div>
            ))}

            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <p className="text-base">
                Arrive at <span className="font-medium">{destination}</span> - <span className="font-medium">{distance} miles</span> total
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Travel Tips:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Plan to refuel at each suggested fuel stop to ensure you don't run low on gas</li>
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
