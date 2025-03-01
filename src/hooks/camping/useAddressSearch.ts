
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
      
      // Add state filter if provided
      if (searchParams.state && searchParams.state.trim()) {
        query = query.eq('state', searchParams.state.trim());
      }
      
      // Add zip code filter if provided
      if (searchParams.zipCode && searchParams.zipCode.trim()) {
        query = query.eq('zip_code', searchParams.zipCode.trim());
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error searching campgrounds:', error);
        toast.error('Error searching for campgrounds');
        setSearchResults([]);
      } else if (data) {
        console.log('Search results:', data);
        
        if (data.length > 0) {
          setSearchResults(data);
          toast.success(`Found ${data.length} campgrounds`);
        } else {
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
