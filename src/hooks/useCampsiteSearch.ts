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
      
      // Default coordinates for when geocoding fails - use central location of the state if possible
      let coordinates: [number, number] = [-76.8867, 40.2732]; // Default to central PA
      
      try {
        // Use the Places service to find coordinates for the location
        const { data, error } = await supabase.functions.invoke('geocode-location', {
          body: { 
            location: locationString,
            state: state
          }
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

      // Convert radius from miles to meters for the API
      const radiusMiles = searchParams.radius || 25; // Default to 25 miles if not specified
      const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters
      
      console.log(`Searching for campgrounds near coordinates ${coordinates} with radius ${radiusMiles} miles (${radiusMeters}m)`);
      
      // Get campgrounds near the location
      const results = await findNearbyCampgrounds(coordinates, radiusMeters, state);
      console.log("Search results:", results);
      
      // Filter results by distance if coordinates are available
      const filteredResults = results.filter(result => {
        if (!result.location || !result.location[0] || !result.location[1]) {
          return true; // Keep results without location coordinates
        }
        
        // Calculate distance in miles using Haversine formula
        const distance = calculateDistance(
          coordinates[1], coordinates[0], 
          result.location[1], result.location[0]
        );
        
        // Add distance to the result object
        result.distance = distance;
        
        // Only keep results within the specified radius
        return distance <= radiusMiles;
      });
      
      console.log(`Filtered to ${filteredResults.length} campgrounds within ${radiusMiles} miles`);
      
      if (filteredResults.length > 0) {
        // Sort by distance
        filteredResults.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        
        setSearchResults(filteredResults);
        setTotalResults(filteredResults.length);
        toast.success(`Found ${filteredResults.length} campgrounds near ${searchParams.city || locationString}`);
      } else {
        toast.info(`No campgrounds found within ${radiusMiles} miles of ${searchParams.city || locationString}`);
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
      
      // Convert radius from miles to meters for the API
      const radiusMiles = searchParams.radius || 25; // Default to 25 miles if not specified
      const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters
      
      const state = searchParams.state; // Use selected state for filtering
      
      console.log(`Searching for campgrounds near your location with radius ${radiusMiles} miles (${radiusMeters}m)`);
      
      // Get campgrounds near current location
      const results = await findNearbyCampgrounds(coordinates, radiusMeters, state);
      console.log("Search results from geolocation:", results);
      
      // Filter results by distance
      const filteredResults = results.filter(result => {
        if (!result.location || !result.location[0] || !result.location[1]) {
          return true; // Keep results without location coordinates
        }
        
        // Calculate distance in miles using Haversine formula
        const distance = calculateDistance(
          coordinates[1], coordinates[0], 
          result.location[1], result.location[0]
        );
        
        // Add distance to the result object
        result.distance = distance;
        
        // Only keep results within the specified radius
        return distance <= radiusMiles;
      });
      
      console.log(`Filtered to ${filteredResults.length} campgrounds within ${radiusMiles} miles of your location`);
      
      if (filteredResults.length > 0) {
        // Sort by distance
        filteredResults.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        
        setSearchResults(filteredResults);
        setTotalResults(filteredResults.length);
        toast.success(`Found ${filteredResults.length} campgrounds near your location`);
      } else {
        toast.info(`No campgrounds found within ${radiusMiles} miles of your location`);
      }
    } catch (error) {
      console.error('Error searching for campgrounds by location:', error);
      toast.error('Failed to get your location or search for campgrounds');
    } finally {
      setIsSearching(false);
    }
  };

  // Calculate distance between two points in miles using the Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
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
