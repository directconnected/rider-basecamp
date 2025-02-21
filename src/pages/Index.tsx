
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Database, TrendingUp, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

interface Motorcycle {
  id: string;
  year: number;
  make: string;
  model: string;
  value: number;
  msrp: number;
}

const Index = () => {
  const [searchParams, setSearchParams] = useState({
    year: '',
    make: '',
    model: ''
  });
  const [searchResults, setSearchResults] = useState<Motorcycle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [years] = useState(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 30 }, (_, i) => currentYear - i);
  });

  const calculateCurrentValue = (motorcycle: Motorcycle): number => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - motorcycle.year;
    
    // Depreciation rates:
    // 1st year: 15%
    // 2-5 years: 10% per year
    // 6+ years: 5% per year
    let depreciationRate = 1; // Start with full value

    if (age >= 1) {
      depreciationRate *= 0.85; // First year 15% depreciation
      
      // Years 2-5
      const earlyYears = Math.min(4, age - 1); // How many years between 2-5
      depreciationRate *= Math.pow(0.90, earlyYears);
      
      // Years 6+
      const laterYears = Math.max(0, age - 5); // How many years after year 5
      depreciationRate *= Math.pow(0.95, laterYears);
    }

    return Math.round(motorcycle.msrp * depreciationRate);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      let query = supabase
        .from('motorcycles')
        .select('*');

      if (searchParams.year) {
        query = query.eq('year', parseInt(searchParams.year));
      }
      if (searchParams.make) {
        query = query.ilike('make', `%${searchParams.make}%`);
      }
      if (searchParams.model) {
        query = query.ilike('model', `%${searchParams.model}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching motorcycles:', error);
        return;
      }

      // Calculate current value for each motorcycle
      const resultsWithCurrentValue = (data || []).map(motorcycle => ({
        ...motorcycle,
        value: calculateCurrentValue(motorcycle)
      }));

      setSearchResults(resultsWithCurrentValue);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSearching(false);
    }
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
              <div className="max-w-4xl mx-auto mt-8">
                <div className="flex flex-col md:flex-row gap-4 animate-fade-in">
                  <Select 
                    value={searchParams.year}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, year: value }))}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input 
                    placeholder="Enter make (e.g., Honda)" 
                    value={searchParams.make}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, make: e.target.value }))}
                    className="bg-white"
                  />
                  <Input 
                    placeholder="Enter model (e.g., CBR600RR)" 
                    value={searchParams.model}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, model: e.target.value }))}
                    className="bg-white"
                  />
                  <Button 
                    className="button-gradient text-white px-8 py-6"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    <Search className="mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Results Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              {searchResults.length > 0 ? (
                <>
                  <h2 className="text-3xl font-bold mb-4">
                    Search Results
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Found {searchResults.length} matches
                  </p>
                </>
              ) : (
                <h2 className="text-3xl font-bold mb-4">
                  Why Choose Our Valuation System?
                </h2>
              )}
            </div>
            
            {searchResults.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {searchResults.map((motorcycle) => (
                  <Card 
                    key={motorcycle.id}
                    className="p-8 text-center hover-card"
                  >
                    <h3 className="text-xl font-bold mb-4">
                      {motorcycle.year} {motorcycle.make} {motorcycle.model}
                    </h3>
                    <p className="text-3xl font-bold text-theme-600 mb-2">
                      ${motorcycle.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Original MSRP: ${motorcycle.msrp.toLocaleString()}
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
            )}
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
                  <li><Link to="/" className="text-gray-400 hover:text-theme-400 transition-colors">Home</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-theme-400 transition-colors">About</Link></li>
                  <li><Link to="/advertise" className="text-gray-400 hover:text-theme-400 transition-colors">Advertise</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-theme-400 transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/blog" className="text-gray-400 hover:text-theme-400 transition-colors">Blog</Link></li>
                  <li><Link to="/docs" className="text-gray-400 hover:text-theme-400 transition-colors">Documentation</Link></li>
                  <li><Link to="/support" className="text-gray-400 hover:text-theme-400 transition-colors">Support</Link></li>
                  <li><Link to="/terms" className="text-gray-400 hover:text-theme-400 transition-colors">Terms of Service</Link></li>
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
