
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
    
    // Perform database connectivity test
    console.log('Performing test query to check database access...');
    const { data: testData, error: testError } = await supabase
      .from('campgrounds')
      .select('*')
      .limit(5);
    
    if (testError) {
      console.error('Database access error:', testError.message);
      toast.error('Error accessing the campgrounds database');
      setIsSearching(false);
      return;
    }
    
    console.log('Test query results:', testData);
    console.log(`Found ${testData?.length || 0} records in test query`);
    
    if (!testData || testData.length === 0) {
      // Check if the database table is empty by querying the count
      const { count, error: countError } = await supabase
        .from('campgrounds')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error checking table count:', countError.message);
      } else {
        console.log(`Total records in campgrounds table: ${count || 0}`);
      }
      
      console.log('No data returned from test query. Database might be empty or connection issue.');
      toast.info('No campground data is available in the database');
      setIsSearching(false);
      return;
    }
    
    // Try a direct state code match first (e.g., "PA")
    console.log('Trying direct state code match for:', normalizedState);
    const { data: directMatches, error: directError } = await supabase
      .from('campgrounds')
      .select('*')
      .eq('state', normalizedState);
    
    if (directError) {
      console.error('Error during direct state match:', directError.message);
    } else if (directMatches && directMatches.length > 0) {
      console.log(`Found ${directMatches.length} direct state matches for "${normalizedState}"`);
      setSearchResults(directMatches);
      toast.success(`Found ${directMatches.length} campgrounds`);
      setIsSearching(false);
      return;
    } else {
      console.log('No direct state matches found, trying partial match');
    }
    
    // Try a case-insensitive partial match (e.g., "pa" in "Pennsylvania")
    console.log('Trying case-insensitive partial match for:', normalizedState);
    const { data: partialMatches, error: partialError } = await supabase
      .from('campgrounds')
      .select('*')
      .ilike('state', `%${normalizedState}%`);
    
    if (partialError) {
      console.error('Error during partial state match:', partialError.message);
    } else {
      console.log('Partial match query results:', partialMatches);
      
      if (partialMatches && partialMatches.length > 0) {
        console.log(`Found ${partialMatches.length} partial state matches`);
        setSearchResults(partialMatches);
        toast.success(`Found ${partialMatches.length} campgrounds`);
        setIsSearching(false);
        return;
      } else {
        console.log('No partial matches, trying full state name variations');
      }
    }
    
    // Try with full state name variations
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
      console.log(`Trying full state name variations: ${JSON.stringify(stateNames)}`);
      
      // Try each state name variation
      for (const stateName of stateNames) {
        // Try exact match with full state name
        console.log(`Trying full name (${stateName}) exact match`);
        const { data: exactFullNameMatches, error: exactFullNameError } = await supabase
          .from('campgrounds')
          .select('*')
          .eq('state', stateName);
          
        if (exactFullNameError) {
          console.error(`Error during exact full name (${stateName}) search:`, exactFullNameError.message);
        } else {
          console.log(`Full name (${stateName}) exact match results:`, exactFullNameMatches);
          
          if (exactFullNameMatches && exactFullNameMatches.length > 0) {
            console.log(`Found ${exactFullNameMatches.length} exact full name matches`);
            setSearchResults(exactFullNameMatches);
            toast.success(`Found ${exactFullNameMatches.length} campgrounds`);
            setIsSearching(false);
            return;
          }
        }
        
        // Try case-insensitive match with full state name
        console.log(`Trying full name (${stateName}) case-insensitive match`);
        const { data: caseInsensitiveMatches, error: caseInsensitiveError } = await supabase
          .from('campgrounds')
          .select('*')
          .ilike('state', stateName);
          
        if (caseInsensitiveError) {
          console.error(`Error during case-insensitive full name (${stateName}) search:`, caseInsensitiveError.message);
        } else {
          console.log(`Full name (${stateName}) case-insensitive results:`, caseInsensitiveMatches);
          
          if (caseInsensitiveMatches && caseInsensitiveMatches.length > 0) {
            console.log(`Found ${caseInsensitiveMatches.length} case-insensitive full name matches`);
            setSearchResults(caseInsensitiveMatches);
            toast.success(`Found ${caseInsensitiveMatches.length} campgrounds`);
            setIsSearching(false);
            return;
          }
        }
        
        // Try partial match with full state name
        console.log(`Trying full name (${stateName}) partial match`);
        const { data: partialFullNameMatches, error: partialFullNameError } = await supabase
          .from('campgrounds')
          .select('*')
          .ilike('state', `%${stateName}%`);
          
        if (partialFullNameError) {
          console.error(`Error during partial full name (${stateName}) search:`, partialFullNameError.message);
        } else {
          console.log(`Full name (${stateName}) partial match results:`, partialFullNameMatches);
          
          if (partialFullNameMatches && partialFullNameMatches.length > 0) {
            console.log(`Found ${partialFullNameMatches.length} partial full name matches`);
            setSearchResults(partialFullNameMatches);
            toast.success(`Found ${partialFullNameMatches.length} campgrounds`);
            setIsSearching(false);
            return;
          }
        }
      }
    }
    
    // If we reach here, no matches found. Let's check the actual state values in the database
    console.log('No state matches found. Checking all available campgrounds...');
    
    // Query all campgrounds to see what data actually exists
    const { data: allCampgrounds, error: allCampgroundsError } = await supabase
      .from('campgrounds')
      .select('*')
      .limit(100);
      
    if (allCampgroundsError) {
      console.error('Error querying all campgrounds:', allCampgroundsError.message);
    } else {
      console.log('All available campgrounds in database:', allCampgrounds);
      
      if (allCampgrounds && allCampgrounds.length === 0) {
        console.log('The campgrounds table appears to be empty!');
        toast.info('No campgrounds found in database');
      } else {
        // Log the distinct state values
        const stateValues = allCampgrounds
          .map(c => c.state)
          .filter(Boolean)
          .map(s => `"${s}"`)
          .join(', ');
        
        console.log(`Available state values in database: ${stateValues || 'None'}`);
        
        toast.info(`No campgrounds found matching "${normalizedState}"`);
      }
    }
    
    setSearchResults([]);
    setIsSearching(false);
  };

  // Handle combined search with city, state, and/or zip code
  const handleCombinedSearch = async () => {
    // Perform database connectivity test first
    console.log('Performing test query to check database access...');
    const { data: testData, error: testError } = await supabase
      .from('campgrounds')
      .select('*')
      .limit(5);
    
    if (testError) {
      console.error('Database access error during test query:', testError.message);
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
    
    // Build the query step by step
    console.log('Building combined search query with parameters:', {
      city: searchParams.city,
      state: searchParams.state,
      zipCode: searchParams.zipCode
    });
    
    let query = supabase.from('campgrounds').select('*');
    
    // Apply city filter if provided
    if (searchParams.city && searchParams.city.trim()) {
      const city = searchParams.city.trim();
      console.log(`Adding city filter: "${city}"`);
      query = query.ilike('city', `%${city}%`);
    }
    
    // Apply state filter if provided
    if (searchParams.state && searchParams.state.trim()) {
      const state = searchParams.state.trim();
      const normalizedState = state.toUpperCase();
      console.log(`Adding state filter: "${normalizedState}"`);
      
      // Use separate queries for different state matching strategies
      const stateQueries = [];
      
      // Try exact match
      if (normalizedState.length === 2) {
        console.log('Adding exact state code match condition');
        stateQueries.push(`state.eq.${normalizedState}`);
      }
      
      // Add partial match
      console.log('Adding partial state match condition');
      stateQueries.push(`state.ilike.%${normalizedState}%`);
      
      // For two-letter state codes, also try the full state name
      if (normalizedState.length === 2) {
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
          for (const stateName of stateNames) {
            console.log(`Adding full state name condition for: ${stateName}`);
            stateQueries.push(`state.ilike.%${stateName}%`);
          }
        }
      }
      
      // Combine all state queries with OR
      if (stateQueries.length > 0) {
        const orCondition = stateQueries.join(',');
        console.log(`Combined state OR condition: ${orCondition}`);
        query = query.or(orCondition);
      }
    }
    
    // Apply zip code filter if provided
    if (searchParams.zipCode && searchParams.zipCode.trim()) {
      const zipCode = searchParams.zipCode.trim();
      console.log(`Adding zip code filter: "${zipCode}"`);
      query = query.ilike('zip_code', `%${zipCode}%`);
    }
    
    // Execute the query
    console.log('Executing combined search query');
    const { data, error } = await query;
    
    if (error) {
      console.error('Database query error:', error.message);
      toast.error('Error retrieving campground data');
      setSearchResults([]);
    } else {
      console.log('Combined search query results:', data);
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} campgrounds matching the search criteria`);
        setSearchResults(data);
        toast.success(`Found ${data.length} campgrounds`);
      } else {
        // If no results, try to see what data exists in the database
        const { data: sampleData } = await supabase
          .from('campgrounds')
          .select('*')
          .limit(5);
          
        if (sampleData && sampleData.length > 0) {
          console.log('Sample data in database:', sampleData);
          const message = `No matches found. Sample campground states: ${sampleData.map(c => c.state).filter(Boolean).join(', ')}`;
          console.log(message);
          toast.info('No campgrounds found matching your search criteria');
        } else {
          console.log('No sample data found in database');
          toast.info('No campground data available in the database');
        }
        
        setSearchResults([]);
      }
    }
    
    setIsSearching(false);
  };

  return { handleSearch };
};
