
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useCampsiteSearchStore } from "@/stores/campsiteSearchStore";
import { toast } from "sonner";

export const useCampsiteSearch = () => {
  const { searchParams, setSearchParams } = useCampsiteSearchStore();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // Start with a base query
      let query = supabase
        .from('campsites')
        .select('*');

      // Add filters if values are provided
      if (searchParams.state.trim()) {
        // Try both the exact state code and a more flexible search
        const stateSearch = searchParams.state.trim().toUpperCase();
        query = query.or(`state.eq.${stateSearch},state.ilike.%${stateSearch}%`);
      }
      
      if (searchParams.nforg) {
        query = query.eq('nforg', parseInt(searchParams.nforg));
      }
      
      if (searchParams.town.trim()) {
        query = query.ilike('town', `%${searchParams.town.trim()}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Search results:', data); // Add logging to help debug
      setSearchResults(data || []);
      toast.success(`Found ${data?.length || 0} campsites`);

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
