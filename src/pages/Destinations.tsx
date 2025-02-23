
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

      <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Features
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
              {features.map((feature) => (
                <Link 
                  to={feature.link}
                  key={feature.title}
                  className="block h-[300px]"
                >
                  <Card className="p-6 text-center h-full">
                    <div className="h-full flex flex-col">
                      <div className="flex-none flex items-center justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-theme-100 text-theme-600 flex items-center justify-center">
                          <feature.icon size={24} />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-lg font-bold mb-2 line-clamp-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

      <Footer />
    </div>
  );
};

export default Routes;
