
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { adminClient } from "@/integrations/supabase/adminClient";
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
  const [years] = useState(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 30 }, (_, i) => currentYear - i);
  });

  const updateMotorcycleValue = async (motorcycle: Motorcycle) => {
    try {
      if (!motorcycle.msrp) {
        console.log('No MSRP available for motorcycle:', motorcycle.id);
        return;
      }

      const msrpNumber = Number(motorcycle.msrp);
      if (isNaN(msrpNumber)) {
        console.error('Invalid MSRP value:', motorcycle.msrp);
        return;
      }

      const currentValue = calculateCurrentValue(msrpNumber);
      if (currentValue === 0) {
        console.error('Could not calculate valid current value');
        return;
      }

      console.log('Attempting database update with:', {
        id: motorcycle.id,
        currentValue: currentValue
      });

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

      const { data: verifyData, error: verifyError } = await adminClient
        .from('data_2025')
        .select('current_value')
        .eq('id', motorcycle.id)
        .maybeSingle();

      if (verifyError) {
        console.error('Verify error:', verifyError);
        throw new Error('Failed to verify update');
      }

      // Explicitly type the map operation to prevent infinite type instantiation
      setSearchResults((prevResults: Motorcycle[]) => {
        return prevResults.map((m: Motorcycle): Motorcycle => {
          if (m.id === motorcycle.id) {
            return {
              ...m,
              current_value: currentValue,
              value: currentValue
            };
          }
          return m;
        });
      });

      toast.success(`Updated value: ${formatCurrency(currentValue)}`);

    } catch (error) {
      console.error('Error in updateMotorcycleValue:', error);
      toast.error('Failed to update motorcycle value. Check console for details.');
    }
  };

  const handleSearchByVIN = async (vin: string) => {
    try {
      const { data, error } = await supabase
        .from('data_2025')
        .select('*')
        .eq('vin', vin);

      if (error) {
        console.error('Search error:', error);
        throw new Error('Failed to search by VIN');
      }

      setSearchResults(data || []);
      setIsSearching(false);
    } catch (error) {
      console.error('Error in handleSearchByVIN:', error);
      toast.error('Failed to search by VIN. Check console for details.');
    }
  };

  const handleSearch = async () => {
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

      setSearchResults(data || []);
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
        .select('model');

      if (error) {
        console.error('Fetch models error:', error);
        throw new Error('Failed to fetch models');
      }

      const uniqueModels = Array.from(new Set(data.map(item => item.model).filter(Boolean)));
      setModels(uniqueModels.sort());
    };

    fetchMakes();
    fetchModels();
  }, []);

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
