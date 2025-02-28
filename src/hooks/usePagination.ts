
import { useState } from 'react';
import { toast } from "sonner";
import { CampgroundResult } from './useCampsiteSearch';
import { findNearbyCampgrounds } from '@/services/placesService';

type SearchParams = {
  state: string;
  city: string;
  zipCode: string;
  radius?: number;
};

export const usePagination = (
  searchParams: SearchParams,
  setSearchResults: (results: CampgroundResult[]) => void,
  ITEMS_PER_PAGE: number
) => {
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [allResults, setAllResults] = useState<CampgroundResult[]>([]);

  const handlePageChange = async (page: number) => {
    setIsSearching(true);
    try {
      if (allResults.length === 0) {
        // Initial search hasn't been done yet
        toast.error('Please perform a search first');
        setIsSearching(false);
        return;
      }
      
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = Math.min(start + ITEMS_PER_PAGE, allResults.length);
      
      const pagedResults = allResults.slice(start, end);
      setSearchResults(pagedResults);
      setCurrentPage(page);
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
    setAllResults,
    totalPages: Math.ceil(totalResults / ITEMS_PER_PAGE),
    handlePageChange,
    isSearching
  };
};
