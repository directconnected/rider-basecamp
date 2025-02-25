
import React from "react";
import { Card } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";

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
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{campsite.camp || 'Unnamed Campsite'}</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">City:</p>
            <p>{campsite.town || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">State:</p>
            <p>{campsite.state || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Zip Code:</p>
            <p>{campsite.nforg || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Phone:</p>
            <p>{campsite.phone || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Latitude:</p>
            <p>{campsite.lat || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Longitude:</p>
            <p>{campsite.lon || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Showers:</p>
            <p>{campsite.showers || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Pets:</p>
            <p>{campsite.pets || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Season:</p>
            <p>{campsite.season || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Fee:</p>
            <p>{campsite.fee || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Elevation:</p>
            <p>{campsite.elev ? `${campsite.elev} ft` : 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Hookups:</p>
            <p>{campsite.hookups || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Toilets:</p>
            <p>{campsite.toilets || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Water:</p>
            <p>{campsite.water || 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-2">
          {campsite.url && (
            <div>
              <p className="font-semibold">URL:</p>
              <a 
                href={formatUrl(campsite.url)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
          
          <div>
            <p className="font-semibold">Reservations:</p>
            <p>{campsite.reservations || 'N/A'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CampsiteCard;
