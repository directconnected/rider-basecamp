
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Map } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";

const Routes = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Find Your Perfect Ride
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Explore curated routes from experienced riders, complete with turn-by-turn directions, points of interest, and rider tips. From scenic mountain passes to coastal highways, find the perfect route for your next adventure.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Routes;
