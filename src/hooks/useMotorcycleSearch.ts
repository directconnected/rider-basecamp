
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types/motorcycle";
import { decodeVINMake, decodeVINYear } from "@/utils/vinDecoder";
import { toast } from "sonner";
import { useSearchParamsStore } from "@/stores/motorcycleSearchStore";
import { useMotorcycleData } from "@/hooks/useMotorcycleData";
import { updateMotorcycleValue } from "@/services/motorcycleValueService";

export const useMotorcycleSearch = () => {
  const { searchParams, setSearchParams, years } = useSearchParamsStore();
  const { makes, models, fetchMakes, fetchModels } = useMotorcycleData();
  const [searchResults, setSearchResults] = useState<Motorcycle[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const processSearchResults = async (motorcycles: Motorcycle[]) => {
    const updatedResults = await Promise.all(
      motorcycles.map(async (motorcycle) => {
        if (motorcycle.msrp) {
          const updatedValue = await updateMotorcycleValue(motorcycle);
          return {
            ...motorcycle,
            current_value: updatedValue
          };
        }
        return motorcycle;
      })
    );
    return updatedResults;
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

      const { data, error } = await supabase
        .from('data_2025')
        .select('*')
        .eq('make', make)
        .eq('year', year);

      if (error) throw error;

      const updatedResults = await processSearchResults(data || []);
      setSearchResults(updatedResults);
      toast.success(`Found ${updatedResults.length} potential matches`);

    } catch (error) {
      console.error('Error in handleSearchByVIN:', error);
      toast.error('Failed to search by VIN. Check console for details.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('data_2025')
        .select('*')
        .eq('year', searchParams.year)
        .eq('make', searchParams.make)
        .eq('model', searchParams.model);

      if (error) {
        console.error('Search error:', error);
        throw new Error('Failed to search');
      }

      const updatedResults = await processSearchResults(data || []);
      setSearchResults(updatedResults);

    } catch (error) {
      console.error('Error in handleSearch:', error);
      toast.error('Failed to search. Check console for details.');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchMakes();
    if (searchParams.make) {
      fetchModels(searchParams.make);
    } else {
      setSearchResults([]);
    }
  }, [searchParams.make]);

  return {
    searchParams,
    setSearchParams,
    searchResults,
    isSearching,
    years,
    makes,
    models,
    handleSearch,
    handleSearchByVIN,
    updateMotorcycleValue
  };
};
