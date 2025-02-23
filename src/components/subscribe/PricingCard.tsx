
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  onSubscribe: () => void;
}

const PricingCard = ({ title, price, features, highlighted, onSubscribe }: PricingCardProps) => {
  return (
    <Card 
      className={`p-8 text-center hover-card ${
        highlighted ? "border-theme-400 shadow-lg scale-105" : ""
      }`}
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="text-4xl font-bold mb-6">
        <span className="text-2xl">$</span>
        {price}
        <span className="text-base font-normal text-gray-600">/mo</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature) => (
          <li key={feature} className="text-gray-600 flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            {feature}
          </li>
        ))}
      </ul>
      <Button 
        className={highlighted ? "button-gradient w-full text-white" : "w-full"}
        variant={highlighted ? "default" : "outline"}
        onClick={onSubscribe}
      >
        Subscribe Now
      </Button>
    </Card>
  );
};

export default PricingCard;
