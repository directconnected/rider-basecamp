
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, DollarSign, Users, BarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Premium Advertising Space on
            <span className="block text-theme-400">Motorcycle Valuations</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fade-in">
            Connect with motorcycle enthusiasts through strategic banner placement on our high-traffic valuation platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button className="button-gradient text-white px-8 py-6 text-lg">
              Start Advertising
            </Button>
            {isAuthenticated ? (
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 px-8 py-6 text-lg" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 px-8 py-6 text-lg"
                onClick={() => navigate("/auth")}
              >
                Sign In to Check Values
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Search Section */}
      {isAuthenticated ? (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">
                Find Your Motorcycle's Value
              </h2>
              <p className="text-gray-600">
                Get accurate market values based on real-time data
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-4 mb-8 animate-fade-in">
                <Input 
                  placeholder="Enter motorcycle make, model, or year" 
                  className="py-6 text-lg"
                />
                <Button className="button-gradient text-white px-8">
                  <Search className="mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Subscription Plans */}
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

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Advertise With Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Reach your target audience effectively
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Users,
                title: "Targeted Audience",
                description: "Connect with motorcycle enthusiasts and buyers",
              },
              {
                icon: BarChart,
                title: "Performance Analytics",
                description: "Track your ad performance in real-time",
              },
              {
                icon: DollarSign,
                title: "ROI Focused",
                description: "Maximize your advertising investment",
              },
            ].map((benefit) => (
              <Card 
                key={benefit.title}
                className="p-8 text-center hover-card"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-theme-100 text-theme-600 mb-4">
                  <benefit.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
