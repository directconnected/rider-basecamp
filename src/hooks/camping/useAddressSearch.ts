import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { findNearbyCampgrounds } from '@/services/placesService';
import { processSearchResults } from './campsiteUtils';
import { CampgroundResult } from './types';

interface AddressSearchProps {
  searchParams: {
    state: string;
    city: string;
    zipCode: string;
    radius: number;
  };
  setSearchResults: (results: CampgroundResult[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  setCurrentPage: (page: number) => void;
}

export const useAddressSearch = ({
  searchParams,
  setSearchResults,
  setIsSearching,
  setCurrentPage
}: AddressSearchProps) => {

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1); // Reset to first page on new search
    
    try {
      // Format the search location
      let locationString = '';
      let searchTerm = '';
      
      // Check if we have a zip code - if so, that becomes the primary search term
      if (searchParams.zipCode) {
        searchTerm = searchParams.zipCode;
        console.log("Searching for ZIP code:", searchTerm);
      } else {
        // Otherwise create a location string from city and state
        if (searchParams.city) locationString += searchParams.city;
        if (searchParams.city && searchParams.state) locationString += ', ';
        if (searchParams.state) locationString += searchParams.state;
        searchTerm = locationString.trim();
        console.log("Searching for location:", searchTerm);
      }
      
      if (!searchTerm) {
        toast.error('Please enter a location to search');
        setIsSearching(false);
        return;
      }

      // Use the state parameter directly for filtering
      const state = searchParams.state;
      
      try {
        // Directly use a geocoding library or API to find coordinates
        // For example, we can use a simple geocoding approach with MapBox API through our edge function
        console.log("Calling geocode-location function with:", searchTerm);
        const { data, error } = await supabase.functions.invoke('geocode-location', {
          body: { 
            location: searchTerm,
            state: state
          }
        });

        console.log("Geocode response:", data, error);

        if (error) {
          console.error("Geocoding error:", error);
          toast.error('Error finding that location. Please try a different search.');
          setIsSearching(false);
          return;
        }

        if (!data || !data.location) {
          console.error("No location found in geocoding response");
          toast.error('Could not find that location. Please try a different search.');
          setIsSearching(false);
          return;
        }

        const coordinates: [number, number] = [data.location.lng, data.location.lat];
        console.log("Using coordinates from geocoding:", coordinates);
        
        // Set search radius (in meters) based on user selection
        const radiusMiles = searchParams.radius === 0 ? 500 : searchParams.radius; // Use large radius for "Any Distance"
        const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters
        const isAnyDistance = searchParams.radius === 0;
        
        console.log(`Searching for campgrounds near coordinates ${coordinates} with radius ${isAnyDistance ? "Any Distance" : radiusMiles + " miles"} (${radiusMeters}m)`);
        
        // Get campgrounds near the location
        const results = await findNearbyCampgrounds(coordinates, radiusMeters, state);
        console.log("Search results:", results);
        
        // Process results
        const processedResults = processSearchResults(results, coordinates, radiusMiles, isAnyDistance);
        
        if (processedResults.length > 0) {
          setSearchResults(processedResults);
          
          const displayLocation = searchParams.zipCode || locationString || searchTerm;
          
          if (isAnyDistance) {
            toast.success(`Found ${processedResults.length} campgrounds near ${displayLocation}`);
          } else {
            toast.success(`Found ${processedResults.length} campgrounds within ${radiusMiles} miles of ${displayLocation}`);
          }
        } else {
          const displayLocation = searchParams.zipCode || locationString || searchTerm;
          
          if (isAnyDistance) {
            toast.info(`No campgrounds found near ${displayLocation}`);
          } else {
            toast.info(`No campgrounds found within ${radiusMiles} miles of ${displayLocation}`);
          }
        }
      } catch (geocodeError) {
        console.error("Error during geocoding:", geocodeError);
        toast.error('Error locating your search area. Please try again.');
        setIsSearching(false);
        return;
      }
    } catch (error) {
      console.error('Error searching for campgrounds:', error);
      toast.error('Failed to search for campgrounds');
    } finally {
      setIsSearching(false);
    }
  };

  return { handleSearch };
};
