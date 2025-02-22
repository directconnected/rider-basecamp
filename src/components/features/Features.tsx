
import React from "react";
import { Card } from "@/components/ui/card";
import { Database, TrendingUp, ShieldCheck } from "lucide-react";

const Features = () => {
  return (
    <section className="bg-gray-50 py-24 w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">
          Why Choose Our Valuation System?
        </h2>
      </div>
      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Database,
              title: "Comprehensive Database",
              description: "Access up-to-date values for thousands of motorcycle models across all major brands",
            },
            {
              icon: TrendingUp,
              title: "Real-Time Market Analysis",
              description: "Get accurate valuations based on current market trends and recent sales data",
            },
            {
              icon: ShieldCheck,
              title: "Trusted Accuracy",
              description: "Our values are verified against dealer listings and actual sale prices",
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
  );
};

export default Features;
