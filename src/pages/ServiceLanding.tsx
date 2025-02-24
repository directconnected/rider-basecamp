
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Wrench, Clock, Tool } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

const ServiceLanding = () => {
  const serviceFeatures = [
    {
      icon: Wrench,
      title: "Service Records",
      description: "Track your motorcycle's maintenance history and upcoming service needs.",
      link: "/service",
      id: "service-records"
    },
    {
      icon: Clock,
      title: "Maintenance Reminders",
      description: "Set up reminders for upcoming maintenance tasks (Coming Soon).",
      link: "#",
      id: "maintenance-reminders"
    },
    {
      icon: Tool,
      title: "DIY Guides",
      description: "Access maintenance guides and tutorials (Coming Soon).",
      link: "#",
      id: "diy-guides"
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
                Motorcycle Service Hub
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Keep track of your motorcycle's maintenance and service history
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceFeatures.map((feature) => (
                <Link 
                  to={feature.link}
                  key={feature.id}
                  className={`block ${feature.link === "#" ? "cursor-not-allowed" : ""}`}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="flex flex-col h-full">
                      <div className="flex-none flex items-center justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-theme-100 text-theme-600 flex items-center justify-center">
                          <feature.icon size={24} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceLanding;
