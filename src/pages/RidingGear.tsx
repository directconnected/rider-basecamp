
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Wind, Sun, Cloud, Tent } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "react-router-dom";

const RidingGear = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Motorcycle Riding Gear
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Safety, comfort, and style for every ride
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Essential Riding Equipment
                </h2>
                <p className="text-gray-600 mb-6">
                  From helmets to boots, find the best protective gear for your rides. Our comprehensive guides help you choose equipment that offers both protection and comfort while matching your riding style.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    icon: Shield,
                    title: "Protection",
                    description: "Safety-certified gear",
                    link: "#"
                  },
                  {
                    icon: Wind,
                    title: "Ventilation",
                    description: "Climate control",
                    link: "#"
                  },
                  {
                    icon: Sun,
                    title: "All-Season",
                    description: "Year-round comfort",
                    link: "#"
                  },
                  {
                    icon: Tent,
                    title: "Motorcycle Tents",
                    description: "Adventure-ready camping",
                    link: "/tents"
                  }
                ].map((item) => (
                  <Link to={item.link} key={item.title}>
                    <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200 h-full">
                      <item.icon className="w-8 h-8 mx-auto mb-4 text-theme-600" />
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </Card>
                  </Link>
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

export default RidingGear;
