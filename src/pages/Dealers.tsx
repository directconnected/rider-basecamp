
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { MapPin, Star, Phone, Clock } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

const Dealers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Local Dealers
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Find trusted motorcycle dealers in your area
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Dealer Network
                </h2>
                <p className="text-gray-600 mb-6">
                  Connect with local motorcycle dealers for sales, service, and support. Our network of verified dealers ensures you get the best service and deals in your area.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    icon: MapPin,
                    title: "Locations",
                    description: "Find nearby dealers"
                  },
                  {
                    icon: Star,
                    title: "Reviews",
                    description: "Dealer ratings"
                  },
                  {
                    icon: Phone,
                    title: "Contact",
                    description: "Direct connect"
                  },
                  {
                    icon: Clock,
                    title: "Hours",
                    description: "Operating times"
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

export default Dealers;
