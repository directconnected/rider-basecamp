
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Map, Search, Database, BarChart, Clock, Users, Wrench, Route, Shield, Tent } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";

const Index = () => {
  const features = [
    {
      icon: Route,
      title: "Destinations",
      description: "Top motorcycle roads, routes, destinations & GPX files.",
      link: "/destinations",
      id: "destinations-feature"
    },
    {
      icon: Tent,
      title: "Camping Gear",
      description: "Top camping gear for motorcycle campers & latest news.",
      link: "/camping-gear",
      id: "camping-gear-feature"
    },
    {
      icon: Shield,
      title: "Riding Gear",
      description: "Top riding gear for motorcycle riders & latest news.",
      link: "/riding-gear",
      id: "riding-gear-feature"
    },
    {
      icon: Wrench,
      title: "Service Records",
      description: "Track maintenance records and service intervals.",
      link: "/service-landing",
      id: "service-feature"
    },
    {
      icon: Search,
      title: "Motorcycle Data",
      description: "Owner's manuals, service manuals, VIN lookup & data.",
      link: "/data",
      id: "data-feature"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col" id="index-page">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1">
        <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-5" id="hero-section">
          <div className="absolute inset-0 bg-black/50 z-0" />
          <div className="w-full px-4 z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in" id="hero-title">
                Gear Up and Ride
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in" id="hero-subtitle">
                Your Home for Motorcycle Knowledge and Community
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white" id="features-section">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4" id="features-title">
                Features
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
              {features.map((feature) => (
                <Link 
                  to={feature.link}
                  key={feature.title}
                  className="block h-[300px]"
                  id={feature.id}
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
      </main>
    </div>
  );
};

export default Index;
