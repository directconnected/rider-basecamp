
import React, { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";

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

const getFallbackImage = (state: string) => {
  const fallbackImages = [
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1472396961693-142e6e269027'
  ];
  
  const index = state.charCodeAt(0) % fallbackImages.length;
  return `https://images.unsplash.com/${fallbackImages[index]}?auto=format&fit=crop&w=800&h=400`;
};

const verifyImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && contentType?.startsWith('image/');
  } catch (error) {
    console.error(`Error verifying image URL (${url}):`, error);
    return false;
  }
};

const getImageUrl = (url: string | null) => {
  return url || null;
};

const ScenicByways = () => {
  const [selectedState, setSelectedState] = useState<string>("all");
  const [verifiedUrls, setVerifiedUrls] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

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

  useEffect(() => {
    const verifyImages = async () => {
      if (!scenicByways) return;

      const verificationResults: { [key: string]: boolean } = {};
      let invalidCount = 0;

      for (const byway of scenicByways) {
        if (byway.image_url) {
          const isValid = await verifyImageUrl(byway.image_url);
          verificationResults[byway.image_url] = isValid;
          if (!isValid) {
            invalidCount++;
            console.log(`Invalid image URL for ${byway.byway_name}: ${byway.image_url}`);
          }
        }
      }

      setVerifiedUrls(verificationResults);
      
      if (invalidCount > 0) {
        toast({
          title: "Image Verification Results",
          description: `Found ${invalidCount} invalid image URLs. Check console for details.`,
          variant: "destructive",
        });
      }
    };

    verifyImages();
  }, [scenicByways, toast]);

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
                        src={
                          byway.image_url && verifiedUrls[byway.image_url]
                            ? byway.image_url
                            : getFallbackImage(byway.state)
                        }
                        alt={byway.byway_name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = getFallbackImage(byway.state);
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
