
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

      // Try a more flexible search approach using textSearch
      const { data, error } = await supabase
        .from('campsites')
        .select('*')
        .textSearch('state', searchParams.state.trim(), {
          config: 'english',
          type: 'plain'
        });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Search results:', data);
      
      if (data && data.length > 0) {
        setSearchResults(data);
        toast.success(`Found ${data.length} campsites`);
      } else {
        // If no results with textSearch, try a direct comparison
        const { data: directData, error: directError } = await supabase
          .from('campsites')
          .select('*')
          .eq('state', searchParams.state.trim().toUpperCase());

        if (directError) {
          console.error('Direct search error:', directError);
          throw directError;
        }

        console.log('Direct search results:', directData);

        if (directData && directData.length > 0) {
          setSearchResults(directData);
          toast.success(`Found ${directData.length} campsites`);
        } else {
          toast.info(`No campsites found in ${searchParams.state.trim()}`);
        }
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
