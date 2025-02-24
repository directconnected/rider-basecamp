
import React from "react";
import { MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RouteDetailsProps {
  startPoint: string;
  destination: string;
  distance: number;
  duration: number;
}

const RouteDetails = ({ startPoint, destination, distance, duration }: RouteDetailsProps) => {
  const capitalizeLocation = (location: string) => {
    return location.toUpperCase();
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-theme-600" />
          Route Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">FROM</p>
            <p className="text-lg font-semibold">{capitalizeLocation(startPoint)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">TO</p>
            <p className="text-lg font-semibold">{capitalizeLocation(destination)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Distance</p>
            <p className="text-lg font-semibold">{distance} miles</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Estimated Duration</p>
            <p className="text-lg font-semibold">{duration} hours</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteDetails;
