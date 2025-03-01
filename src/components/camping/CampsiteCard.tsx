
import React from "react";
import { CampgroundResult } from "@/hooks/camping/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CampsiteCardProps {
  campsite: CampgroundResult;
}

const CampsiteCard = ({ campsite }: CampsiteCardProps) => {
  // Default campground type
  const campType = "Standard";
  
  // Format location information
  const location = [
    campsite.city,
    campsite.state,
    campsite.zip_code
  ].filter(Boolean).join(", ");
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-xl font-bold text-gray-900 flex-1">{campsite.campground_name}</h3>
          <Badge variant="outline" className="bg-gray-100 whitespace-nowrap">
            {campType}
          </Badge>
        </div>
        
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
          <span>{campsite.address_1}</span>
        </div>
        
        {location && (
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="h-4 w-4 mt-1 flex-shrink-0 opacity-0" />
            <span>{location}</span>
          </div>
        )}
        
        {campsite.gps_coordinates && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">GPS:</span> {campsite.gps_coordinates}
          </div>
        )}

        <Separator className="my-2" />
        
        <div className="space-y-2 pt-1">
          {campsite.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <a href={`tel:${campsite.phone}`} className="hover:text-theme-600">
                {campsite.phone}
              </a>
            </div>
          )}
          
          {campsite.website && (
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="h-4 w-4" />
              <a 
                href={campsite.website.startsWith('http') ? campsite.website : `http://${campsite.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-theme-600"
              >
                Visit Website
              </a>
            </div>
          )}
          
          {campsite.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm">📧</span>
              <a 
                href={`mailto:${campsite.email}`} 
                className="hover:text-theme-600"
              >
                {campsite.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CampsiteCard;
