
import React from "react";
import { LucideIcon, Globe, Phone } from "lucide-react";
import RatingDisplay from "./RatingDisplay";
import { RatedStop } from "./types";

interface StopSectionProps {
  title: string;
  icon: LucideIcon;
  color: string;
  stops: RatedStop[];
  getStopName: (stop: RatedStop) => string;
}

const StopSection = ({ title, icon: Icon, color, stops, getStopName }: StopSectionProps) => {
  if (!Array.isArray(stops)) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {title}
      </h3>
      <div className="space-y-3">
        {stops.map((stop, index) => (
          <div key={`${title}-${index}`} className="space-y-2">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <div className="flex items-center gap-2 flex-1">
                <p className="text-base">
                  {getStopName(stop)} in {stop.name} - {Math.round(stop.distance)} miles from start
                </p>
                <RatingDisplay rating={stop.rating} />
              </div>
            </div>
            {(stop.website || stop.phone) && (
              <div className="ml-7 flex gap-4 text-sm text-gray-600">
                {stop.website && (
                  <a 
                    href={stop.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1 hover:text-theme-600"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
                {stop.phone && (
                  <a 
                    href={`tel:${stop.phone}`} 
                    className="flex items-center gap-1 hover:text-theme-600"
                  >
                    <Phone className="h-4 w-4" />
                    {stop.phone}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StopSection;
