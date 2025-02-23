
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
  length_miles: number | null;
  designation: string;
}

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
                        {byway.byway_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-medium">State:</span> {byway.state}
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
