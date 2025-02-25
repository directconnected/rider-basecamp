
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
    try {
      console.log('Starting search with params:', searchParams);
      
      if (!searchParams.state.trim()) {
        setSearchResults([]);
        toast.error('Please enter a state');
        return;
      }

      // First, let's check what data exists in the database
      const { data: allData } = await supabase
        .from('campsites')
        .select('state')
        .limit(100);
      
      console.log('Available states in database:', allData?.map(d => d.state));

      const stateSearch = searchParams.state.trim().toUpperCase();
      console.log('Searching for state:', stateSearch);
      
      const { data, error } = await supabase
        .from('campsites')
        .select()
        .eq('state', stateSearch);

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Search results:', data);
      setSearchResults(data || []);
      
      if (data && data.length > 0) {
        toast.success(`Found ${data.length} campsites`);
      } else {
        toast.info(`No campsites found in ${stateSearch}`);
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
