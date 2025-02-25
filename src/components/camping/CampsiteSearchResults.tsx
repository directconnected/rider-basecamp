
import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Droplets, DollarSign } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Campsite = Database['public']['Tables']['campsites']['Row'];

interface CampsiteSearchResultsProps {
  results: Campsite[];
}

const CampsiteSearchResults = ({ results }: CampsiteSearchResultsProps) => {
  console.log('Rendering search results:', results);

  return (
    <section className="w-full bg-white py-16">
      {(!results || results.length === 0) ? (
        <div className="text-center mb-12">
          <p className="text-gray-600">No results found</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Search Results</h2>
            <p className="text-gray-600">Found {results.length} campsites</p>
          </div>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((campsite) => (
                <Card key={campsite.id} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-2">{campsite.name || 'Unnamed Campsite'}</h3>
                  
                  <div className="space-y-2 text-gray-600">
                    {(campsite.town || campsite.state) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {[
                            campsite.town,
                            campsite.state
                          ].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    
                    {campsite.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{campsite.phone}</span>
                      </div>
                    )}
                    
                    {campsite.fee && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Fee: {campsite.fee}</span>
                      </div>
                    )}
                    
                    {campsite.showers && (
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4" />
                        <span>Showers: {campsite.showers}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {campsite.sites && (
                        <span>Sites: {campsite.sites}</span>
                      )}
                      {campsite.season && (
                        <span>Season: {campsite.season}</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default CampsiteSearchResults;
