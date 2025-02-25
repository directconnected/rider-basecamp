
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

export const usePagination = (
  searchParams: SearchParams,
  setSearchResults: (results: Campsite[]) => void,
  ITEMS_PER_PAGE: number
) => {
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const handlePageChange = async (page: number) => {
    setIsSearching(true);
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;
      
      let query = supabase
        .from('campsites')
        .select('*');

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
    currentPage,
    setCurrentPage,
    totalResults,
    setTotalResults,
    totalPages: Math.ceil(totalResults / ITEMS_PER_PAGE),
    handlePageChange,
    isSearching
  };
};
