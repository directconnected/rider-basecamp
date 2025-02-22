
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Motorcycle, SearchParams } from "@/types/motorcycle";
import { calculateCurrentValue } from "@/utils/motorcycleCalculations";
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
    if (motorcycle.current_value) {
      return;
    }

    const calculatedValue = calculateCurrentValue(motorcycle.msrp);
    if (calculatedValue === 0) {
      return;
    }

    const formattedValue = `$${calculatedValue}`;
    const { error } = await supabase
      .from('data_2025')
      .update({ current_value: formattedValue })
      .eq('id', motorcycle.id);

    if (error) {
      console.error('Error updating current value:', error);
      return;
    }

    console.log(`Updated current value for ID ${motorcycle.id} to ${formattedValue}`);
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
        value: calculateCurrentValue(motorcycle.msrp)
      }));

      for (const motorcycle of resultsWithCurrentValue) {
        await updateMotorcycleValue(motorcycle);
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
        return;
      }

      const resultsWithCurrentValue = (data || []).map((motorcycle) => ({
        ...motorcycle,
        value: calculateCurrentValue(motorcycle.msrp)
      }));

      for (const motorcycle of resultsWithCurrentValue) {
        await updateMotorcycleValue(motorcycle);
      }

      setSearchResults(resultsWithCurrentValue);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        console.log('Fetching makes...');
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
          console.log('Makes data:', data);
          const uniqueMakes = Array.from(new Set(data
            .map(item => item.make)
            .filter(Boolean)))
            .sort();
          console.log('Unique makes:', uniqueMakes);
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
          console.log('Fetching models for make:', searchParams.make);
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
            console.log('Models data:', data);
            const uniqueModels = Array.from(new Set(data
              .map(item => item.model)
              .filter(Boolean)))
              .sort();
            console.log('Unique models:', uniqueModels);
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
