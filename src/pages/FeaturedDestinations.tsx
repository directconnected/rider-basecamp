
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Star, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Breadcrumbs from "@/components/Breadcrumbs";

const destinations = [
  {
    id: 1,
    name: "Yellowstone National Park",
    location: "Wyoming",
    description: "America's first national park featuring geothermal wonders and wildlife.",
    highlights: ["Geothermal features", "Wildlife viewing", "Camping facilities"]
  },
  {
    id: 2,
    name: "Moab Desert Adventure",
    location: "Utah",
    description: "Red rock wonderland with countless off-road trails and stunning arches.",
    highlights: ["Desert landscapes", "Off-road trails", "Natural arches"]
  },
  {
    id: 3,
    name: "Great Smoky Mountains",
    location: "Tennessee/North Carolina",
    description: "America's most visited national park with diverse wildlife and scenery.",
    highlights: ["Mountain vistas", "Wildlife encounters", "Historic buildings"]
  },
  {
    id: 4,
    name: "Grand Canyon",
    location: "Arizona",
    description: "One of the world's most spectacular natural wonders.",
    highlights: ["Rim camping", "Sunset viewing spots", "Helicopter tours"]
  },
  {
    id: 5,
    name: "Mount Rushmore",
    location: "South Dakota",
    description: "Iconic monument surrounded by Black Hills attractions.",
    highlights: ["Evening lighting ceremony", "Historic sites", "Nearby attractions"]
  },
  {
    id: 6,
    name: "Glacier National Park",
    location: "Montana",
    description: "Crown of the Continent with stunning alpine scenery.",
    highlights: ["Glacier views", "Alpine meadows", "Wildlife watching"]
  },
  {
    id: 7,
    name: "Death Valley",
    location: "California",
    description: "North America's lowest point with unique desert landscapes.",
    highlights: ["Sand dunes", "Badwater Basin", "Stargazing"]
  },
  {
    id: 8,
    name: "Olympic National Park",
    location: "Washington",
    description: "Diverse ecosystem from rainforest to coastal beaches.",
    highlights: ["Rainforest trails", "Ocean beaches", "Mountain ridges"]
  },
  {
    id: 9,
    name: "Joshua Tree",
    location: "California",
    description: "Unique desert landscape where two distinct deserts meet.",
    highlights: ["Rock climbing", "Desert camping", "Stargazing"]
  },
  {
    id: 10,
    name: "Acadia National Park",
    location: "Maine",
    description: "Atlantic coastal beauty with rocky beaches and granite peaks.",
    highlights: ["Coastal views", "Historic lighthouses", "Scenic loops"]
  },
  {
    id: 11,
    name: "Monument Valley",
    location: "Arizona/Utah",
    description: "Iconic sandstone buttes in the heart of Navajo Nation.",
    highlights: ["Tribal guided tours", "Desert camping", "Sunrise views"]
  },
  {
    id: 12,
    name: "Big Sur Coastline",
    location: "California",
    description: "Dramatic coastal cliffs and pristine beaches.",
    highlights: ["Beach camping", "Coastal hiking", "Wildlife viewing"]
  },
  {
    id: 13,
    name: "Badlands",
    location: "South Dakota",
    description: "Dramatic landscapes and fossil beds in the prairie.",
    highlights: ["Fossil exhibits", "Prairie wildlife", "Scenic overlooks"]
  },
  {
    id: 14,
    name: "Everglades",
    location: "Florida",
    description: "Unique wetland ecosystem with diverse wildlife.",
    highlights: ["Airboat tours", "Alligator spotting", "Bird watching"]
  },
  {
    id: 15,
    name: "Zion National Park",
    location: "Utah",
    description: "Massive sandstone cliffs and narrow canyons.",
    highlights: ["Canyon views", "Rock formations", "Desert oasis"]
  },
  {
    id: 16,
    name: "Denali National Park",
    location: "Alaska",
    description: "Home to North America's highest peak and vast wilderness.",
    highlights: ["Wildlife viewing", "Backcountry camping", "Mountain vistas"]
  },
  {
    id: 17,
    name: "Mammoth Cave",
    location: "Kentucky",
    description: "World's longest known cave system.",
    highlights: ["Cave tours", "Underground rivers", "Historic trails"]
  },
  {
    id: 18,
    name: "Crater Lake",
    location: "Oregon",
    description: "America's deepest lake in a volcanic crater.",
    highlights: ["Lake views", "Volcanic features", "Scenic trails"]
  },
  {
    id: 19,
    name: "Redwood National Park",
    location: "California",
    description: "Home to the world's tallest trees and coastal scenery.",
    highlights: ["Giant redwoods", "Coastal trails", "Wildlife viewing"]
  },
  {
    id: 20,
    name: "White Mountains",
    location: "New Hampshire",
    description: "Rugged mountain range with diverse recreation options.",
    highlights: ["Mountain camping", "Fall foliage", "Alpine zones"]
  },
  {
    id: 21,
    name: "Carlsbad Caverns",
    location: "New Mexico",
    description: "Spectacular underground caves and rock formations.",
    highlights: ["Cave tours", "Bat flights", "Underground chambers"]
  },
  {
    id: 22,
    name: "Bryce Canyon",
    location: "Utah",
    description: "Distinctive red rock hoodoos and amphitheaters.",
    highlights: ["Rock formations", "Stargazing", "Scenic viewpoints"]
  },
  {
    id: 23,
    name: "Great Sand Dunes",
    location: "Colorado",
    description: "North America's tallest sand dunes against mountain backdrop.",
    highlights: ["Sand boarding", "Dune hiking", "Night sky viewing"]
  },
  {
    id: 24,
    name: "Mount Hood",
    location: "Oregon",
    description: "Iconic Pacific Northwest volcano with year-round activities.",
    highlights: ["Alpine meadows", "Glacier views", "Forest camping"]
  },
  {
    id: 25,
    name: "Grand Tetons",
    location: "Wyoming",
    description: "Dramatic mountain range with pristine lakes and valleys.",
    highlights: ["Mountain vistas", "Lake activities", "Wildlife viewing"]
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
