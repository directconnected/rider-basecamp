import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Star, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Breadcrumbs from "@/components/Breadcrumbs";

const destinations = [
  {
    id: 1,
    name: "Tail of the Dragon",
    location: "Deals Gap, North Carolina",
    description: "318 curves in 11 miles - America's most famous motorcycle road.",
    highlights: ["318 curves", "11 miles long", "Professional photographers on-site"]
  },
  {
    id: 2,
    name: "Sturgis Motorcycle Rally",
    location: "Sturgis, South Dakota",
    description: "The world's largest motorcycle rally, held annually in August.",
    highlights: ["Massive gathering", "Live music", "Custom bike shows"]
  },
  {
    id: 3,
    name: "Death Valley",
    location: "California/Nevada",
    description: "Stunning desert landscapes and challenging riding conditions.",
    highlights: ["Extreme temperatures", "Remote routes", "Spectacular scenery"]
  },
  {
    id: 4,
    name: "Rocky Mountain National Park",
    location: "Colorado",
    description: "High-altitude riding through some of America's most beautiful mountains.",
    highlights: ["Alpine views", "Wildlife viewing", "Trail Ridge Road"]
  }
];

const FeaturedDestinations = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Featured Destinations
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Must-visit destinations for motorcycle enthusiasts
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2">
              {destinations.map((destination) => (
                <Card key={destination.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-theme-600" />
                      {destination.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2 mb-4">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-600">{destination.location}</p>
                    </div>
                    <p className="text-gray-600 mb-4">{destination.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Highlights:</h4>
                      <ul className="list-disc list-inside text-gray-600 pl-4">
                        {destination.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
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

export default FeaturedDestinations;
