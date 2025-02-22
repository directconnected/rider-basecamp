import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Database, TrendingUp, ShieldCheck, ArrowRight, ScanBarcode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

interface Motorcycle {
  motorcycle_id: number;
  Year: string | null;
  Make: string | null;
  Model: string | null;
  Category: string | null;
  Rating: string | null;
  MSRP: string | null;
  "Engine type": string | null;
  "Engine details": string | null;
  "Power (PS)": string | null;
  value?: number;
}

const Index = () => {
  const [searchParams, setSearchParams] = useState({
    year: '',
    make: '',
    model: '',
    vin: ''
  });
  const [searchResults, setSearchResults] = useState<Motorcycle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [years] = useState(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 30 }, (_, i) => currentYear - i);
  });
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const { data, error } = await supabase
          .from('motorcycles_1')
          .select('Make')
          .not('Make', 'is', null);

        if (error) {
          console.error('Error fetching makes:', error);
          return;
        }

        if (data) {
          const uniqueMakes = Array.from(new Set(data
            .map(item => item.Make)
            .filter(Boolean)))
            .sort();
          setMakes(uniqueMakes);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchMakes();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (searchParams.make) {
        try {
          const { data, error } = await supabase
            .from('motorcycles_1')
            .select('Model')
            .eq('Make', searchParams.make)
            .not('Model', 'is', null);

          if (error) {
            console.error('Error fetching models:', error);
            return;
          }

          if (data) {
            const uniqueModels = Array.from(new Set(data
              .map(item => item.Model)
              .filter(Boolean)))
              .sort();
            setModels(uniqueModels);
          }
        } catch (err) {
          console.error('Error:', err);
        }
      } else {
        setModels([]);
      }
    };

    fetchModels();
  }, [searchParams.make]);

  const handleSearchByVIN = async (vin: string) => {
    if (vin.length !== 17) {
      console.log("Invalid VIN length");
      return;
    }

    const year = vin.charAt(9); // 10th character represents the year
    const make = vin.substring(0, 3); // First 3 characters typically represent the manufacturer
    
    setSearchParams(prev => ({
      ...prev,
      year: year,
      make: make,
      vin: vin
    }));

    // Trigger the regular search with the decoded VIN information
    handleSearch();
  };

  const calculateCurrentValue = (motorcycle: Motorcycle): number => {
    const msrp = parseFloat(motorcycle.MSRP?.replace(/[^0-9.]/g, '') || "0");
    return Math.round(msrp * 0.6);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      if (searchParams.vin) {
        await handleSearchByVIN(searchParams.vin);
        return;
      }

      let query = supabase
        .from('motorcycles_1')
        .select('*');

      if (searchParams.year) {
        query = query.eq('Year', searchParams.year);
      }
      if (searchParams.make) {
        query = query.eq('Make', searchParams.make);
      }
      if (searchParams.model) {
        query = query.eq('Model', searchParams.model);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching motorcycles:', error);
        return;
      }

      const resultsWithCurrentValue = (data || []).map((motorcycle) => ({
        ...motorcycle,
        value: calculateCurrentValue(motorcycle as Motorcycle)
      }));

      setSearchResults(resultsWithCurrentValue);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const formatCurrency = (value: string | null): string => {
    if (!value) return 'N/A';
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericValue);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-5">
          <div className="absolute inset-0 bg-black/50 z-0" />
          <div className="w-full px-4 z-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
                Find Your Motorcycle's Value
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in">
                owner's manuals, service manuals, manufacturer specs, maintenance schedules, parts diagrams
              </p>
              <div className="max-w-4xl mx-auto mt-8">
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Input
                      type="text"
                      placeholder="Enter VIN (17 characters)"
                      value={searchParams.vin}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
                      className="flex-1 bg-white"
                      maxLength={17}
                    />
                    <Button 
                      className="button-gradient text-white px-8 py-6"
                      onClick={() => handleSearchByVIN(searchParams.vin)}
                      disabled={isSearching || (searchParams.vin.length > 0 && searchParams.vin.length !== 17)}
                    >
                      <ScanBarcode className="mr-2" />
                      Decode VIN
                    </Button>
                  </div>
                  <div className="text-white text-center my-2">- OR -</div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <Select 
                      value={searchParams.year}
                      onValueChange={(value) => setSearchParams(prev => ({ ...prev, year: value, model: '' }))}
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
                    <Select 
                      value={searchParams.make}
                      onValueChange={(value) => setSearchParams(prev => ({ ...prev, make: value, model: '' }))}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select Make" />
                      </SelectTrigger>
                      <SelectContent>
                        {makes.map(make => (
                          <SelectItem key={make} value={make}>
                            {make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={searchParams.model}
                      onValueChange={(value) => setSearchParams(prev => ({ ...prev, model: value }))}
                      disabled={!searchParams.make}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map(model => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          </div>
        </section>

        {searchResults.length > 0 ? (
          <section className="w-full bg-white py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Search Results</h2>
              <p className="text-gray-600">Found {searchResults.length} matches</p>
            </div>
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-5 gap-8">
                {searchResults.map((motorcycle) => (
                  <Card key={motorcycle.motorcycle_id} className="col-span-5 lg:col-start-2 lg:col-span-3 bg-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-1">
                        {motorcycle.Year} {motorcycle.Make}
                      </h3>
                      <p className="text-gray-600 text-lg mb-6">{motorcycle.Model}</p>
                      
                      <div className="space-y-6 mb-6">
                        <div>
                          <p className="text-gray-500 text-sm">Estimated Current Value</p>
                          <p className="text-3xl font-bold text-theme-600">
                            ${motorcycle.value?.toLocaleString()}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500 text-sm">Original MSRP</p>
                          <p className="text-xl font-semibold">
                            {formatCurrency(motorcycle.MSRP)}
                          </p>
                        </div>

                        {motorcycle["Engine type"] && (
                          <div>
                            <p className="text-gray-500 text-sm">Engine</p>
                            <p className="text-base">{motorcycle["Engine type"]}</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-gray-500">Category:</span>
                          <span className="font-medium ml-2">{motorcycle.Category || 'N/A'}</span>
                        </div>
                        <Link to={`/motorcycle/${motorcycle.motorcycle_id}`}>
                          <Button className="button-gradient">
                            View Details
                            <ArrowRight className="ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-gray-50 py-24 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Our Valuation System?
            </h2>
          </div>
          <div className="px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
          <div className="px-4">
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
