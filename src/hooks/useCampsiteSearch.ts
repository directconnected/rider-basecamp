
import { useState, useEffect } from 'react';
import { useCampsiteSearchStore } from '@/stores/campsiteSearchStore';
import { toast } from 'sonner';
import { CampgroundResult, CampsiteSearchState } from '@/hooks/camping/types';
import { useLocationBasedSearch } from '@/hooks/camping/useLocationBasedSearch';
import { useAddressSearch } from '@/hooks/camping/useAddressSearch';

// This is now a simplified hook that combines the functionality of useLocationBasedSearch and useAddressSearch
const useCampsiteSearch = () => {
  const { searchParams, setSearchParams } = useCampsiteSearchStore();
  const [searchState, setSearchState] = useState<CampsiteSearchState>({
    searchResults: [],
    isSearching: false,
    currentPage: 1
  });

  const { searchResults, isSearching, currentPage } = searchState;

  // Initialize the location-based search hook
  const { handleLocationSearch } = useLocationBasedSearch({
    searchParams,
    setSearchResults: (results) => setSearchState(prev => ({ ...prev, searchResults: results })),
    setIsSearching: (isSearching) => setSearchState(prev => ({ ...prev, isSearching })),
    setCurrentPage: (page) => setSearchState(prev => ({ ...prev, currentPage: page }))
  });

  // Initialize the address-based search hook
  const { handleSearch: handleAddressSearch } = useAddressSearch({
    searchParams,
    setSearchResults: (results) => setSearchState(prev => ({ ...prev, searchResults: results })),
    setIsSearching: (isSearching) => setSearchState(prev => ({ ...prev, isSearching })),
    setCurrentPage: (page) => setSearchState(prev => ({ ...prev, currentPage: page }))
  });

  // Calculate total pages based on the number of search results
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);

  // Handle page changes for pagination
  const handlePageChange = (page: number) => {
    setSearchState(prev => ({ ...prev, currentPage: page }));
    // Scroll to top of results when changing pages
    window.scrollTo({
      top: document.getElementById('search-results')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };

  // Handle search based on address (city, state, zip code)
  const handleSearch = async () => {
    if (!searchParams.city && !searchParams.state && !searchParams.zipCode) {
      toast.error('Please enter a city, state, or zip code to search');
      return;
    }

    await handleAddressSearch();
  };

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

export default useCampsiteSearch;
