
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useCampsiteSearchStore } from "@/stores/campsiteSearchStore";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Campsite = Database['public']['Tables']['campsites']['Row'];

export const useCampsiteSearch = () => {
  const { searchParams, setSearchParams } = useCampsiteSearchStore();
  const [searchResults, setSearchResults] = useState<Campsite[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]); // Clear previous results
    
    try {
      if (!searchParams.state.trim()) {
        toast.error('Please enter a state');
        return;
      }

      // First, let's check if we have any data at all
      const { count, error: countError } = await supabase
        .from('campsites')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error checking database:', countError);
        throw countError;
      }

      console.log('Total records in database:', count);

      const { data, error } = await supabase
        .from('campsites')
        .select()
        .limit(1);

      console.log('Sample record:', data);

      if (count === 0) {
        toast.error('The campsite database appears to be empty');
        return;
      }

      // If we have data, proceed with the search
      const stateCode = searchParams.state.trim().toUpperCase();
      console.log('Searching for state code:', stateCode);

      const { data: searchData, error: searchError } = await supabase
        .from('campsites')
        .select('*')
        .ilike('state', `%${stateCode}%`);

      if (searchError) {
        console.error('Search error:', searchError);
        throw searchError;
      }

      console.log('Search results:', searchData);
      
      if (searchData && searchData.length > 0) {
        setSearchResults(searchData);
        toast.success(`Found ${searchData.length} campsites`);
      } else {
        toast.info(`No campsites found in ${searchParams.state.trim()}`);
      }

    } catch (error) {
      console.error('Error in handleSearch:', error);
      toast.error('Failed to search campsites. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchParams,
    setSearchParams,
    searchResults,
    isSearching,
    handleSearch,
  };
};
