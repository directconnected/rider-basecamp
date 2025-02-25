
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
  const ITEMS_PER_PAGE = 10;

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]); // Clear previous results
    setCurrentPage(1); // Reset to first page on new search
    
    try {
      if (!searchParams.state.trim()) {
        toast.error('Please enter a state');
        return;
      }

      const stateCode = searchParams.state.trim().toUpperCase();
      
      const { data: searchData, error: searchError, count } = await supabase
        .from('campsites')
        .select('*', { count: 'exact' })
        .ilike('state', `%${stateCode}%`)
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
        toast.info(`No campsites found in ${searchParams.state.trim()}`);
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
      
      const { data: searchData, error: searchError } = await supabase
        .from('campsites')
        .select('*')
        .ilike('state', `%${searchParams.state.trim().toUpperCase()}%`)
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
