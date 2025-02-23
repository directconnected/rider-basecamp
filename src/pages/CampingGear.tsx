import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Tent, Backpack, Compass, Flame } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

const CampingGear = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Motorcycle Camping Gear
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Essential gear for your two-wheeled adventures
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Top-Rated Camping Equipment
                </h2>
                <p className="text-gray-600 mb-6">
                  From lightweight tents to compact cooking gear, discover the best motorcycle camping equipment reviewed and tested by experienced riders. We focus on gear that's both durable and space-efficient for motorcycle travel.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { 
                    icon: Tent,
                    title: "Tents & Shelters",
                    description: "Lightweight, compact options"
                  },
                  {
                    icon: Backpack,
                    title: "Storage Solutions",
                    description: "Efficient packing systems"
                  },
                  {
                    icon: Compass,
                    title: "Navigation Tools",
                    description: "Stay on course"
                  },
                  {
                    icon: Flame,
                    title: "Cooking Gear",
                    description: "Compact camp kitchens"
                  }
                ].map((item) => (
                  <Card key={item.title} className="p-6 text-center hover-card">
                    <item.icon className="w-8 h-8 mx-auto mb-4 text-theme-600" />
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CampingGear;
