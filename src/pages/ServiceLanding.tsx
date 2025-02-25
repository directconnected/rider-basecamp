
import React, { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, Clock, Settings } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";

const ServiceLanding = () => {
  const navigate = useNavigate();

  const serviceFeatures = [
    {
      icon: Wrench,
      title: "Service Records",
      description: "Track your motorcycle's maintenance history and upcoming service needs.",
      link: "/service-records",
      id: "service-records"
    },
    {
      icon: Clock,
      title: "Maintenance Reminders",
      description: "(Coming Soon)",
      link: "#",
      id: "maintenance-reminders"
    },
    {
      icon: Settings,
      title: "DIY Guides",
      description: "(Coming Soon)",
      link: "#",
      id: "diy-guides"
    }
  ];

  const handleFeatureClick = async (link: string, e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Feature clicked, link:", link); // Debug log
    
    if (link === "#") return;
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("Not authenticated, redirecting to auth with state:", { pathname: link }); // Debug log
      // Use state object format that matches what Auth component expects
      navigate('/auth', { 
        state: { from: { pathname: link } },
        replace: false
      });
    } else {
      console.log("Authenticated, navigating directly to:", link); // Debug log
      navigate(link);
    }
  };

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

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {serviceFeatures.map((feature) => (
                <a 
                  key={feature.id}
                  href={feature.link}
                  onClick={(e) => handleFeatureClick(feature.link, e)}
                  className={`block h-[300px] ${feature.link === "#" ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow duration-200">
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
                </a>
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
