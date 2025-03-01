
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
      console.log('Search parameters:', searchParams);

      // Apply specific search strategies based on which parameters are provided
      if (searchParams.state && (!searchParams.city && !searchParams.zipCode)) {
        // State-only search with multiple strategies
        await handleStateOnlySearch(searchParams.state);
      } else {
        // Combined search with multiple parameters
        await handleCombinedSearch();
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('An unexpected error occurred during search.');
      setIsSearching(false);
    }
  };

  // Handle state-only search with multiple strategies
  const handleStateOnlySearch = async (stateInput: string) => {
    // 1. Normalize state input (trim and uppercase for state code)
    const normalizedState = stateInput.trim().toUpperCase();
    console.log('Searching for state:', normalizedState);
    
    // Log database connection state
    console.log('Supabase client initialized:', supabase ? 'Yes' : 'No');
    
    // 2. Try direct equality match with state code (most specific)
    const { data: exactMatchData, error: exactMatchError } = await supabase
      .from('campgrounds')
      .select('*')
      .eq('state', normalizedState);
    
    if (exactMatchError) {
      console.error('Database error during exact match query:', exactMatchError);
      toast.error('Error querying database');
      setIsSearching(false);
      return;
    }
    
    console.log('Exact match query results:', exactMatchData);
    
    if (exactMatchData && exactMatchData.length > 0) {
      console.log(`Found ${exactMatchData.length} campgrounds with exact state match`);
      setSearchResults(exactMatchData);
      toast.success(`Found ${exactMatchData.length} campgrounds`);
      setIsSearching(false);
      return;
    }
    
    console.log('No exact state matches found, trying case-insensitive match');
    
    // 3. Try case-insensitive match on the state field
    const { data: caseInsensitiveData, error: caseInsensitiveError } = await supabase
      .from('campgrounds')
      .select('*')
      .ilike('state', normalizedState);
    
    if (caseInsensitiveError) {
      console.error('Database error during case-insensitive query:', caseInsensitiveError);
    } else {
      console.log('Case-insensitive query results:', caseInsensitiveData);
    }
    
    if (!caseInsensitiveError && caseInsensitiveData && caseInsensitiveData.length > 0) {
      console.log(`Found ${caseInsensitiveData.length} campgrounds with case-insensitive match`);
      setSearchResults(caseInsensitiveData);
      toast.success(`Found ${caseInsensitiveData.length} campgrounds`);
      setIsSearching(false);
      return;
    }
    
    console.log('No case-insensitive matches, trying partial match');
    
    // 4. Try partial match (state code might be part of a longer field)
    const { data: partialMatchData, error: partialMatchError } = await supabase
      .from('campgrounds')
      .select('*')
      .ilike('state', `%${normalizedState}%`);
    
    if (partialMatchError) {
      console.error('Database error during partial match query:', partialMatchError);
    } else {
      console.log('Partial match query results:', partialMatchData);
    }
    
    if (!partialMatchError && partialMatchData && partialMatchData.length > 0) {
      console.log(`Found ${partialMatchData.length} campgrounds with partial state match`);
      setSearchResults(partialMatchData);
      toast.success(`Found ${partialMatchData.length} campgrounds`);
      setIsSearching(false);
      return;
    }
    
    console.log('No partial matches, trying full state name variations');
    
    // 5. Try full state name variations as a last resort
    const stateMap: Record<string, string[]> = {
      'AL': ['alabama'],
      'AK': ['alaska'],
      'AZ': ['arizona'],
      'AR': ['arkansas'],
      'CA': ['california'],
      'CO': ['colorado'],
      'CT': ['connecticut'],
      'DE': ['delaware'],
      'FL': ['florida'],
      'GA': ['georgia'],
      'HI': ['hawaii'],
      'ID': ['idaho'],
      'IL': ['illinois'],
      'IN': ['indiana'],
      'IA': ['iowa'],
      'KS': ['kansas'],
      'KY': ['kentucky'],
      'LA': ['louisiana'],
      'ME': ['maine'],
      'MD': ['maryland'],
      'MA': ['massachusetts'],
      'MI': ['michigan'],
      'MN': ['minnesota'],
      'MS': ['mississippi'],
      'MO': ['missouri'],
      'MT': ['montana'],
      'NE': ['nebraska'],
      'NV': ['nevada'],
      'NH': ['new hampshire'],
      'NJ': ['new jersey'],
      'NM': ['new mexico'],
      'NY': ['new york'],
      'NC': ['north carolina'],
      'ND': ['north dakota'],
      'OH': ['ohio'],
      'OK': ['oklahoma'],
      'OR': ['oregon'],
      'PA': ['pennsylvania'],
      'RI': ['rhode island'],
      'SC': ['south carolina'],
      'SD': ['south dakota'],
      'TN': ['tennessee'],
      'TX': ['texas'],
      'UT': ['utah'],
      'VT': ['vermont'],
      'VA': ['virginia'],
      'WA': ['washington'],
      'WV': ['west virginia'],
      'WI': ['wisconsin'],
      'WY': ['wyoming'],
    };
    
    const stateVariations = stateMap[normalizedState] || [];
    
    if (stateVariations.length > 0) {
      console.log('Trying full state name variations:', stateVariations);
      
      // Try each state name variation individually to find a match
      for (const variation of stateVariations) {
        // Try exact match with full state name
        const { data: fullNameExactData, error: fullNameExactError } = await supabase
          .from('campgrounds')
          .select('*')
          .eq('state', variation);
        
        if (fullNameExactError) {
          console.error(`Database error during full name (${variation}) exact match:`, fullNameExactError);
        } else {
          console.log(`Full name (${variation}) exact match results:`, fullNameExactData);
        }
        
        if (!fullNameExactError && fullNameExactData && fullNameExactData.length > 0) {
          console.log(`Found ${fullNameExactData.length} campgrounds with full state name exact match`);
          setSearchResults(fullNameExactData);
          toast.success(`Found ${fullNameExactData.length} campgrounds`);
          setIsSearching(false);
          return;
        }
        
        // Try case-insensitive match with full state name
        const { data: fullNameCaseInsensitiveData, error: fullNameCaseInsensitiveError } = await supabase
          .from('campgrounds')
          .select('*')
          .ilike('state', variation);
        
        if (fullNameCaseInsensitiveError) {
          console.error(`Database error during full name (${variation}) case-insensitive match:`, fullNameCaseInsensitiveError);
        } else {
          console.log(`Full name (${variation}) case-insensitive results:`, fullNameCaseInsensitiveData);
        }
        
        if (!fullNameCaseInsensitiveError && fullNameCaseInsensitiveData && fullNameCaseInsensitiveData.length > 0) {
          console.log(`Found ${fullNameCaseInsensitiveData.length} campgrounds with full state name case-insensitive match`);
          setSearchResults(fullNameCaseInsensitiveData);
          toast.success(`Found ${fullNameCaseInsensitiveData.length} campgrounds`);
          setIsSearching(false);
          return;
        }
        
        // Try partial match with full state name
        const { data: fullNamePartialData, error: fullNamePartialError } = await supabase
          .from('campgrounds')
          .select('*')
          .ilike('state', `%${variation}%`);
        
        if (fullNamePartialError) {
          console.error(`Database error during full name (${variation}) partial match:`, fullNamePartialError);
        } else {
          console.log(`Full name (${variation}) partial match results:`, fullNamePartialData);
        }
        
        if (!fullNamePartialError && fullNamePartialData && fullNamePartialData.length > 0) {
          console.log(`Found ${fullNamePartialData.length} campgrounds with full state name partial match`);
          setSearchResults(fullNamePartialData);
          toast.success(`Found ${fullNamePartialData.length} campgrounds`);
          setIsSearching(false);
          return;
        }
      }
    }
    
    // As a fallback, let's try to get ANY campgrounds to see if the table has data
    console.log('No state matches found. Checking if campgrounds table has any data...');
    
    const { data: allCampgrounds, error: allCampgroundsError } = await supabase
      .from('campgrounds')
      .select('*')
      .limit(5);
    
    if (allCampgroundsError) {
      console.error('Error checking for any campgrounds:', allCampgroundsError);
    } else {
      console.log('Sample of available campgrounds in database:', allCampgrounds);
      if (allCampgrounds && allCampgrounds.length === 0) {
        console.log('The campgrounds table appears to be empty!');
        toast.info('No campground data is available in the database');
      }
    }
    
    // If we got this far, no results were found
    setSearchResults([]);
    toast.info('No campgrounds found matching your search criteria');
    setIsSearching(false);
  };

  // Handle combined search with city, state, and/or zip code
  const handleCombinedSearch = async () => {
    let query = supabase.from('campgrounds').select('*');
    
    // Apply city filter if provided
    if (searchParams.city) {
      query = query.ilike('city', `%${searchParams.city}%`);
    }
    
    // Apply state filter if provided
    if (searchParams.state) {
      const normalizedState = searchParams.state.trim().toUpperCase();
      
      // Try state code first, then full name (Pennsylvania for PA)
      const stateMap: Record<string, string[]> = {
        'AL': ['alabama'],
        'AK': ['alaska'],
        'AZ': ['arizona'],
        'AR': ['arkansas'],
        'CA': ['california'],
        'CO': ['colorado'],
        'CT': ['connecticut'],
        'DE': ['delaware'],
        'FL': ['florida'],
        'GA': ['georgia'],
        'HI': ['hawaii'],
        'ID': ['idaho'],
        'IL': ['illinois'],
        'IN': ['indiana'],
        'IA': ['iowa'],
        'KS': ['kansas'],
        'KY': ['kentucky'],
        'LA': ['louisiana'],
        'ME': ['maine'],
        'MD': ['maryland'],
        'MA': ['massachusetts'],
        'MI': ['michigan'],
        'MN': ['minnesota'],
        'MS': ['mississippi'],
        'MO': ['missouri'],
        'MT': ['montana'],
        'NE': ['nebraska'],
        'NV': ['nevada'],
        'NH': ['new hampshire'],
        'NJ': ['new jersey'],
        'NM': ['new mexico'],
        'NY': ['new york'],
        'NC': ['north carolina'],
        'ND': ['north dakota'],
        'OH': ['ohio'],
        'OK': ['oklahoma'],
        'OR': ['oregon'],
        'PA': ['pennsylvania'],
        'RI': ['rhode island'],
        'SC': ['south carolina'],
        'SD': ['south dakota'],
        'TN': ['tennessee'],
        'TX': ['texas'],
        'UT': ['utah'],
        'VT': ['vermont'],
        'VA': ['virginia'],
        'WA': ['washington'],
        'WV': ['west virginia'],
        'WI': ['wisconsin'],
        'WY': ['wyoming'],
      };
      
      const stateVariations = [normalizedState, ...(stateMap[normalizedState] || [])];
      
      console.log('Executing combined search with state variations:', stateVariations);
      
      // Build OR query for all state variations
      const orConditions = stateVariations.map(state => 
        `state.ilike.%${state}%`
      );
      
      if (orConditions.length > 0) {
        query = query.or(orConditions.join(','));
      }
    }
    
    // Apply zip code filter if provided
    if (searchParams.zipCode) {
      query = query.ilike('zip_code', `%${searchParams.zipCode}%`);
    }
    
    // Execute the query
    console.log('Executing combined search query');
    const { data, error } = await query;
    
    if (error) {
      console.error('Database query error:', error);
      toast.error('Error retrieving campground data');
      setSearchResults([]);
    } else {
      console.log('Combined search query results:', data);
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} campgrounds matching the search criteria`);
        setSearchResults(data);
        toast.success(`Found ${data.length} campgrounds`);
      } else {
        // As a fallback, check if the table has any data
        const { data: sampleData, error: sampleError } = await supabase
          .from('campgrounds')
          .select('*')
          .limit(5);
        
        if (sampleError) {
          console.error('Error checking for campground data:', sampleError);
        } else {
          console.log('Sample of available campgrounds:', sampleData);
          if (sampleData && sampleData.length === 0) {
            console.log('The campgrounds table appears to be empty!');
            toast.info('No campground data is available in the database');
          }
        }
        
        setSearchResults([]);
        toast.info('No campgrounds found matching your search criteria');
      }
    }
    
    setIsSearching(false);
  };

  return { handleSearch };
};
