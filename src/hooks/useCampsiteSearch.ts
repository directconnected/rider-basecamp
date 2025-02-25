
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

      // First, let's check what data exists in the database
      const { data: allData, error: countError } = await supabase
        .from('campsites')
        .select('state')
        .limit(10);

      if (countError) {
        console.error('Error checking database:', countError);
        throw countError;
      }

      console.log('Sample of states in database:', allData?.map(d => d.state));

      // Try searching with the exact state code
      const stateCode = searchParams.state.trim().toUpperCase();
      console.log('Searching for state code:', stateCode);

      const { data, error } = await supabase
        .from('campsites')
        .select('*')
        .or(`state.eq.${stateCode},state.eq.${searchParams.state.trim()}`);

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Search results:', data);
      
      if (data && data.length > 0) {
        setSearchResults(data);
        toast.success(`Found ${data.length} campsites`);
      } else {
        // Try one more time with ilike for case-insensitive match
        const { data: ilikeData, error: ilikeError } = await supabase
          .from('campsites')
          .select('*')
          .ilike('state', `%${stateCode}%`);

        if (ilikeError) {
          console.error('ILIKE search error:', ilikeError);
          throw ilikeError;
        }

        console.log('ILIKE search results:', ilikeData);

        if (ilikeData && ilikeData.length > 0) {
          setSearchResults(ilikeData);
          toast.success(`Found ${ilikeData.length} campsites`);
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
