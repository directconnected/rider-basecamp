
import React from "react";
import { LucideIcon } from "lucide-react";
import { RatedStop } from "./types";
import RatingDisplay from "./RatingDisplay";
import { Phone, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StopSectionProps {
  title: string;
  icon: LucideIcon;
  color: string;
  stops: RatedStop[];
  getStopName: (stop: RatedStop) => string;
  getStopType?: (stop: RatedStop) => string | undefined;
}

const StopSection = ({ title, icon: Icon, color, stops, getStopName, getStopType }: StopSectionProps) => {
  if (!stops || stops.length === 0) {
    return null;
  }

  // Function to format type labels for display
  const formatTypeLabel = (type: string | undefined): string => {
    if (!type || type === 'any') return '';
    
    // Handle special case for bed_and_breakfast
    if (type === 'bed_and_breakfast' || type === 'bed and breakfast') {
      return 'Bed & Breakfast';
    }
    
    // Handle special case for fast_food
    if (type === 'fast_food' || type === 'fast food') {
      return 'Fast Food';
    }
    
    // Handle special case for fine_dining
    if (type === 'fine_dining' || type === 'fine dining') {
      return 'Fine Dining';
    }
    
    // Handle special cuisines and restaurant types
    if (type === 'american') return 'American';
    if (type === 'italian') return 'Italian';
    if (type === 'chinese') return 'Chinese';
    if (type === 'mexican') return 'Mexican';
    if (type === 'japanese') return 'Japanese';
    if (type === 'thai') return 'Thai';
    if (type === 'indian') return 'Indian';
    if (type === 'steakhouse') return 'Steakhouse';
    if (type === 'seafood') return 'Seafood';
    if (type === 'bbq') return 'BBQ';
    if (type === 'sandwich') return 'Sandwich';
    if (type === 'meal takeaway') return 'Takeout';
    
    // Replace underscores with spaces and capitalize each word
    return type
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}:</h3>
      <div className="space-y-3">
        {stops.map((stop, index) => {
          const stopName = getStopName(stop);
          const stopType = getStopType ? getStopType(stop) : undefined;
          const formattedType = formatTypeLabel(stopType);
          
          // Debug logging for type labels
          console.log(`${title} Stop ${index} (${stopName}): Type=${stopType}, Formatted=${formattedType}`);
          
          return (
            <div key={`${title}-${index}`} className="flex flex-col gap-2 p-4 rounded-lg bg-gray-50">
              <div className="flex items-start gap-4">
                <div className={`w-3 h-3 rounded-full mt-2 ${color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium">{stopName}</p>
                    {formattedType && stopType !== 'any' && (
                      <Badge variant="outline" className="ml-2">
                        {formattedType}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{stop.name}</p>
                  <p className="text-sm text-gray-500">{Math.round(stop.distance)} miles from start</p>
                  
                  {/* Rating display */}
                  {stop.rating && (
                    <div className="mt-1">
                      <RatingDisplay rating={stop.rating} />
                    </div>
                  )}
                  
                  {/* Contact Information */}
                  <div className="mt-2 space-y-1">
                    {'phone_number' in stop && stop.phone_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${stop.phone_number}`} className="hover:text-theme-600">
                          {stop.phone_number}
                        </a>
                      </div>
                    )}
                    {'website' in stop && stop.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={stop.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-theme-600 truncate"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StopSection;
