
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
      
      // For debugging - show auth status
      const { data: authData } = await supabase.auth.getSession();
      console.log('Auth session:', authData?.session ? 'Authenticated' : 'Anonymous');
      
      // Build the query with proper filters
      let query = supabase.from('campgrounds').select('*');
      
      // Add state filter if provided - use exact match with eq()
      if (searchParams.state && searchParams.state.trim()) {
        // Use exact match for state codes (case insensitive handled by Supabase)
        query = query.eq('state', searchParams.state.trim().toUpperCase());
        console.log(`Searching for state: "${searchParams.state.trim().toUpperCase()}"`);
      }
      
      // Add city filter if provided
      if (searchParams.city && searchParams.city.trim()) {
        query = query.ilike('city', `%${searchParams.city.trim()}%`);
      }
      
      // Add zip code filter if provided
      if (searchParams.zipCode && searchParams.zipCode.trim()) {
        query = query.eq('zip_code', searchParams.zipCode.trim());
      }
      
      // Execute the query
      console.log('Executing Supabase query...');
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error searching campgrounds:', error);
        toast.error(`Error searching for campgrounds: ${error.message}`);
        setSearchResults([]);
      } else if (data) {
        console.log('Search results:', data);
        console.log('Total campgrounds found:', data.length);
        
        if (data.length > 0) {
          setSearchResults(data);
          toast.success(`Found ${data.length} campgrounds`);
        } else {
          console.log('Query executed with no results:', 
            `State: "${searchParams.state}" | City: "${searchParams.city}" | Zip: "${searchParams.zipCode}"`);
          
          // If no results with exact state match, try a more flexible search
          if (searchParams.state && searchParams.state.trim()) {
            console.log('Trying flexible state search...');
            
            // Try a pattern match instead of exact match
            const { data: flexData, error: flexError } = await supabase
              .from('campgrounds')
              .select('*')
              .ilike('state', `%${searchParams.state.trim()}%`);
            
            if (!flexError && flexData && flexData.length > 0) {
              console.log('Found results with flexible state search:', flexData.length);
              setSearchResults(flexData);
              toast.success(`Found ${flexData.length} campgrounds with similar state`);
              setIsSearching(false);
              return;
            }
          }
          
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
