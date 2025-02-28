
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CampgroundResult } from "@/hooks/camping/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe } from "lucide-react";

interface CampsiteCardProps {
  campsite: CampgroundResult;
}

const CampsiteCard = ({ campsite }: CampsiteCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{campsite.name}</CardTitle>
        <CardDescription className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
          <span>{campsite.address}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {campsite.distance !== undefined && (
          <div className="text-sm text-gray-600 mb-2">
            <span className="font-medium">{campsite.distance} miles</span> from search location
          </div>
        )}
        
        {campsite.types && campsite.types.map((type, index) => (
          <Badge key={index} variant="outline" className="mr-2 mb-2">
            {type}
          </Badge>
        ))}
        
        <div className="space-y-2 mt-4">
          {campsite.water && (
            <div className="text-sm">
              <span className="font-medium">Water:</span> {campsite.water}
            </div>
          )}
          
          {campsite.showers && (
            <div className="text-sm">
              <span className="font-medium">Showers:</span> {campsite.showers}
            </div>
          )}
          
          {campsite.pets && (
            <div className="text-sm">
              <span className="font-medium">Pets:</span> {campsite.pets}
            </div>
          )}
          
          {campsite.fee && (
            <div className="text-sm">
              <span className="font-medium">Fee:</span> {campsite.fee}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex flex-col items-start space-y-2">
        {campsite.phone_number && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <a href={`tel:${campsite.phone_number}`} className="hover:underline">
              {campsite.phone_number}
            </a>
          </div>
        )}
        
        {campsite.website && (
          <div className="flex items-center gap-2 text-gray-600">
            <Globe className="h-4 w-4" />
            <a 
              href={campsite.website.startsWith('http') ? campsite.website : `https://${campsite.website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CampsiteCard;
