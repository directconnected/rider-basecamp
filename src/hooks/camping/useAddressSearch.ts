
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
      
      // First, let's do a quick test query to check if we can retrieve any data from the campgrounds table
      const testQuery = await supabase
        .from('campgrounds')
        .select('*')
        .limit(5);
      
      if (testQuery.error) {
        console.error('Error in test query:', testQuery.error);
        toast.error('Error connecting to database');
        setIsSearching(false);
        return;
      }
      
      console.log('Test query results:', testQuery.data);
      console.log('Total records available:', testQuery.data.length);
      
      // Build the base query
      let query = supabase.from('campgrounds').select('*');
      
      // Add city filter if provided
      if (searchParams.city && searchParams.city.trim()) {
        query = query.ilike('city', `%${searchParams.city.trim()}%`);
      }
      
      // Add state filter if provided
      if (searchParams.state && searchParams.state.trim()) {
        const state = searchParams.state.trim();
        query = query.ilike('state', `%${state}%`);
      }
      
      // Add zip code filter if provided
      if (searchParams.zipCode && searchParams.zipCode.trim()) {
        query = query.ilike('zip_code', `%${searchParams.zipCode.trim()}%`);
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error searching campgrounds:', error);
        toast.error('Error searching for campgrounds');
        setSearchResults([]);
      } else {
        console.log('Search results:', data);
        
        if (data && data.length > 0) {
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
