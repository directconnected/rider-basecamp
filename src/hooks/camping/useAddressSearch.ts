
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

      // Log the search parameters for debugging
      console.log('Search parameters:', {
        city: searchParams.city,
        state: searchParams.state,
        zipCode: searchParams.zipCode,
      });

      // Construct dynamic query based on search parameters
      let query = supabase
        .from('campgrounds')
        .select('*');

      // Add filters based on provided parameters
      if (searchParams.city) {
        query = query.ilike('city', `%${searchParams.city}%`);
      }
      
      if (searchParams.state) {
        // Normalize state input (trim whitespace and convert to uppercase)
        const normalizedState = searchParams.state.trim().toUpperCase();
        console.log('Searching for state:', normalizedState);
        
        // Use ilike for more flexibility in matching state codes
        query = query.ilike('state', normalizedState);
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
        console.log('Sample result:', data[0]);
        setSearchResults(data);
        toast.success(`Found ${data.length} campgrounds`);
      } else {
        console.log('No campgrounds found matching the search criteria');
        console.log('Query details:', query);
        
        // If no results with state search, try a more lenient search
        if (searchParams.state && !searchParams.city && !searchParams.zipCode) {
          const normalizedState = searchParams.state.trim().toUpperCase();
          console.log('Trying more lenient state search for:', normalizedState);
          
          // Try partial match search for state codes
          const lenientQuery = supabase
            .from('campgrounds')
            .select('*')
            .ilike('state', `%${normalizedState}%`);
            
          const { data: lenientData, error: lenientError } = await lenientQuery;
          
          if (!lenientError && lenientData && lenientData.length > 0) {
            console.log(`Found ${lenientData.length} campgrounds with lenient state search`);
            setSearchResults(lenientData);
            toast.success(`Found ${lenientData.length} campgrounds`);
            setIsSearching(false);
            return;
          }
        }
        
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
