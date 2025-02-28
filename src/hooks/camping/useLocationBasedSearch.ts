
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
      
      // Set search radius based on user selection
      const radiusMiles = searchParams.radius === 0 ? 100 : searchParams.radius; // Default to 100 miles for "Any Distance"
      const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters
      const isAnyDistance = searchParams.radius === 0;
      
      const state = searchParams.state; // Use selected state for filtering
      
      console.log(`Searching for campgrounds near your location with radius ${isAnyDistance ? "Any Distance" : radiusMiles + " miles"} (${radiusMeters}m)`);
      
      // Get campgrounds near current location using Google Places API
      const { data, error } = await supabase.functions.invoke('find-nearby-places', {
        body: {
          coordinates,
          radius: radiusMeters,
          type: 'campground',
          state: state || null
        }
      });
      
      if (error) {
        console.error('Error searching for campgrounds by location:', error);
        toast.error('Failed to search for campgrounds');
        setIsSearching(false);
        return;
      }
      
      if (!data || !data.results || data.results.length === 0) {
        console.log("No campgrounds found in the area");
        toast.info(isAnyDistance ? 
          'No campgrounds found near your location' : 
          `No campgrounds found within ${radiusMiles} miles of your location`
        );
        setIsSearching(false);
        return;
      }
      
      console.log("Search results from geolocation:", data.results);
      
      // Convert Google Places API results to our format
      const campgrounds = data.results.map((place: any) => ({
        name: place.name,
        address: place.vicinity || place.formatted_address,
        location: [place.geometry.location.lng, place.geometry.location.lat],
        rating: place.rating,
        phone_number: place.formatted_phone_number,
        website: place.website,
        types: place.types,
        state: state || null,
        // Set remaining fields to null or default values
        water: null,
        showers: null,
        season: null,
        sites: null,
        rv_length: null,
        pets: null,
        fee: null,
        type: 'campground',
      }));
      
      // Process results
      const processedResults = processSearchResults(campgrounds, coordinates, radiusMiles, isAnyDistance);
      
      if (processedResults.length > 0) {
        setSearchResults(processedResults);
        
        if (isAnyDistance) {
          toast.success(`Found ${processedResults.length} campgrounds near your location`);
        } else {
          toast.success(`Found ${processedResults.length} campgrounds within ${radiusMiles} miles of your location`);
        }
      } else {
        if (isAnyDistance) {
          toast.info(`No campgrounds found near your location`);
        } else {
          toast.info(`No campgrounds found within ${radiusMiles} miles of your location`);
        }
      }
    } catch (error) {
      console.error('Error searching for campgrounds by location:', error);
      toast.error('Failed to get your location or search for campgrounds');
    } finally {
      setIsSearching(false);
    }
  };

  return { handleLocationSearch };
};
