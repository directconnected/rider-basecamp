
import React from "react";
import { CampgroundResult } from "@/hooks/camping/types";
import { MapPin, Phone, Globe, Mail } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CampsiteCardProps {
  campsite: CampgroundResult;
}

const CampsiteCard = ({ campsite }: CampsiteCardProps) => {
  // Format the address for display
  const formattedAddress = [
    campsite.address_1,
    campsite.address_2,
    `${campsite.city}, ${campsite.state} ${campsite.zip_code}`
  ].filter(Boolean).join(", ");

  // Format the phone number if available
  const formattedPhone = campsite.phone 
    ? campsite.phone.replace(/[^\d]/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") 
    : null;

  // Check if distance is available (for location-based search)
  const hasDistance = typeof campsite.distance === 'number' && campsite.distance !== Infinity;

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl tracking-tight">{campsite.campground_name}</CardTitle>
        <CardDescription className="text-gray-500 flex items-start gap-1.5">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
          {formattedAddress}
        </CardDescription>
        
        {/* Display the distance badge if it exists */}
        {hasDistance && (
          <Badge variant="outline" className="self-start mt-1 bg-blue-50">
            {campsite.distance!.toFixed(1)} miles away
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="pb-4 flex-1">
        <div className="space-y-2">
          {formattedPhone && (
            <p className="text-sm flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <a href={`tel:${formattedPhone}`} className="hover:text-blue-600">{formattedPhone}</a>
            </p>
          )}
          
          {campsite.website && (
            <p className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <a 
                href={campsite.website.startsWith('http') ? campsite.website : `https://${campsite.website}`} 
                className="hover:text-blue-600 truncate"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {campsite.website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </p>
          )}
          
          {campsite.email && (
            <p className="text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <a href={`mailto:${campsite.email}`} className="hover:text-blue-600 truncate">{campsite.email}</a>
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t">
        <div className="flex items-center justify-between w-full">
          <Badge variant="outline" className="bg-gray-50">
            {campsite.state}
          </Badge>
          
          {campsite.gps_coordinates && (
            <a 
              href={`https://maps.google.com/?q=${campsite.gps_coordinates}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              View on Map
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CampsiteCard;
