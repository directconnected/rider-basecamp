
import { useState } from 'react';
import { toast } from "sonner";
import { findNearbyCampgrounds } from '@/services/placesService';
import { CampgroundResult } from './useCampsiteSearch';

type SearchParams = {
  state: string;
  city: string;
  zipCode: string;
  radius?: number;
};

export const useRegularSearch = (
  searchParams: SearchParams,
  setSearchResults: (results: CampgroundResult[]) => void,
  setTotalResults: (total: number) => void,
  setCurrentPage: (page: number) => void,
  ITEMS_PER_PAGE: number
) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1);
    
    try {
      if (!searchParams.state.trim() && !searchParams.city.trim() && !searchParams.zipCode.trim()) {
        toast.error('Please enter at least one search criteria');
        setIsSearching(false);
        return;
      }

      // Use the Google Places API through our Places Service
      // For geocoding we'll use a central point in the requested state or a default location
      let geocodedCoordinates: [number, number] = [-98.5795, 39.8283]; // Center of US
      
      // Try to geocode based on the search parameters
      if (searchParams.state || searchParams.city || searchParams.zipCode) {
        try {
          const searchTerm = 
            searchParams.zipCode || 
            (searchParams.city && searchParams.state ? `${searchParams.city}, ${searchParams.state}` : 
             (searchParams.city || searchParams.state || ''));
             
          if (searchTerm) {
            const { data, error } = await supabase.functions.invoke('geocode-location', {
              body: { 
                location: searchTerm,
                state: searchParams.state
              }
            });
            
            if (!error && data?.location) {
              geocodedCoordinates = [data.location.lng, data.location.lat];
              console.log("Using coordinates from geocoding:", geocodedCoordinates);
            }
          }
        } catch (error) {
          console.log("Geocoding error:", error);
        }
      }
      
      // Convert miles to meters for the API
      const radiusMeters = (searchParams.radius || 50) * 1609.34;
      
      const results = await findNearbyCampgrounds(
        geocodedCoordinates, 
        radiusMeters,
        searchParams.state || undefined
      );
      
      if (results && results.length > 0) {
        // Take the first page of results
        const firstPageResults = results.slice(0, ITEMS_PER_PAGE);
        setSearchResults(firstPageResults);
        setTotalResults(results.length);
        toast.success(`Found ${results.length} campsites`);
      } else {
        toast.info('No campsites found matching your criteria');
        setSearchResults([]);
        setTotalResults(0);
      }

    } catch (error) {
      console.error('Error in handleSearch:', error);
      toast.error('Failed to search campsites. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return { handleSearch, isSearching };
};

// Import Supabase client for geocoding
import { supabase } from "@/integrations/supabase/client";
