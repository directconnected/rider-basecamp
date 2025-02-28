
import React from "react";
import { LucideIcon } from "lucide-react";
import RatingDisplay from "./RatingDisplay";
import { 
  RestaurantStop, 
  HotelStop, 
  CampingStop, 
  AttractionStop, 
  RatedStop 
} from "./types";
import { formatRestaurantType, formatLodgingType, formatAttractionType } from "./typeFormatters";

interface StopSectionProps {
  title: string;
  icon: LucideIcon;
  color: string;
  stops: RatedStop[];
  getStopName: (stop: RatedStop) => string;
  getStopType: (stop: RatedStop) => string;
}

const StopSection = ({ 
  title, 
  icon: Icon, 
  color, 
  stops, 
  getStopName,
  getStopType
}: StopSectionProps) => {
  // Generate a formatted display name for the stop type
  const formatType = (stop: RatedStop): string => {
    // Determine which type of stop it is
    if ('restaurantType' in stop && stop.restaurantType) {
      return formatRestaurantType(stop.restaurantType as string);
    } else if ('lodgingType' in stop && stop.lodgingType) {
      return formatLodgingType(stop.lodgingType as string);
    } else if ('campingType' in stop) {
      return 'Campground';
    } else if ('attractionType' in stop && stop.attractionType) {
      return formatAttractionType(stop.attractionType as string);
    }
    return '';
  };

  if (!stops || stops.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}:</h3>
      {stops.map((stop, index) => (
        <div key={`${title}-${index}`} className="bg-slate-50 p-4 rounded-md shadow-sm">
          <div className="flex items-start gap-4">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${color} text-white`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-semibold">{getStopName(stop)}</h4>
                <span className="text-sm bg-slate-200 py-1 px-2 rounded">
                  {formatType(stop)}
                </span>
              </div>
              <p className="text-sm text-slate-600">{stop.name}</p>
              <p className="text-sm mt-1">{stop.distance} miles from start</p>
              
              {stop.rating && (
                <div className="mt-1">
                  <RatingDisplay rating={stop.rating} />
                </div>
              )}
              
              <div className="mt-2 flex flex-col space-y-1">
                {stop.phone_number && (
                  <a 
                    href={`tel:${stop.phone_number}`} 
                    className="text-sm text-theme-600 hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    {stop.phone_number}
                  </a>
                )}
                {stop.website && (
                  <a 
                    href={stop.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-theme-600 hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">language</span>
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StopSection;
