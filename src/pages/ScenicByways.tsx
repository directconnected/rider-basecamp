
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Route } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ScenicByway {
  byway_name: string;
  state: string;
  length_miles: string | null;  // Changed from number | null to string | null
  designation: string;
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

const ScenicByways = () => {
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
            {isLoading ? (
              <div className="text-center text-gray-600">Loading scenic byways...</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {scenicByways?.map((byway, index) => (
                  <Card key={index} className="hover-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Route className="h-5 w-5 text-theme-600" />
                        {capitalizeWords(byway.byway_name)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
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
