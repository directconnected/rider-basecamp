
import React from "react";
import { Search, Database, BarChart } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Advanced Search",
      description: "Access detailed search filters and save your favorite searches.",
    },
    {
      icon: Database,
      title: "Historical Data",
      description: "View historical price trends and market value changes.",
    },
    {
      icon: BarChart,
      title: "Market Analysis",
      description: "Get detailed market analysis and price predictions.",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Premium Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to motorcycle valuation data and premium features
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
