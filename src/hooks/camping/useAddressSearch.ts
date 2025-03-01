
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

      // Construct initial query
      let query = supabase
        .from('campgrounds')
        .select('*');

      // Apply city filter if provided
      if (searchParams.city) {
        query = query.ilike('city', `%${searchParams.city}%`);
      }
      
      // Apply state filter if provided - with special handling
      if (searchParams.state) {
        // Normalize state input (trim and uppercase)
        const normalizedState = searchParams.state.trim().toUpperCase();
        console.log('Searching for state:', normalizedState);
        
        // Try different approaches to match state - this is more flexible
        // First, let's try an exact match
        const { data: exactMatchData, error: exactMatchError } = await supabase
          .from('campgrounds')
          .select('*')
          .eq('state', normalizedState);
          
        // If exact match works, use those results
        if (!exactMatchError && exactMatchData && exactMatchData.length > 0) {
          console.log(`Found ${exactMatchData.length} campgrounds with exact state match`);
          setSearchResults(exactMatchData);
          toast.success(`Found ${exactMatchData.length} campgrounds`);
          setIsSearching(false);
          return;
        }
        
        console.log('No exact state matches found, trying alternatives');
        
        // If no exact match, let's try contains (for cases where state might be stored as "Pennsylvania" instead of "PA")
        query = query.or(`state.ilike.%${normalizedState}%`);
      }
      
      // Apply zip code filter if provided
      if (searchParams.zipCode) {
        query = query.ilike('zip_code', `%${searchParams.zipCode}%`);
      }

      // Execute the query
      console.log('Executing query with filters:', query);
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
        console.log('No campgrounds found with initial search, trying one last approach');
        
        // Last resort: try a very flexible search with full state name variations
        if (searchParams.state && !searchParams.city && !searchParams.zipCode) {
          const stateInput = searchParams.state.trim();
          
          // Map of state abbreviations to full names for common states
          const stateMap: Record<string, string[]> = {
            'PA': ['pennsylvania'],
            'NY': ['new york'],
            'CA': ['california'],
            'TX': ['texas'],
            'FL': ['florida'],
            // Add more as needed
          };
          
          const stateVariations = stateMap[stateInput.toUpperCase()] || [];
          
          if (stateVariations.length > 0) {
            console.log('Trying state name variations:', stateVariations);
            
            let finalQuery = supabase.from('campgrounds').select('*');
            
            // Build OR query for each variation
            for (const variation of stateVariations) {
              finalQuery = finalQuery.or(`state.ilike.%${variation}%`);
            }
            
            const { data: finalData, error: finalError } = await finalQuery;
            
            if (!finalError && finalData && finalData.length > 0) {
              console.log(`Found ${finalData.length} campgrounds with state name variations`);
              setSearchResults(finalData);
              toast.success(`Found ${finalData.length} campgrounds`);
              setIsSearching(false);
              return;
            }
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
