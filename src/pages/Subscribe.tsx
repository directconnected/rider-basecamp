
import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import FeaturesSection from "@/components/subscribe/FeaturesSection";
import PricingSection from "@/components/subscribe/PricingSection";
import FAQSection from "@/components/subscribe/FAQSection";

const Subscribe = () => {
  const navigate = useNavigate();

  const plans = [
    {
      title: "Basic",
      price: "10.00",
      priceId: "price_1QvlKaCXT3Oz0sc73x23FLQ2",
      features: [
        "Basic motorcycle valuations",
        "Limited search functionality",
        "Email support",
      ],
    },
    {
      title: "Pro",
      price: "20.00",
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
      price: "30.00",
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
        <FeaturesSection />
        <PricingSection plans={plans} onSubscribe={handleSubscribe} />
        <FAQSection />
      </main>
    </div>
  );
};

export default Subscribe;
