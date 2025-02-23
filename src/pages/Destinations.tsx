
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
                Motorcycle Routes
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover the best motorcycle roads and scenic routes
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Find Your Perfect Ride
                </h2>
                <p className="text-gray-600 mb-6">
                  Explore curated routes from experienced riders, complete with turn-by-turn directions, points of interest, and rider tips. From scenic mountain passes to coastal highways, find the perfect route for your next adventure.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { title: "Routes Available", value: "500+" },
                  { title: "Total Distance", value: "50,000+ miles" },
                  { title: "Rider Reviews", value: "10,000+" },
                  { title: "States Covered", value: "48" }
                ].map((stat) => (
                  <Card key={stat.title} className="p-6 text-center hover-card">
                    <h3 className="font-bold mb-2">{stat.title}</h3>
                    <p className="text-gray-600">{stat.value}</p>
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

export default Routes;
