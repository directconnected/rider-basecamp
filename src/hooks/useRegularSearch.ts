
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Campsite = Database['public']['Tables']['campsites']['Row'];
type SearchParams = {
  state: string;
  city: string;
  zipCode: string;
  radius?: number;
};

export const useRegularSearch = (
  searchParams: SearchParams,
  setSearchResults: (results: Campsite[]) => void,
  setTotalResults: (total: number) => void,
  setCurrentPage: (page: number) => void,
  ITEMS_PER_PAGE: number
) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1);
    
    try {
      if (!searchParams.state.trim() && !searchParams.city.trim() && !searchParams.zipCode.trim()) {
        toast.error('Please enter at least one search criteria');
        return;
      }

      let query = supabase
        .from('campsites')
        .select('*', { count: 'exact' });

      if (searchParams.state.trim()) {
        query = query.ilike('state', `%${searchParams.state.trim().toUpperCase()}%`);
      }
      if (searchParams.city.trim()) {
        query = query.ilike('town', `%${searchParams.city.trim()}%`);
      }
      if (searchParams.zipCode.trim()) {
        query = query.eq('nforg', parseInt(searchParams.zipCode.trim()));
      }

      const { data: searchData, error: searchError, count } = await query
        .range(0, ITEMS_PER_PAGE - 1);

      if (searchError) {
        console.error('Search error:', searchError);
        throw searchError;
      }
      
      if (searchData && searchData.length > 0) {
        setSearchResults(searchData);
        setTotalResults(count || 0);
        toast.success(`Found ${count} campsites`);
      } else {
        toast.info('No campsites found matching your criteria');
      }

    } catch (error) {
      console.error('Error in handleSearch:', error);
      toast.error('Failed to search campsites. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return { handleSearch, isSearching };
};
