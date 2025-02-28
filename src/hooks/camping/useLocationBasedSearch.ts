
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { processSearchResults } from './campsiteUtils';
import { CampgroundResult } from './types';

interface LocationSearchProps {
  searchParams: {
    state: string;
    radius: number;
  };
  setSearchResults: (results: CampgroundResult[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  setCurrentPage: (page: number) => void;
}

export const useLocationBasedSearch = ({
  searchParams,
  setSearchResults,
  setIsSearching,
  setCurrentPage
}: LocationSearchProps) => {

  const handleLocationSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1); // Reset to first page on new search
    
    try {
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by your browser');
        setIsSearching(false);
        return;
      }

      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const coordinates: [number, number] = [position.coords.longitude, position.coords.latitude];
      console.log("Using geolocation coordinates:", coordinates);
      
      // Since we're removing Google Places API functionality, we'll return a message
      toast.info('Campground search functionality has been removed');
      
      // Return empty results
      setSearchResults([]);
    } catch (error) {
      console.error('Error searching for campgrounds by location:', error);
      toast.error('Failed to get your location or search for campgrounds');
    } finally {
      setIsSearching(false);
    }
  };

  return { handleLocationSearch };
};
