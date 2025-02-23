
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Book, Compass, Tool } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

const Documentation = () => {
  const sections = [
    {
      icon: FileText,
      title: "Getting Started",
      description: "Learn the basics of motorcycle maintenance and riding.",
    },
    {
      icon: Book,
      title: "User Guides",
      description: "Detailed guides for riders of all experience levels.",
    },
    {
      icon: Compass,
      title: "Route Planning",
      description: "How to plan and navigate your motorcycle journeys.",
    },
    {
      icon: Tool,
      title: "Technical Reference",
      description: "Specifications and technical documentation.",
    },
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
                Documentation
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Everything you need to know about motorcycle riding and maintenance
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {sections.map((section, index) => (
                <Card key={index} className="hover-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        <section.icon className="h-6 w-6 text-theme-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2">{section.title}</h3>
                        <p className="text-gray-600">{section.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;
