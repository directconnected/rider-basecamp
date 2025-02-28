
import { useState } from 'react';
import { useCampsiteSearchStore } from "@/stores/campsiteSearchStore";
import { useLocationSearch } from './useLocationSearch';
import { findNearbyCampgrounds } from '@/services/placesService';
import { toast } from 'sonner';

export interface CampgroundResult {
  name: string;
  address: string;
  location: [number, number];
  distance?: number;
  rating?: number;
  phone_number?: string;
  website?: string;
  types?: string[];
  state?: string;
}

export const useCampsiteSearch = () => {
  const { searchParams, setSearchParams } = useCampsiteSearchStore();
  const [searchResults, setSearchResults] = useState<CampgroundResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const ITEMS_PER_PAGE = 12;

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // If we had pagination from the API, we would fetch new results here
    // For now, we'll just update the page display
  };

  // Regular search by state/city
  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // Format the search location
      let locationString = '';
      if (searchParams.city) locationString += searchParams.city + ', ';
      if (searchParams.state) locationString += searchParams.state + ' ';
      if (searchParams.zipCode) locationString += searchParams.zipCode;
      
      if (!locationString.trim()) {
        toast.error('Please enter a location to search');
        setIsSearching(false);
        return;
      }

      console.log("Searching for location:", locationString);
      
      // Use the state parameter directly for filtering
      const state = searchParams.state;
      
      // For debugging, let's search directly in Pennsylvania if API geocoding fails
      let coordinates: [number, number] = [-76.8867, 40.2732]; // Default to central PA
      
      try {
        // Use the Places service to find coordinates for the location
        const { data, error } = await supabase.functions.invoke('geocode-location', {
          body: { location: locationString }
        });

        console.log("Geocode response:", data, error);

        if (!error && data?.location) {
          coordinates = [data.location.lng, data.location.lat];
          console.log("Using coordinates from geocoding:", coordinates);
        } else {
          console.warn("Geocoding failed, using default coordinates");
          toast.warning('Using approximate location - precise geocoding failed');
        }
      } catch (geocodeError) {
        console.error("Error during geocoding:", geocodeError);
        toast.warning('Using approximate location - geocoding service unavailable');
      }

      const radius = searchParams.radius || 25000; // Default to 25km if not specified
      console.log(`Searching for campgrounds near coordinates ${coordinates} with radius ${radius}m`);
      
      // Get campgrounds near the location
      const results = await findNearbyCampgrounds(coordinates, radius, state);
      console.log("Search results:", results);
      
      if (results && results.length > 0) {
        setSearchResults(results);
        setTotalResults(results.length);
        toast.success(`Found ${results.length} campgrounds near ${locationString}`);
      } else {
        toast.info(`No campgrounds found near ${locationString}`);
      }
    } catch (error) {
      console.error('Error searching for campgrounds:', error);
      toast.error('Failed to search for campgrounds');
    } finally {
      setIsSearching(false);
    }
  };

  // Location-based search (using browser geolocation)
  const handleLocationSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    
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
      
      const radius = searchParams.radius || 25000; // Default to 25km
      const state = searchParams.state; // Use selected state for filtering
      
      // Get campgrounds near current location
      const results = await findNearbyCampgrounds(coordinates, radius, state);
      console.log("Search results from geolocation:", results);
      
      if (results && results.length > 0) {
        setSearchResults(results);
        setTotalResults(results.length);
        toast.success(`Found ${results.length} campgrounds near your location`);
      } else {
        toast.info('No campgrounds found near your location');
      }
    } catch (error) {
      console.error('Error searching for campgrounds by location:', error);
      toast.error('Failed to get your location or search for campgrounds');
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
    totalPages,
    handlePageChange,
  };
};

// Import Supabase client for geocoding
import { supabase } from "@/integrations/supabase/client";
