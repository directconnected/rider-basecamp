
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const ITEMS_PER_PAGE = 15;

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]); // Clear previous results
    setCurrentPage(1); // Reset to first page on new search
    
    try {
      if (!searchParams.state.trim() && !searchParams.city.trim() && !searchParams.zipCode.trim()) {
        toast.error('Please enter at least one search criteria');
        return;
      }

      let query = supabase
        .from('campsites')
        .select('*', { count: 'exact' });

      // Add filters based on provided search params
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

  const handlePageChange = async (page: number) => {
    setIsSearching(true);
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;
      
      let query = supabase
        .from('campsites')
        .select('*');

      // Add filters based on provided search params
      if (searchParams.state.trim()) {
        query = query.ilike('state', `%${searchParams.state.trim().toUpperCase()}%`);
      }
      if (searchParams.city.trim()) {
        query = query.ilike('town', `%${searchParams.city.trim()}%`);
      }
      if (searchParams.zipCode.trim()) {
        query = query.eq('nforg', parseInt(searchParams.zipCode.trim()));
      }

      const { data: searchData, error: searchError } = await query
        .range(start, end);

      if (searchError) throw searchError;
      
      if (searchData) {
        setSearchResults(searchData);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      toast.error('Failed to fetch results. Please try again.');
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
    currentPage,
    totalPages: Math.ceil(totalResults / ITEMS_PER_PAGE),
    handlePageChange,
  };
};
