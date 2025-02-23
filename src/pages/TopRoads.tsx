
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, FileDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TopRoads = () => {
  const { data: roads, isLoading } = useQuery({
    queryKey: ["roads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roads")
        .select("*");
      
      if (error) throw error;

      return data.sort((a, b) => {
        const getNumber = (str: string) => {
          const match = str.match(/^(\d+)\./);
          return match ? parseInt(match[1]) : 0;
        };
        
        return getNumber(a.name) - getNumber(b.name);
      });
    },
  });

  const handleGpxDownload = async (roadName: string) => {
    try {
      // Convert road name to a standardized filename format
      const filename = roadName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        + '.gpx';

      console.log('Attempting to download file:', filename);  // Debug log

      const { data, error } = await supabase.storage
        .from('gpx_files')
        .createSignedUrl(filename, 60); // URL valid for 60 seconds

      if (error) {
        console.error('Error getting download URL:', error);
        console.error('Error message:', error.message);  // Log error message
        toast.error("Unable to download GPX file", {
          description: "The file may not be available yet."
        });
        return;
      }

      // Create a temporary link and trigger the download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started!", {
        description: `Downloading GPX file for ${roadName}`
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Download failed", {
        description: "There was an error downloading the GPX file."
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Top Motorcycle Roads
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover the most thrilling rides and scenic routes
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center">Loading roads...</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {roads?.map((road) => (
                  <Card key={road.id} className="hover-card overflow-hidden">
                    {road.image && (
                      <div className="relative h-48 w-full">
                        <img
                          src={road.image}
                          alt={road.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Map className="h-5 w-5 text-theme-600" />
                        {road.name}
                      </CardTitle>
                      <div className="text-sm text-gray-600 mt-1">
                        {road.state && <span>{road.state}</span>}
                        {road.state && road.miles && <span> • </span>}
                        {road.miles && <span>{road.miles} miles</span>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{road.description}</p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleGpxDownload(road.name)}
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        Download GPX
                      </Button>
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

export default TopRoads;
