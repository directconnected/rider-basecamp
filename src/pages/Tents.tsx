
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { TentTree } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

const Tents = () => {
  const tents = [
    {
      name: "Ultralight Solo Tent",
      price: "$299",
      description: "Perfect for motorcycle camping, weighs only 2.8 lbs",
      features: ["Single person", "Waterproof", "Quick setup", "Compact when packed"],
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027"
    },
    {
      name: "Adventure Duo Tent",
      price: "$399",
      description: "Spacious 2-person tent ideal for extended trips",
      features: ["Two person", "All-season", "Multiple ventilation points", "Large vestibule"],
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"
    },
    {
      name: "Moto-Camper Pro",
      price: "$449",
      description: "Premium motorcycle camping tent with garage area",
      features: ["Motorcycle coverage", "Weather resistant", "Tool storage", "Easy assembly"],
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Motorcycle Camping Tents
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Lightweight and compact tents perfect for motorcycle adventures
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tents.map((tent, index) => (
                <Card key={index} className="hover-card overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={tent.image}
                      alt={tent.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{tent.name}</h3>
                        <div className="text-theme-600 font-semibold">{tent.price}</div>
                      </div>
                      <TentTree className="h-6 w-6 text-theme-600" />
                    </div>
                    <p className="text-gray-600 mb-4">{tent.description}</p>
                    <ul className="space-y-2">
                      {tent.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-theme-600 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
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

export default Tents;
