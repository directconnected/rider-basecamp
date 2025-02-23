
import React from "react";
import PricingCard from "./PricingCard";

interface Plan {
  title: string;
  price: string;
  priceId: string;
  features: string[];
  highlighted?: boolean;
}

interface PricingSectionProps {
  plans: Plan[];
  onSubscribe: (priceId: string) => void;
}

const PricingSection = ({ plans, onSubscribe }: PricingSectionProps) => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the subscription that best fits your needs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              {...plan}
              onSubscribe={() => onSubscribe(plan.priceId)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
