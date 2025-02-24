
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Map, Search, Database, BarChart, Clock, Users, Wrench, Route, Shield, Tent, Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";

const Index = () => {
  const features = [
    {
      icon: Route,
      title: "Destination Hub",
      description: "Top motorcycle roads, routes, destinations & GPX files.",
      link: "/destinations",
      id: "destinations-feature"
    },
    {
      icon: Tent,
      title: "Camping Hub",
      description: "Top camping gear for motorcycle campers & latest news.",
      link: "/camping-gear",
      id: "camping-gear-feature"
    },
    {
      icon: Shield,
      title: "Gear Hub",
      description: "Top riding gear for motorcycle riders & latest news.",
      link: "/riding-gear",
      id: "riding-gear-feature"
    },
    {
      icon: Wrench,
      title: "Service Hub",
      description: "Track maintenance records and service intervals.",
      link: "/service-landing",
      id: "service-feature"
    },
    {
      icon: Search,
      title: "Data Hub",
      description: "Owner's manuals, service manuals, VIN lookup & data.",
      link: "/data",
      id: "data-feature"
    },
    {
      icon: Store,
      title: "Dealers Hub",
      description: "Find local motorcycle dealers and repair shops near you.",
      link: "/dealers",
      id: "dealers-feature"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature) => (
                <Link 
                  to={feature.link}
                  key={feature.title}
                  className="block"
                  id={feature.id}
                >
                  <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow duration-200">
                    <div className="flex flex-col h-full">
                      <div className="mb-6">
                        <div className="w-12 h-12 rounded-full bg-theme-100 text-theme-600 flex items-center justify-center mx-auto">
                          <feature.icon size={24} />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
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
