
import { toast } from 'sonner';
import { findNearbyCampgrounds } from '@/services/placesService';
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
      const radiusMiles = searchParams.radius === 0 ? 500 : searchParams.radius; // Use large radius for "Any Distance"
      const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters
      const isAnyDistance = searchParams.radius === 0;
      
      const state = searchParams.state; // Use selected state for filtering
      
      console.log(`Searching for campgrounds near your location with radius ${isAnyDistance ? "Any Distance" : radiusMiles + " miles"} (${radiusMeters}m)`);
      
      // Get campgrounds near current location
      const results = await findNearbyCampgrounds(coordinates, radiusMeters, state);
      console.log("Search results from geolocation:", results);
      
      // Process results
      const processedResults = processSearchResults(results, coordinates, radiusMiles, isAnyDistance);
      
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
