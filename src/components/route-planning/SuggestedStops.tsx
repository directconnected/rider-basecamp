
import React from "react";
import { Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PointOfInterest {
  name: string;
  type: 'restaurant' | 'hotel' | 'camping';
  location: [number, number];
  description: string;
}

interface SuggestedStopsProps {
  suggestions: PointOfInterest[];
}

const SuggestedStops = ({ suggestions }: SuggestedStopsProps) => {
  if (suggestions.length === 0) return null;

  return (
    <Card className="mt-8 mb-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-theme-600" />
          Suggested Stops
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((poi, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{poi.name}</h3>
              <p className="text-sm text-gray-600 capitalize">Type: {poi.type}</p>
              <p className="text-sm text-gray-600">{poi.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestedStops;
