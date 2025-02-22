
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Shield, Search, Database, BarChart, Clock, Users, Wrench, Map, RefreshCw, BellRing } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const features = [
    {
      icon: Map,
      title: "Motorcycle Roads and Routes",
      description: "Top motorcycle roads, scenic routes, and riding tips."
    },
    {
      icon: Database,
      title: "Best Motorcycle Camping Gear",
      description: "Top camping gear for bikers: compact, durable, essentials."
    },
    {
      icon: BarChart,
      title: "Best Motorcycle Riding Gear",
      description: "Top riding gear: safety, comfort, and style for bikers."
    },
    {
      icon: Shield,
      title: "Trusted Data",
      description: "Verified by industry experts"
    },
    {
      icon: Clock,
      title: "Historical Trends",
      description: "Track price changes over time"
    },
    {
      icon: Users,
      title: "Community Reviews",
      description: "Read authentic reviews from real riders"
    },
    {
      icon: Wrench,
      title: "Service History",
      description: "Track maintenance records and service intervals"
    },
    {
      icon: Search,
      title: "Local Dealers",
      description: "Find trusted dealers in your area"
    },
    {
      icon: RefreshCw,
      title: "Motorcycle Data",
      description: "VIN Lookup, Service Manuals, Owner's Manuals, Manufacturer Specs"
    },
    {
      icon: BellRing,
      title: "Price Alerts",
      description: "Get notified when prices change"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-5">
          <div className="absolute inset-0 bg-black/50 z-0" />
          <div className="w-full px-4 z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
                Gear Up and Ride
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in">
                Your Home for Motorcycle Knowledge and Community
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Features
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
              {features.map((feature) => (
                <Card 
                  key={feature.title}
                  className="p-6 text-center hover-card"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-theme-100 text-theme-600 mb-4">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
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
