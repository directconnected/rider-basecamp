
import { toast } from 'sonner';
import { CampgroundResult } from '@/hooks/camping/types';
import { supabase } from '@/integrations/supabase/client';

type LocationSearchParams = {
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

export const useLocationBasedSearch = ({
  searchParams,
  setSearchResults,
  setIsSearching,
  setCurrentPage,
}: LocationSearchParams) => {
  
  const handleLocationSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1);
    
    try {
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
      console.log('Total test records:', testQuery.data.length);
      
      // Request user's location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User location: ${latitude}, ${longitude}`);
          
          // For this initial test, let's just fetch all campgrounds to verify we can get data
          const { data, error } = await supabase
            .from('campgrounds')
            .select('*');
            
          if (error) {
            console.error('Error fetching campgrounds:', error);
            toast.error('Error fetching nearby campgrounds');
            setSearchResults([]);
          } else if (data && data.length > 0) {
            console.log('Found campgrounds:', data);
            toast.success(`Found ${data.length} campgrounds`);
            setSearchResults(data);
          } else {
            console.log('No campgrounds found in the database');
            toast.info('No campgrounds found in the database');
            setSearchResults([]);
          }
          
          setIsSearching(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not access your location. Please check your browser permissions.');
          setIsSearching(false);
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      setIsSearching(false);
    }
  };
  
  return { handleLocationSearch };
};
