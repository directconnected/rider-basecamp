
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Search, Database, BarChart, Lock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Subscribe = () => {
  const navigate = useNavigate();

  const plans = [
    {
      title: "Basic",
      price: "9.99",
      priceId: "price_1QvlKaCXT3Oz0sc73x23FLQ2",
      features: [
        "Basic motorcycle valuations",
        "Limited search functionality",
        "Email support",
      ],
    },
    {
      title: "Pro",
      price: "19.99",
      priceId: "price_1QvlLRCXT3Oz0sc7KBXQlgPT",
      features: [
        "Advanced motorcycle valuations",
        "Full search capabilities",
        "Historical price data",
        "Priority support",
      ],
      highlighted: true,
    },
    {
      title: "Enterprise",
      price: "49.99",
      priceId: "price_1QvlLcCXT3Oz0sc7AhZJKdvz",
      features: [
        "Custom API access",
        "Bulk valuations",
        "Market analysis tools",
        "24/7 dedicated support",
      ],
    },
  ];

  const handleSubscribe = async (priceId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const response = await fetch(
        'https://hungfeisnqbmzurpxvel.functions.supabase.co/create-checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ priceId }),
        }
      );

      const { url, error } = await response.json();
      
      if (error) throw new Error(error);
      if (url) window.location.href = url;
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to start checkout process');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Premium Features
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get unlimited access to motorcycle valuation data and premium features
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
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

        {/* Pricing Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Choose Your Plan
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select the subscription that best fits your needs
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
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
                      <li key={feature} className="text-gray-600 flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={plan.highlighted ? "button-gradient w-full text-white" : "w-full"}
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.priceId)}
                  >
                    Subscribe Now
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our subscription plans
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans."
                },
                {
                  question: "Is there a free trial available?",
                  answer: "Yes, all plans come with a 14-day free trial. No credit card required to start."
                },
              ].map((faq) => (
                <Card key={faq.question} className="p-6">
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Subscribe;
