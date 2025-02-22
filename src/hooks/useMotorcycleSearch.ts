import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Motorcycle, SearchParams } from "@/types/motorcycle";
import { calculateCurrentValue, formatCurrency } from "@/utils/motorcycleCalculations";
import { decodeVINMake, decodeVINYear } from "@/utils/vinDecoder";

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
      const { data: testData, error: testError } = await supabase
        .from('data_2025')
        .select('id')
        .eq('id', motorcycle.id)
        .single();

      if (testError) {
        console.error('Database access error:', testError);
        toast.error('Database access error. Please check permissions.');
        return;
      }

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
        msrp: msrpNumber,
        currentValue: currentValue
      });

      const { error: updateError } = await supabase
        .from('data_2025')
        .update({ 
          current_value: currentValue
        })
        .eq('id', motorcycle.id);

      if (updateError) {
        throw new Error(`Update failed: ${updateError.message}`);
      }

      const { data: verifyData, error: verifyError } = await supabase
        .from('data_2025')
        .select('current_value')
        .eq('id', motorcycle.id)
        .single();

      if (verifyError || !verifyData) {
        throw new Error('Failed to verify update');
      }

      console.log('Update verified:', {
        id: motorcycle.id,
        newValue: verifyData.current_value
      });

      setSearchResults(prev => 
        prev.map(m => 
          m.id === motorcycle.id 
            ? { ...m, current_value: currentValue, value: currentValue }
            : m
        )
      );

      toast.success(`Updated value: ${formatCurrency(currentValue)}`);

    } catch (error) {
      console.error('Error in updateMotorcycleValue:', error);
      toast.error('Failed to update motorcycle value. Check console for details.');
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

      let query = supabase
        .from('data_2025')
        .select('*')
        .eq('make', make);

      if (year) {
        query = query.eq('year', year);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching motorcycles:', error);
        toast.error("Error searching for motorcycles");
        return;
      }

      const resultsWithCurrentValue = (data || []).map((motorcycle) => ({
        ...motorcycle,
        value: motorcycle.msrp ? calculateCurrentValue(motorcycle.msrp) : null
      }));

      for (const motorcycle of resultsWithCurrentValue) {
        if (motorcycle.msrp) {
          await updateMotorcycleValue(motorcycle);
        }
      }

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

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      if (searchParams.vin) {
        await handleSearchByVIN(searchParams.vin);
        return;
      }

      let query = supabase
        .from('data_2025')
        .select('*');

      if (searchParams.year) {
        query = query.eq('year', searchParams.year);
      }
      if (searchParams.make) {
        query = query.eq('make', searchParams.make);
      }
      if (searchParams.model) {
        query = query.eq('model', searchParams.model);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching motorcycles:', error);
        toast.error("Error searching for motorcycles");
        return;
      }

      const resultsWithCurrentValue = (data || []).map((motorcycle) => ({
        ...motorcycle,
        value: motorcycle.msrp ? calculateCurrentValue(motorcycle.msrp) : null
      }));

      console.log('Results with calculated values:', resultsWithCurrentValue);

      for (const motorcycle of resultsWithCurrentValue) {
        if (motorcycle.msrp) {
          await updateMotorcycleValue(motorcycle);
        }
      }

      if (resultsWithCurrentValue.length === 0) {
        toast.warning("No matches found");
      } else {
        toast.success(`Found ${resultsWithCurrentValue.length} matches`);
      }

      setSearchResults(resultsWithCurrentValue);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error during search");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const { data, error } = await supabase
          .from('data_2025')
          .select('make')
          .not('make', 'eq', null)
          .order('make');

        if (error) {
          console.error('Error fetching makes:', error);
          return;
        }

        if (data) {
          const uniqueMakes = Array.from(new Set(data
            .map(item => item.make)
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
            .from('data_2025')
            .select('model')
            .eq('make', searchParams.make)
            .not('model', 'eq', null)
            .order('model');

          if (error) {
            console.error('Error fetching models:', error);
            return;
          }

          if (data) {
            const uniqueModels = Array.from(new Set(data
              .map(item => item.model)
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

  return {
    searchParams,
    setSearchParams,
    searchResults,
    isSearching,
    years,
    makes,
    models,
    handleSearch,
    handleSearchByVIN
  };
};
