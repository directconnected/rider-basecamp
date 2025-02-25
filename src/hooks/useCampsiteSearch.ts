
import { useState } from 'react';
import { useCampsiteSearchStore } from "@/stores/campsiteSearchStore";
import { Database } from "@/integrations/supabase/types";
import { useLocationSearch } from './useLocationSearch';
import { useRegularSearch } from './useRegularSearch';
import { usePagination } from './usePagination';

type Campsite = Database['public']['Tables']['campsites']['Row'];

export const useCampsiteSearch = () => {
  const { searchParams, setSearchParams } = useCampsiteSearchStore();
  const [searchResults, setSearchResults] = useState<Campsite[]>([]);
  const ITEMS_PER_PAGE = 12;

  const {
    currentPage,
    totalPages,
    handlePageChange,
    setCurrentPage,
    setTotalResults
  } = usePagination(searchParams, setSearchResults, ITEMS_PER_PAGE);

  const { handleSearch, isSearching: isRegularSearching } = useRegularSearch(
    searchParams,
    setSearchResults,
    setTotalResults,
    setCurrentPage,
    ITEMS_PER_PAGE
  );

  const { handleLocationSearch, isSearching: isLocationSearching } = useLocationSearch(
    searchParams,
    setSearchResults,
    setTotalResults,
    ITEMS_PER_PAGE
  );

  const isSearching = isRegularSearching || isLocationSearching;

  return {
    searchParams,
    setSearchParams,
    searchResults,
    isSearching,
    handleSearch,
    handleLocationSearch,
    currentPage,
    totalPages,
    handlePageChange,
  };
};
