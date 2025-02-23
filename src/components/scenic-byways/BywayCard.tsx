
import React from "react";
import { Route } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScenicByway } from "./types";

interface BywayCardProps {
  byway: ScenicByway;
  verifiedUrls: { [key: string]: boolean };
  getFullStateName: (stateAbbr: string) => string;
  capitalizeWords: (str: string) => string;
  getFallbackImage: (state: string) => string;
}

const BywayCard: React.FC<BywayCardProps> = ({
  byway,
  verifiedUrls,
  getFullStateName,
  capitalizeWords,
  getFallbackImage,
}) => {
  return (
    <Card className="hover-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5 text-theme-600" />
          {capitalizeWords(byway.byway_name)}
        </CardTitle>
      </CardHeader>
      <div className="px-6">
        <img
          src={
            byway.image_url && verifiedUrls[byway.image_url]
              ? byway.image_url
              : getFallbackImage(byway.state)
          }
          alt={byway.byway_name}
          className="w-full h-48 object-cover rounded-md mb-4"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = getFallbackImage(byway.state);
          }}
        />
      </div>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">State:</span> {getFullStateName(byway.state)}
            </p>
            {byway.length_miles && (
              <p className="text-gray-600">
                <span className="font-medium">Length:</span> {byway.length_miles} miles
              </p>
            )}
            <p className="text-gray-600">
              <span className="font-medium">Designation:</span> {byway.designation}
            </p>
          </div>
          {byway.description && (
            <div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {byway.description}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BywayCard;
