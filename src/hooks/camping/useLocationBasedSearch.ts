
import { useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  const handleLocationSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1);
    setError(null);

    try {
      // Request user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`User location: ${latitude}, ${longitude}`);
            
            // For demonstration purposes, we'll fetch all campgrounds
            // A real solution would use PostGIS or a similar extension to filter by distance
            // from the current coordinates
            const { data, error } = await supabase.from('campgrounds').select('*').limit(20);
            
            if (error) {
              console.error('Database query error:', error);
              toast.error('Error retrieving campground data');
              setSearchResults([]);
            } else if (data && data.length > 0) {
              console.log(`Found ${data.length} campgrounds near your location`);
              setSearchResults(data);
              toast.success(`Found ${data.length} campgrounds near your location`);
            } else {
              console.log('No campgrounds found near your location');
              setSearchResults([]);
              toast.info('No campgrounds found near your location');
            }
            
            setIsSearching(false);
          },
          (positionError) => {
            console.error('Geolocation error:', positionError);
            toast.error('Unable to get your location. Please allow location access or search by address.');
            setIsSearching(false);
          },
          { timeout: 10000 }
        );
      } else {
        toast.error('Geolocation is not supported by your browser. Please search by address instead.');
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Location search error:', error);
      toast.error('An unexpected error occurred during location search.');
      setIsSearching(false);
    }
  };

  return { handleLocationSearch, error };
};
