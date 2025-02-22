import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import SearchForm from "@/components/search/SearchForm";
import SearchResults from "@/components/search/SearchResults";
import Features from "@/components/features/Features";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

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

  const decodeVINYear = (vin: string): string => {
    const yearChar = vin.charAt(9);
    const yearMap: { [key: string]: string } = {
      'A': '2010', 'B': '2011', 'C': '2012', 'D': '2013',
      'E': '2014', 'F': '2015', 'G': '2016', 'H': '2017',
      'J': '2018', 'K': '2019', 'L': '2020', 'M': '2021',
      'N': '2022', 'P': '2023', 'R': '2024',
      '1': '2001', '2': '2002', '3': '2003', '4': '2004',
      '5': '2005', '6': '2006', '7': '2007', '8': '2008',
      '9': '2009'
    };
    return yearMap[yearChar] || '';
  };

  const decodeVINMake = (vin: string): string => {
    const makePrefix = vin.substring(0, 3);
    const makeMap: { [key: string]: string } = {
      'JYA': 'Yamaha',
      'KAW': 'Kawasaki',
      'JH2': 'Honda',
      'JSB': 'Suzuki',
      'KTM': 'KTM',
      'WB1': 'BMW',
      'ZDM': 'Ducati',
      'MEH': 'Harley-Davidson',
      'SMT': 'Triumph',
      '1HD': 'Harley-Davidson',
      // Add more manufacturer codes as needed
    };
    return makeMap[makePrefix] || '';
  };

  const handleSearchByVIN = async (vin: string) => {
    if (vin.length !== 17) {
      toast.error("Invalid VIN length - must be 17 characters");
      return;
    }

    setIsSearching(true);
    try {
      const year = decodeVINYear(vin);
      const make = decodeVINMake(vin);

      if (!year || !make) {
        toast.error("Could not decode VIN manufacturer or year");
        return;
      }

      let query = supabase
        .from('motorcycles_1')
        .select('*')
        .eq('Make', make);

      if (year) {
        query = query.eq('Year', year);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching motorcycles:', error);
        toast.error("Error searching for motorcycles");
        return;
      }

      const resultsWithCurrentValue = (data || []).map((motorcycle) => ({
        ...motorcycle,
        value: calculateCurrentValue(motorcycle as Motorcycle)
      }));

      if (resultsWithCurrentValue.length === 0) {
        toast.warning("No matches found for this VIN");
      } else {
        toast.success(`Found ${resultsWithCurrentValue.length} potential matches`);
      }

      setSearchResults(resultsWithCurrentValue);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error processing VIN");
    } finally {
      setIsSearching(false);
    }
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
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
               Gear Up, Connect, and Ride
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in">
                Your Home for Motorcycle Knowledge & Community.
              </p>
              <div className="max-w-4xl mx-auto mt-8">
                <SearchForm
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  years={years}
                  makes={makes}
                  models={models}
                  isSearching={isSearching}
                  onSearch={handleSearch}
                  onVinSearch={handleSearchByVIN}
                />
              </div>
            </div>
          </div>
        </section>

        <SearchResults results={searchResults} formatCurrency={formatCurrency} />
        <Features />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
