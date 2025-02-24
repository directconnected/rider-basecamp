
import React from "react";
import { Search, Utensils, Hotel, Tent } from "lucide-react";
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
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return <Utensils className="h-4 w-4" />;
      case 'hotel':
        return <Hotel className="h-4 w-4" />;
      case 'camping':
        return <Tent className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'text-orange-600';
      case 'hotel':
        return 'text-blue-600';
      case 'camping':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="mt-8 mb-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-theme-600" />
          Suggested Stops
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((poi, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${getTypeColor(poi.type)}`}>
                  {getIcon(poi.type)}
                </div>
                <div>
                  <h3 className="font-semibold">{poi.name}</h3>
                  <p className={`text-sm ${getTypeColor(poi.type)} capitalize`}>
                    {poi.type}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{poi.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestedStops;
