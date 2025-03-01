
import { toast } from 'sonner';
import { CampgroundResult } from '@/hooks/camping/types';
import { supabase } from '@/integrations/supabase/client';

type AddressSearchParams = {
  searchParams: {
    city: string;
    state: string;
    zipCode: string;
    radius: number;
  };
  setSearchResults: (results: CampgroundResult[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  setCurrentPage: (page: number) => void;
};

export const useAddressSearch = ({
  searchParams,
  setSearchResults,
  setIsSearching,
  setCurrentPage,
}: AddressSearchParams) => {
  
  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1);

    try {
      // Check if any search parameters are provided
      if (!searchParams.city && !searchParams.state && !searchParams.zipCode) {
        toast.error('Please enter a city, state, or zip code to search');
        setIsSearching(false);
        return;
      }

      console.log('Search parameters:', searchParams);
      
      // Build the base query
      let query = supabase.from('campgrounds').select('*');
      
      // Add city filter if provided
      if (searchParams.city && searchParams.city.trim()) {
        query = query.ilike('city', `%${searchParams.city.trim()}%`);
      }
      
      // Add state filter if provided - ensure proper handling of abbreviations
      if (searchParams.state && searchParams.state.trim()) {
        // Use exact match for state codes (like 'OH')
        query = query.ilike('state', searchParams.state.trim());
      }
      
      // Add zip code filter if provided
      if (searchParams.zipCode && searchParams.zipCode.trim()) {
        query = query.eq('zip_code', searchParams.zipCode.trim());
      }
      
      // Execute the query with detailed logging
      console.log('Executing Supabase query:', query);
      const { data, error, status, statusText } = await query;
      
      if (error) {
        console.error('Error searching campgrounds:', error);
        console.error('Status:', status, statusText);
        
        // Check if it's a permissions error
        if (status === 403 || error.message.includes('permission')) {
          toast.error('Permission denied. You may not have access to this data.');
        } else {
          toast.error(`Error searching for campgrounds: ${error.message}`);
        }
        setSearchResults([]);
      } else if (data) {
        console.log('Search results:', data);
        console.log('Total campgrounds found:', data.length);
        
        if (data.length > 0) {
          setSearchResults(data);
          toast.success(`Found ${data.length} campgrounds`);
        } else {
          // Log the exact query that was executed
          console.log('Query executed with no results:', 
            `State: "${searchParams.state}" | City: "${searchParams.city}" | Zip: "${searchParams.zipCode}"`);
          setSearchResults([]);
          toast.info('No campgrounds found matching your search criteria');
        }
      }
    } catch (error) {
      console.error('Unexpected error during search:', error);
      toast.error('An unexpected error occurred');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return { handleSearch };
};
