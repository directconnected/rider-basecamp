
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
    
    // First, try a simple test query to see if we can get ANY data from the table
    // This helps us confirm if we have database connectivity and permissions
    console.log('Performing test query to check database access...');
    const { data: testData, error: testError } = await supabase
      .from('campgrounds')
      .select('*')
      .limit(5);
    
    if (testError) {
      console.error('Database access error during test query:', testError);
      toast.error('Error accessing the campgrounds database');
      setIsSearching(false);
      return;
    }
    
    console.log('Test query results:', testData);
    console.log(`Found ${testData?.length || 0} records in test query`);
    
    if (!testData || testData.length === 0) {
      console.log('No data returned from test query. Database might be empty or connection issue.');
      toast.info('No campground data is available in the database');
      setIsSearching(false);
      return;
    }
    
    // If we get here, we know we can access the database and it has data
    // Now try the specific state search
    
    // Primary search approach - try multiple strategies in one query using OR
    const { data: stateData, error: stateError } = await supabase
      .from('campgrounds')
      .select('*')
      .or(`state.eq.${normalizedState},state.ilike.${normalizedState},state.ilike.%${normalizedState}%`);
    
    if (stateError) {
      console.error('Database error during state search:', stateError);
      toast.error('Error querying database');
      setIsSearching(false);
      return;
    }
    
    console.log('State search results:', stateData);
    
    if (stateData && stateData.length > 0) {
      console.log(`Found ${stateData.length} campgrounds matching state: ${normalizedState}`);
      setSearchResults(stateData);
      toast.success(`Found ${stateData.length} campgrounds`);
      setIsSearching(false);
      return;
    }
    
    // If no matches with state code, try with full state name
    console.log('No matches with state code, trying full state name');
    
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
    
    const stateNames = stateMap[normalizedState] || [];
    
    if (stateNames.length > 0) {
      console.log('Trying full state names:', stateNames);
      
      // Create an OR query for all variations of the state name
      let orConditions = stateNames.map(name => `state.ilike.%${name}%`).join(',');
      
      const { data: fullNameData, error: fullNameError } = await supabase
        .from('campgrounds')
        .select('*')
        .or(orConditions);
      
      if (fullNameError) {
        console.error('Database error during full name search:', fullNameError);
      } else {
        console.log('Full state name search results:', fullNameData);
        
        if (fullNameData && fullNameData.length > 0) {
          console.log(`Found ${fullNameData.length} campgrounds with full state name`);
          setSearchResults(fullNameData);
          toast.success(`Found ${fullNameData.length} campgrounds`);
          setIsSearching(false);
          return;
        }
      }
    }
    
    // Last resort - just check what column values actually exist in the state field
    const { data: distinctStates, error: distinctError } = await supabase
      .from('campgrounds')
      .select('state')
      .is('state', null, { not: true })
      .limit(100);
      
    if (distinctError) {
      console.error('Error checking distinct states:', distinctError);
    } else {
      console.log('Available state values in database:', distinctStates);
      const availableStates = distinctStates.map(item => item.state).filter(Boolean);
      console.log('Unique state values:', [...new Set(availableStates)]);
    }
    
    // If we got this far, no results were found
    toast.info(`No campgrounds found matching "${normalizedState}"`);
    setSearchResults([]);
    setIsSearching(false);
  };

  // Handle combined search with city, state, and/or zip code
  const handleCombinedSearch = async () => {
    // First, try a simple test query to see if we can get ANY data from the table
    console.log('Performing test query to check database access...');
    const { data: testData, error: testError } = await supabase
      .from('campgrounds')
      .select('*')
      .limit(5);
    
    if (testError) {
      console.error('Database access error during test query:', testError);
      toast.error('Error accessing the campgrounds database');
      setIsSearching(false);
      return;
    }
    
    console.log('Test query results:', testData);
    console.log(`Found ${testData?.length || 0} records in test query`);
    
    if (!testData || testData.length === 0) {
      console.log('No data returned from test query. Database might be empty or connection issue.');
      toast.info('No campground data is available in the database');
      setIsSearching(false);
      return;
    }
    
    let query = supabase.from('campgrounds').select('*');
    
    // Apply city filter if provided
    if (searchParams.city) {
      query = query.ilike('city', `%${searchParams.city.trim()}%`);
    }
    
    // Apply state filter if provided
    if (searchParams.state) {
      const normalizedState = searchParams.state.trim().toUpperCase();
      query = query.or(`state.eq.${normalizedState},state.ilike.${normalizedState},state.ilike.%${normalizedState}%`);
    }
    
    // Apply zip code filter if provided
    if (searchParams.zipCode) {
      query = query.ilike('zip_code', `%${searchParams.zipCode.trim()}%`);
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
        toast.info('No campgrounds found matching your search criteria');
        setSearchResults([]);
      }
    }
    
    setIsSearching(false);
  };

  return { handleSearch };
};
