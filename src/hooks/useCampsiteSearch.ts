
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

      const stateCode = searchParams.state.trim().toUpperCase();
      
      const { data: searchData, error: searchError } = await supabase
        .from('campsites')
        .select('*')
        .ilike('state', `%${stateCode}%`);

      if (searchError) {
        console.error('Search error:', searchError);
        throw searchError;
      }
      
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
