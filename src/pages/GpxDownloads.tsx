
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { FileDown, Map } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const gpxFiles = [
  {
    id: 1,
    name: "Blue Ridge Parkway",
    distance: "469 miles",
    region: "North Carolina & Virginia",
    filename: "blue-ridge-parkway.gpx"
  },
  {
    id: 2,
    name: "Pacific Coast Highway",
    distance: "655 miles",
    region: "California",
    filename: "pacific-coast-highway.gpx"
  },
  {
    id: 3,
    name: "Going-to-the-Sun Road",
    distance: "50 miles",
    region: "Montana",
    filename: "going-to-the-sun.gpx"
  },
  {
    id: 4,
    name: "Beartooth Highway",
    distance: "68 miles",
    region: "Montana & Wyoming",
    filename: "beartooth-highway.gpx"
  }
];

const GpxDownloads = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                GPX Downloads
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Download GPX files for your favorite routes
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2">
              {gpxFiles.map((file) => (
                <Card key={file.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-theme-600" />
                      {file.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-600">Distance: {file.distance}</p>
                      <p className="text-gray-600">Region: {file.region}</p>
                      <Button className="mt-4" variant="outline">
                        <FileDown className="mr-2 h-4 w-4" />
                        Download GPX
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GpxDownloads;
