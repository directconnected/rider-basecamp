
import React from "react";
import { Card } from "@/components/ui/card";
import { Users, BarChart, DollarSign } from "lucide-react";

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Why Advertise With Us?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Reach your target audience effectively and maximize your ROI
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Users,
                  title: "Targeted Audience",
                  description: "Connect with motorcycle enthusiasts and buyers who are actively searching for vehicles.",
                },
                {
                  icon: BarChart,
                  title: "Performance Analytics",
                  description: "Track your ad performance in real-time with detailed metrics and insights.",
                },
                {
                  icon: DollarSign,
                  title: "ROI Focused",
                  description: "Maximize your advertising investment with our performance-driven platform.",
                },
              ].map((feature) => (
                <Card 
                  key={feature.title}
                  className="p-8 text-center hover-card"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-theme-100 text-theme-600 mb-4">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Features;
