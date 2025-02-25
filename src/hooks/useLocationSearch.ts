
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { getLocationName } from "@/services/mapService";
import { calculateDistance } from "@/utils/distanceCalculations";

type Campsite = Database['public']['Tables']['campsites']['Row'];
type SearchParams = {
  state: string;
  city: string;
  zipCode: string;
  radius?: number;
};

export const useLocationSearch = (
  searchParams: SearchParams,
  setSearchResults: (results: Campsite[]) => void,
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
      
      let query = supabase
        .from('campsites')
        .select('*', { count: 'exact' });

      if (searchParams.radius) {
        const latRange = searchParams.radius / 69;
        const lonRange = searchParams.radius / (69 * Math.cos(latitude * Math.PI / 180));
        
        query = query
          .gte('lat', latitude - latRange)
          .lte('lat', latitude + latRange)
          .gte('lon', longitude - lonRange)
          .lte('lon', longitude + lonRange);
      }

      const { data: searchData, error: searchError, count } = await query
        .range(0, ITEMS_PER_PAGE - 1);

      if (searchError) throw searchError;
      
      if (searchData && searchData.length > 0) {
        const filteredResults = searchParams.radius 
          ? searchData.filter(campsite => 
              calculateDistance(latitude, longitude, campsite.lat || 0, campsite.lon || 0) <= searchParams.radius!
            )
          : searchData;

        setSearchResults(filteredResults);
        setTotalResults(count || 0);
        toast.success(`Found ${filteredResults.length} campsites near ${locationName}`);
      } else {
        toast.info('No campsites found in your area');
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
