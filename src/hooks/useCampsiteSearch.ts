import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useCampsiteSearchStore } from "@/stores/campsiteSearchStore";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { geocodeLocation, getLocationName } from "@/services/mapService";

type Campsite = Database['public']['Tables']['campsites']['Row'];

export const useCampsiteSearch = () => {
  const { searchParams, setSearchParams } = useCampsiteSearchStore();
  const [searchResults, setSearchResults] = useState<Campsite[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const ITEMS_PER_PAGE = 12;

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

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

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1);
    
    try {
      if (!searchParams.state.trim() && !searchParams.city.trim() && !searchParams.zipCode.trim()) {
        toast.error('Please enter at least one search criteria');
        return;
      }

      let query = supabase
        .from('campsites')
        .select('*', { count: 'exact' });

      if (searchParams.state.trim()) {
        query = query.ilike('state', `%${searchParams.state.trim().toUpperCase()}%`);
      }
      if (searchParams.city.trim()) {
        query = query.ilike('town', `%${searchParams.city.trim()}%`);
      }
      if (searchParams.zipCode.trim()) {
        query = query.eq('nforg', parseInt(searchParams.zipCode.trim()));
      }

      const { data: searchData, error: searchError, count } = await query
        .range(0, ITEMS_PER_PAGE - 1);

      if (searchError) {
        console.error('Search error:', searchError);
        throw searchError;
      }
      
      if (searchData && searchData.length > 0) {
        setSearchResults(searchData);
        setTotalResults(count || 0);
        toast.success(`Found ${count} campsites`);
      } else {
        toast.info('No campsites found matching your criteria');
      }

    } catch (error) {
      console.error('Error in handleSearch:', error);
      toast.error('Failed to search campsites. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setIsSearching(true);
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;
      
      let query = supabase
        .from('campsites')
        .select('*');

      if (searchParams.state.trim()) {
        query = query.ilike('state', `%${searchParams.state.trim().toUpperCase()}%`);
      }
      if (searchParams.city.trim()) {
        query = query.ilike('town', `%${searchParams.city.trim()}%`);
      }
      if (searchParams.zipCode.trim()) {
        query = query.eq('nforg', parseInt(searchParams.zipCode.trim()));
      }

      const { data: searchData, error: searchError } = await query
        .range(start, end);

      if (searchError) throw searchError;
      
      if (searchData) {
        setSearchResults(searchData);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      toast.error('Failed to fetch results. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchParams,
    setSearchParams,
    searchResults,
    isSearching,
    handleSearch,
    handleLocationSearch,
    currentPage,
    totalPages: Math.ceil(totalResults / ITEMS_PER_PAGE),
    handlePageChange,
  };
};
