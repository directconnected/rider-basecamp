
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Route } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ScenicByway {
  byway_name: string;
  state: string;
  length_miles: string | null;
  designation: string;
  description: string | null;
  image_url: string | null;
}

const stateAbbreviations: { [key: string]: string } = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina",
  ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming"
};

const capitalizeWords = (str: string) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const getFullStateName = (stateAbbr: string) => {
  return stateAbbreviations[stateAbbr.toUpperCase()] || stateAbbr;
};

// Collection of reliable Unsplash scenic road images
const scenicRoadImages = [
  'https://images.unsplash.com/photo-1472396961693-142e6e269027', // Mountain road with deer
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716', // Bridge and waterfalls
  'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb', // River between mountains
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470', // Mountain range road
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', // Mountain vista
  'https://images.unsplash.com/photo-1486047275635-fc8d7f31c3f4', // Winding forest road
  'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98', // Desert highway
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', // Dramatic mountain pass
];

const getImageUrl = (imageUrl: string | null) => {
  // Generate a consistent index based on the byway name to always get the same image
  const getConsistentIndex = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % scenicRoadImages.length;
  };

  if (!imageUrl) {
    // Use the first image as default
    return scenicRoadImages[0];
  }

  if (imageUrl.startsWith('http')) {
    // For external URLs, use a consistent fallback image based on the URL
    const index = getConsistentIndex(imageUrl);
    return scenicRoadImages[index];
  }

  // For Supabase storage URLs
  return `${supabase.storage.from('scenic-byways').getPublicUrl(imageUrl).data.publicUrl}`;
};

const ScenicByways = () => {
  const [selectedState, setSelectedState] = useState<string>("all");

  const { data: scenicByways, isLoading } = useQuery({
    queryKey: ["scenic-byways"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scenic_byways")
        .select("*")
        .order("byway_name");
      
      if (error) throw error;
      return data as ScenicByway[];
    },
  });

  const filteredByways = selectedState === "all"
    ? scenicByways
    : scenicByways?.filter(byway => getFullStateName(byway.state) === selectedState);

  const uniqueStates = Array.from(new Set(scenicByways?.map(byway => getFullStateName(byway.state)) || [])).sort();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Scenic Byways
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Experience America's most beautiful motorcycle roads
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="mb-8 max-w-xs mx-auto">
              <Select
                value={selectedState}
                onValueChange={setSelectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {uniqueStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="text-center text-gray-600">Loading scenic byways...</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredByways?.map((byway, index) => (
                  <Card key={index} className="hover-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Route className="h-5 w-5 text-theme-600" />
                        {capitalizeWords(byway.byway_name)}
                      </CardTitle>
                    </CardHeader>
                    <div className="px-6">
                      <img
                        src={getImageUrl(byway.image_url)}
                        alt={byway.byway_name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                        onError={(e) => {
                          const index = Math.floor(Math.random() * scenicRoadImages.length);
                          e.currentTarget.src = scenicRoadImages[index];
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
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ScenicByways;
