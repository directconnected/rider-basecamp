
import React from "react";
import { Card } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";
import { MapPin, Phone, Compass, Trees, Dog, Droplet, Droplets, DoorOpen, Bath, Info } from "lucide-react";

type Campsite = Database['public']['Tables']['campsites']['Row'];

interface CampsiteCardProps {
  campsite: Campsite;
}

const CampsiteCard = ({ campsite }: CampsiteCardProps) => {
  const formatUrl = (url: string | null) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{campsite.camp || 'Unnamed Campsite'}</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{campsite.town || 'N/A'}, {campsite.state || 'N/A'} {campsite.nforg || ''}</span>
          </div>
        </div>

        {/* Main Info */}
        <div className="grid grid-cols-2 gap-4 text-sm border-t border-b border-gray-100 py-4">
          <div className="flex items-center">
            <Compass className="w-4 h-4 mr-2 text-theme-600" />
            <div>
              <p className="text-gray-500">Elevation</p>
              <p className="font-medium">{campsite.elev ? `${campsite.elev} ft` : 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Trees className="w-4 h-4 mr-2 text-theme-600" />
            <div>
              <p className="text-gray-500">Season</p>
              <p className="font-medium">{campsite.season || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Amenities</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600">
              <Dog className="w-4 h-4 mr-2" />
              <span>Pets: {campsite.pets || 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Droplet className="w-4 h-4 mr-2" />
              <span>Showers: {campsite.showers || 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Droplets className="w-4 h-4 mr-2" />
              <span>Water: {campsite.water || 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <DoorOpen className="w-4 h-4 mr-2" />
              <span>Hookups: {campsite.hookups || 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Bath className="w-4 h-4 mr-2" />
              <span>Toilets: {campsite.toilets || 'N/A'}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs space-y-1.5">
            <div className="flex items-start gap-1">
              <Info className="w-3 h-3 text-theme-600 mt-0.5 flex-shrink-0" />
              <div className="text-gray-600">
                <span className="font-medium">Legend:</span>
                <ul className="mt-1 space-y-1">
                  <li><span className="font-medium">PA</span> - Pets Allowed</li>
                  <li><span className="font-medium">DW</span> - Drinking Water</li>
                  <li><span className="font-medium">SH</span> - Shower House</li>
                  <li><span className="font-medium">E</span> - Electric Available</li>
                  <li><span className="font-medium">NH</span> - No Hookups</li>
                  <li><span className="font-medium">N/A</span> - Data Not Available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          {campsite.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              <span>{campsite.phone}</span>
            </div>
          )}
          
          {campsite.url && (
            <a 
              href={formatUrl(campsite.url)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-theme-600 hover:text-theme-700"
            >
              Visit Website
            </a>
          )}
          
          <div className="text-sm">
            <span className="font-medium">Reservations: </span>
            <span className="text-gray-600">{campsite.reservations || 'N/A'}</span>
          </div>
          
          {campsite.fee && (
            <div className="text-sm">
              <span className="font-medium">Fee: </span>
              <span className="text-gray-600">{campsite.fee}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CampsiteCard;
