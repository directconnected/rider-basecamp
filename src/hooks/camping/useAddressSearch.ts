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

      // Set search radius based on user selection (in meters for Google Places API)
      const radiusMiles = searchParams.radius === 0 ? 100 : searchParams.radius; // Default to 100 miles for "Any Distance"
      const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters

      // Call the edge function to search for campgrounds using Google Places API
      const { data: campgroundsData, error: campgroundsError } = await supabase.functions.invoke('find-nearby-places', {
        body: {
          coordinates,
          radius: radiusMeters,
          type: 'campground',
          state: searchParams.state || null
        }
      });

      if (campgroundsError) {
        console.error('Error fetching campgrounds:', campgroundsError);
        toast.error('Error loading campgrounds. Please try again.');
        setIsSearching(false);
        return;
      }

      if (!campgroundsData || !campgroundsData.results || campgroundsData.results.length === 0) {
        toast.info('No campgrounds found near this location.');
        setIsSearching(false);
        return;
      }

      // Process the Google Places API results into our CampgroundResult format
      const campgrounds = campgroundsData.results.map((place: any) => ({
        name: place.name,
        address: place.vicinity || place.formatted_address,
        location: [place.geometry.location.lng, place.geometry.location.lat],
        rating: place.rating,
        // Other fields that might be available from Google Places
        phone_number: place.formatted_phone_number,
        website: place.website,
        types: place.types,
        // We don't have these from Google Places but they're in our type
        state: searchParams.state || null,
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
