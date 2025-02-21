
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, BarChart, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

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
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-5">
          <div className="absolute inset-0 bg-black/50 z-0" />
          <div className="container mx-auto px-4 z-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                Get the real value of your motorcycle
              </h1>
              {isAuthenticated ? (
                <div className="max-w-2xl mx-auto mt-8">
                  <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
                    <Input 
                      placeholder="Enter motorcycle make, model, or year" 
                      className="py-6 text-lg flex-1"
                    />
                    <Button className="button-gradient text-white px-8 py-6">
                      <Search className="mr-2" />
                      Search
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  className="button-gradient text-white px-8 py-6 text-lg animate-fade-in"
                  onClick={() => navigate("/auth")}
                >
                  Sign In to Check Values
                </Button>
              )}
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

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">About Us</h3>
                <p className="text-gray-400">
                  Your trusted source for accurate motorcycle valuations and market insights.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/" className="text-gray-400 hover:text-theme-400 transition-colors">Home</a></li>
                  <li><a href="/pricing" className="text-gray-400 hover:text-theme-400 transition-colors">Pricing</a></li>
                  <li><a href="/features" className="text-gray-400 hover:text-theme-400 transition-colors">Features</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-theme-400 transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-theme-400 transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-theme-400 transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-theme-400 transition-colors">Support</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-theme-400 transition-colors">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Newsletter</h3>
                <p className="text-gray-400 mb-4">Stay updated with our latest valuations.</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter your email" 
                    className="bg-gray-800 border-gray-700"
                  />
                  <Button className="button-gradient">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Moto Values. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
