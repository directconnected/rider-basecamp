
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
    name: "Pacific Coast Highway",
    location: "California",
    description: "Stunning coastal views along California's iconic Highway 1.",
    highlights: ["Ocean views", "Coastal cliffs", "Year-round riding"]
  },
  {
    id: 3,
    name: "Blue Ridge Parkway",
    location: "Virginia/North Carolina",
    description: "469 miles of scenic mountain roads through the Appalachians.",
    highlights: ["Mountain vistas", "No commercial traffic", "Multiple access points"]
  },
  {
    id: 4,
    name: "Beartooth Highway",
    location: "Montana/Wyoming",
    description: "Nearly 11,000 feet of elevation with spectacular mountain views.",
    highlights: ["Switchbacks", "High elevation", "Wildlife viewing"]
  },
  {
    id: 5,
    name: "Going-to-the-Sun Road",
    location: "Montana",
    description: "50-mile road through Glacier National Park's most scenic areas.",
    highlights: ["Glacier views", "Mountain passes", "National park scenery"]
  },
  {
    id: 6,
    name: "Skyline Drive",
    location: "Virginia",
    description: "105 miles through Shenandoah National Park's scenic beauty.",
    highlights: ["75 scenic overlooks", "Wildlife sightings", "Fall foliage"]
  },
  {
    id: 7,
    name: "Natchez Trace Parkway",
    location: "Tennessee/Alabama/Mississippi",
    description: "444 miles of historic pathway with scenic wilderness views.",
    highlights: ["Historical sites", "No commercial traffic", "Rural scenery"]
  },
  {
    id: 8,
    name: "Million Dollar Highway",
    location: "Colorado",
    description: "Part of the San Juan Skyway with incredible mountain passes.",
    highlights: ["Three mountain passes", "Historic mining towns", "Dramatic drops"]
  },
  {
    id: 9,
    name: "Needles Highway",
    location: "South Dakota",
    description: "14 miles through granite spires in the Black Hills.",
    highlights: ["Granite tunnels", "Sharp curves", "Mount Rushmore nearby"]
  },
  {
    id: 10,
    name: "Twisted Sisters",
    location: "Texas",
    description: "Three challenging ranch roads in Texas Hill Country.",
    highlights: ["Three loop route", "Technical riding", "Hill country views"]
  },
  {
    id: 11,
    name: "Crater Lake Rim Drive",
    location: "Oregon",
    description: "33-mile loop around America's deepest lake.",
    highlights: ["Lake views", "Volcanic landscape", "High elevation riding"]
  },
  {
    id: 12,
    name: "Peak to Peak Highway",
    location: "Colorado",
    description: "55 miles of Rocky Mountain scenic beauty.",
    highlights: ["Mountain views", "Ghost towns", "National forest access"]
  },
  {
    id: 13,
    name: "Tunnel of Trees",
    location: "Michigan",
    description: "20 miles of twisting road along Lake Michigan.",
    highlights: ["Tree canopy", "Lake views", "Fall colors"]
  },
  {
    id: 14,
    name: "Overseas Highway",
    location: "Florida Keys",
    description: "113 miles of island hopping through the Florida Keys.",
    highlights: ["Ocean views", "Island hopping", "42 bridges"]
  },
  {
    id: 15,
    name: "Cascades Loop",
    location: "Washington",
    description: "440-mile loop through the Cascade Mountains.",
    highlights: ["Mountain passes", "National forests", "Small towns"]
  },
  {
    id: 16,
    name: "Cabot Trail",
    location: "Nova Scotia, Canada",
    description: "185-mile loop around Cape Breton Island.",
    highlights: ["Coastal views", "Highland scenery", "Wildlife viewing"]
  },
  {
    id: 17,
    name: "Mohawk Trail",
    location: "Massachusetts",
    description: "69 miles through the Berkshire Mountains.",
    highlights: ["Historic route", "Fall foliage", "Mountain views"]
  },
  {
    id: 18,
    name: "Coronado Trail",
    location: "Arizona",
    description: "123 miles of switchbacks through the Apache National Forest.",
    highlights: ["460 curves", "Elevation changes", "Desert views"]
  },
  {
    id: 19,
    name: "Coastal Route 1",
    location: "Maine",
    description: "Scenic coastal route past lighthouses and fishing villages.",
    highlights: ["Lighthouse views", "Coastal towns", "Seafood stops"]
  },
  {
    id: 20,
    name: "Pikes Peak Highway",
    location: "Colorado",
    description: "19-mile ascent to the summit of Pikes Peak.",
    highlights: ["14,115 ft elevation", "156 turns", "Summit views"]
  },
  {
    id: 21,
    name: "Lolo Pass",
    location: "Idaho/Montana",
    description: "Historic route following Lewis and Clark's trail.",
    highlights: ["Historical sites", "Forest riding", "River views"]
  },
  {
    id: 22,
    name: "Highway 36",
    location: "Northern California",
    description: "140 miles of curves through redwood forests.",
    highlights: ["1,811 curves", "Forest scenery", "Coast access"]
  },
  {
    id: 23,
    name: "Apache Trail",
    location: "Arizona",
    description: "40-mile historic route through the Superstition Mountains.",
    highlights: ["Desert views", "Lake vistas", "Historic route"]
  },
  {
    id: 24,
    name: "Olympic Peninsula Loop",
    location: "Washington",
    description: "330-mile loop around Olympic National Park.",
    highlights: ["Rainforest views", "Coastal riding", "Mountain vistas"]
  },
  {
    id: 25,
    name: "Kancamagus Highway",
    location: "New Hampshire",
    description: "34.5 miles through the White Mountain National Forest.",
    highlights: ["Fall colors", "Mountain passes", "Scenic overlooks"]
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination) => (
                <Card key={destination.id} className="hover:shadow-lg transition-shadow duration-300">
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
