
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getLocationName } from "@/services/mapService";
import { calculateDistance } from "@/hooks/camping/campsiteUtils";
import { findNearbyCampgrounds } from "@/services/placesService";
import { CampgroundResult } from '@/hooks/camping/types';

type SearchParams = {
  state: string;
  city: string;
  zipCode: string;
  radius?: number;
};

export const useLocationSearch = (
  searchParams: SearchParams,
  setSearchResults: (results: CampgroundResult[]) => void,
  setTotalResults: (total: number) => void,
  ITEMS_PER_PAGE: number
) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleLocationSearch = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsSearching(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const locationName = await getLocationName([longitude, latitude]);
      
      // Use direct Places API search instead of Supabase database
      console.log(`Searching for campgrounds near ${latitude}, ${longitude} with radius ${searchParams.radius || 50} miles`);
      
      // Convert miles to meters for the API
      const radiusMeters = (searchParams.radius || 50) * 1609.34;
      
      const results = await findNearbyCampgrounds(
        [longitude, latitude], 
        radiusMeters,
        searchParams.state || undefined
      );
      
      if (results && results.length > 0) {
        // Filter by distance if a radius was specified
        const filteredResults = searchParams.radius 
          ? results.filter(campsite => {
              if (campsite.location && campsite.location[0] && campsite.location[1]) {
                const distance = calculateDistance(latitude, longitude, campsite.location[1], campsite.location[0]);
                return distance <= (searchParams.radius || 50);
              }
              return false;
            })
          : results;

        setSearchResults(filteredResults);
        setTotalResults(filteredResults.length);
        toast.success(`Found ${filteredResults.length} campsites near ${locationName}`);
      } else {
        toast.info('No campsites found in your area');
        setSearchResults([]);
        setTotalResults(0);
      }

    } catch (error) {
      console.error('Error in handleLocationSearch:', error);
      if (error instanceof GeolocationPositionError) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Please allow location access to use this feature');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information is unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('An error occurred while getting your location');
        }
      } else {
        toast.error('Failed to search campsites. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  return { handleLocationSearch, isSearching };
};
