
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Motorcycle } from '@/types/motorcycle';
import { PostgrestError } from '@supabase/supabase-js';

export const useRegularSearch = () => {
  const [results, setResults] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);

  // Format currency values for display
  const formatCurrency = (value: string | null | number): string => {
    if (value === null || value === undefined) return 'N/A';
    
    // Convert to number if it's a string
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Check if value is valid number
    if (isNaN(numberValue)) return 'N/A';
    
    // Format the number as currency
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numberValue);
  };

  // Perform search based on parameters
  const search = async (make: string, model: string, yearFrom: string, yearTo: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('data_2025').select('*');
      
      // Apply filters
      if (make) {
        query = query.ilike('make', `%${make}%`);
      }
      
      if (model) {
        query = query.ilike('model', `%${model}%`);
      }
      
      if (yearFrom) {
        query = query.gte('year', yearFrom);
      }
      
      if (yearTo) {
        query = query.lte('year', yearTo);
      }
      
      const { data, error } = await query;
      
      if (error) {
        setError(error);
        setResults([]);
      } else {
        // Cast data to the Motorcycle type
        setResults(data as unknown as Motorcycle[]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { results, isLoading, error, search, formatCurrency };
};
