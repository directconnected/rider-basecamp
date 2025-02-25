
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

      // First, let's get a sample of the data to see what we're working with
      const { data: sampleData } = await supabase
        .from('campsites')
        .select('state')
        .limit(5);
      
      console.log('Sample data states:', sampleData?.map(d => d.state));

      // Try search with the state code as is
      let { data, error } = await supabase
        .from('campsites')
        .select()
        .ilike('state', searchParams.state.trim());

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      // If no results, try with uppercase
      if (!data?.length) {
        const upperState = searchParams.state.trim().toUpperCase();
        console.log('Trying uppercase state:', upperState);
        
        ({ data, error } = await supabase
          .from('campsites')
          .select()
          .ilike('state', upperState));

        if (error) {
          console.error('Uppercase search error:', error);
          throw error;
        }
      }

      console.log('Final search results:', data);
      
      if (data && data.length > 0) {
        setSearchResults(data);
        toast.success(`Found ${data.length} campsites`);
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
