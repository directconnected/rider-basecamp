
import React from "react";
import { Card } from "@/components/ui/card";
import { 
  Zap, 
  LineChart, 
  BookOpen, 
  MessageCircle, 
  Globe 
} from "lucide-react";

const Features = () => {
  return (
    <section className="bg-gray-50 py-24 w-full">
      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Zap,
              title: "Instant Results",
              description: "Get valuation results in seconds with our optimized system"
            },
            {
              icon: LineChart,
              title: "Price Trends",
              description: "View detailed price trends across different regions"
            },
            {
              icon: BookOpen,
              title: "Expert Reviews",
              description: "Access professional motorcycle reviews and ratings"
            },
            {
              icon: MessageCircle,
              title: "Community Input",
              description: "Benefit from real owner experiences and feedback"
            },
            {
              icon: Globe,
              title: "Global Coverage",
              description: "Access data from markets around the world"
            }
          ].map((feature) => (
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
  );
};

export default Features;
