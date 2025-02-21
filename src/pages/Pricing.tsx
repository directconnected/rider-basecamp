
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">
                Premium Advertising Plans
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the perfect advertising package for your business
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "Starter",
                  price: "299",
                  features: [
                    "Basic banner placement",
                    "Monthly performance reports",
                    "Standard support",
                  ],
                },
                {
                  title: "Professional",
                  price: "499",
                  features: [
                    "Premium banner placement",
                    "Weekly performance reports",
                    "Priority support",
                    "A/B testing",
                  ],
                  highlighted: true,
                },
                {
                  title: "Enterprise",
                  price: "899",
                  features: [
                    "Multiple banner placements",
                    "Real-time analytics",
                    "24/7 dedicated support",
                    "Custom integration",
                  ],
                },
              ].map((plan) => (
                <Card 
                  key={plan.title}
                  className={`p-8 text-center hover-card ${
                    plan.highlighted 
                      ? "border-theme-400 shadow-lg scale-105" 
                      : ""
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                  <div className="text-4xl font-bold mb-6">
                    <span className="text-2xl">$</span>
                    {plan.price}
                    <span className="text-base font-normal text-gray-600">/mo</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="text-gray-600">
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={plan.highlighted ? "button-gradient w-full text-white" : "w-full"}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Pricing;
