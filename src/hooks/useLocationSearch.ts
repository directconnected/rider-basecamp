
import { useState } from 'react';
import { toast } from "sonner";
import { getLocationName } from "@/services/mapService";
import { calculateDistance } from "@/hooks/camping/campsiteUtils";
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
      
      // Since we removed Google Places API functionality, show a placeholder message
      toast.info('Campground search is currently unavailable. Feature under maintenance.');
      
      // Return empty results as we removed the Google Places API dependency
      setSearchResults([]);
      setTotalResults(0);

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
