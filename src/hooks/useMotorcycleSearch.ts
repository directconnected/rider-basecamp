import { useState, useEffect } from 'react';
import { supabase, adminClient } from "@/integrations/supabase/client";
import { Motorcycle, SearchParams } from "@/types/motorcycle";
import { calculateCurrentValue, formatCurrency } from "@/utils/motorcycleCalculations";
import { decodeVINMake, decodeVINYear } from "@/utils/vinDecoder";
import { toast } from "sonner";

export const useMotorcycleSearch = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    year: '',
    make: '',
    model: '',
    vin: ''
  });
  const [searchResults, setSearchResults] = useState<Motorcycle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years] = useState<number[]>(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 30 }, (_, i) => currentYear - i);
  });

  const updateMotorcycleValue = async (motorcycle: Motorcycle) => {
    try {
      if (!motorcycle.msrp) {
        console.log('No MSRP available for motorcycle:', motorcycle.id);
        return null;
      }

      const msrpNumber = Number(motorcycle.msrp);
      if (isNaN(msrpNumber)) {
        console.error('Invalid MSRP value:', motorcycle.msrp);
        return null;
      }

      const currentValue = calculateCurrentValue(msrpNumber);
      if (currentValue === 0) {
        console.error('Could not calculate valid current value');
        return null;
      }

      // Check if update is needed
      const { data: existingData, error: checkError } = await adminClient
        .from('data_2025')
        .select('current_value')
        .eq('id', motorcycle.id)
        .maybeSingle();

      if (checkError) {
        console.error('Check error:', checkError);
        return null;
      }

      if (existingData?.current_value === currentValue) {
        console.log('No update needed for:', motorcycle.id);
        return currentValue;
      }

      const { error: updateError } = await adminClient
        .from('data_2025')
        .update({
          current_value: currentValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', motorcycle.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`Update failed: ${updateError.message}`);
      }

      toast.success(`Updated value: ${formatCurrency(currentValue)}`);
      return currentValue;

    } catch (error) {
      console.error('Error in updateMotorcycleValue:', error);
      toast.error('Failed to update motorcycle value. Check console for details.');
      return null;
    }
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
        .select('id, year, make, model, msrp, current_value, created_at')
        .eq('make', make)
        .eq('year', year);

      if (error) throw error;

      const updatedResults = await Promise.all(
        (data || []).map(async (motorcycle: Motorcycle) => {
          if (motorcycle.msrp) {
            const updatedValue = await updateMotorcycleValue(motorcycle);
            return {
              ...motorcycle,
              current_value: updatedValue ?? motorcycle.current_value
            };
          }
          return motorcycle;
        })
      );

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
    try {
      const { data, error } = await supabase
        .from('data_2025')
        .select('id, year, make, model, msrp, current_value, created_at')
        .eq('year', searchParams.year)
        .eq('make', searchParams.make)
        .eq('model', searchParams.model);

      if (error) {
        console.error('Search error:', error);
        throw new Error('Failed to search');
      }

      const updatedResults = await Promise.all(
        (data || []).map(async (motorcycle: Motorcycle) => {
          if (motorcycle.msrp) {
            const updatedValue = await updateMotorcycleValue(motorcycle);
            return {
              ...motorcycle,
              current_value: updatedValue ?? motorcycle.current_value
            };
          }
          return motorcycle;
        })
      );

      setSearchResults(updatedResults);
      setIsSearching(false);
    } catch (error) {
      console.error('Error in handleSearch:', error);
      toast.error('Failed to search. Check console for details.');
    }
  };

  useEffect(() => {
    const fetchMakes = async () => {
      const { data, error } = await supabase
        .from('data_2025')
        .select('make');

      if (error) {
        console.error('Fetch makes error:', error);
        throw new Error('Failed to fetch makes');
      }

      const uniqueMakes = Array.from(new Set(data.map(item => item.make).filter(Boolean)));
      setMakes(uniqueMakes.sort());
    };

    const fetchModels = async () => {
      const { data, error } = await supabase
        .from('data_2025')
        .select('model')
        .eq('make', searchParams.make);

      if (error) {
        console.error('Fetch models error:', error);
        throw new Error('Failed to fetch models');
      }

      const uniqueModels = Array.from(new Set(data.map(item => item.model).filter(Boolean)));
      setModels(uniqueModels.sort());
    };

    fetchMakes();
    if (searchParams.make) {
      fetchModels();
    } else {
      setModels([]);
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
