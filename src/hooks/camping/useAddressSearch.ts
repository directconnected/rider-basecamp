
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
  
  // Function to handle search based on address
  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1);

    try {
      // Check if any search params are provided
      if (!searchParams.city && !searchParams.state && !searchParams.zipCode) {
        toast.error('Please enter a city, state, or zip code to search');
        setIsSearching(false);
        return;
      }

      // Construct dynamic query based on search parameters
      let query = supabase
        .from('campgrounds')
        .select('*');

      // Add filters based on provided parameters
      if (searchParams.city) {
        query = query.ilike('city', `%${searchParams.city}%`);
      }
      
      if (searchParams.state) {
        query = query.ilike('state', `%${searchParams.state}%`);
      }
      
      if (searchParams.zipCode) {
        query = query.ilike('zip_code', `%${searchParams.zipCode}%`);
      }

      // Execute the query
      const { data, error } = await query;

      if (error) {
        console.error('Database query error:', error);
        toast.error('Error retrieving campground data');
        setSearchResults([]);
      } else if (data && data.length > 0) {
        console.log(`Found ${data.length} campgrounds matching the search criteria`);
        setSearchResults(data);
        toast.success(`Found ${data.length} campgrounds`);
      } else {
        console.log('No campgrounds found matching the search criteria');
        setSearchResults([]);
        toast.info('No campgrounds found matching your search criteria');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('An unexpected error occurred during search.');
    } finally {
      setIsSearching(false);
    }
  };

  return { handleSearch };
};
