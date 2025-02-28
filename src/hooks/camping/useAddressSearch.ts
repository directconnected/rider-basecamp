
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CampgroundResult } from '@/hooks/camping/types';
import { processSearchResults } from '@/hooks/camping/campsiteUtils';

type AddressSearchParams = {
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

export const useAddressSearch = ({
  searchParams,
  setSearchResults,
  setIsSearching,
  setCurrentPage,
}: AddressSearchParams) => {
  // Function to handle search based on address
  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1);

    try {
      // Construct the address string based on provided parameters
      const addressParts = [];
      if (searchParams.city) addressParts.push(searchParams.city);
      if (searchParams.state) addressParts.push(searchParams.state);
      if (searchParams.zipCode) addressParts.push(searchParams.zipCode);
      const addressString = addressParts.join(', ');

      // Use Supabase edge function to geocode the address
      const { data: geocodeData, error: geocodeError } = await supabase.functions.invoke('geocode-location', {
        body: { address: addressString },
      });

      if (geocodeError || !geocodeData || !geocodeData.length) {
        console.error('Geocoding error:', geocodeError || 'No results found');
        toast.error('Could not find that location. Please try another search.');
        setIsSearching(false);
        return;
      }

      const coordinates: [number, number] = [
        parseFloat(geocodeData[0].lon),
        parseFloat(geocodeData[0].lat),
      ];

      // Search for nearby campgrounds in our database
      const { data: campgrounds, error: campgroundsError } = await supabase
        .from('campgrounds')
        .select('*');

      if (campgroundsError) {
        console.error('Error fetching campgrounds:', campgroundsError);
        toast.error('Error loading campgrounds. Please try again.');
        setIsSearching(false);
        return;
      }

      if (!campgrounds || campgrounds.length === 0) {
        toast.info('No campgrounds found in our database.');
        setIsSearching(false);
        return;
      }

      // Process the results (calculate distances, filter, sort)
      const processedResults = processSearchResults(
        campgrounds,
        coordinates,
        searchParams.radius,
        searchParams.radius === 0
      );

      setSearchResults(processedResults);
      toast.success(`Found ${processedResults.length} campgrounds near ${addressString}`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('An unexpected error occurred during search.');
    } finally {
      setIsSearching(false);
    }
  };

  return { handleSearch };
};
