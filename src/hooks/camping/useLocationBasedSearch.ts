import { toast } from 'sonner';
import { CampgroundResult } from '@/hooks/camping/types';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance } from '@/utils/distanceUtils';

type LocationSearchParams = {
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

export const useLocationBasedSearch = ({
  searchParams,
  setSearchResults,
  setIsSearching,
  setCurrentPage,
}: LocationSearchParams) => {
  
  const handleLocationSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1);
    
    try {
      // Request user's location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User location: ${latitude}, ${longitude}`);
          
          // Fetch all campgrounds from the database
          const { data, error } = await supabase
            .from('campgrounds')
            .select('*');
            
          if (error) {
            console.error('Error fetching campgrounds:', error);
            toast.error('Error fetching nearby campgrounds');
            setSearchResults([]);
            setIsSearching(false);
            return;
          }
          
          if (!data || data.length === 0) {
            console.log('No campgrounds found in the database');
            toast.info('No campgrounds found in the database');
            setSearchResults([]);
            setIsSearching(false);
            return;
          }
          
          console.log('Total campgrounds found:', data.length);
          
          // Calculate distance for each campground and filter by radius
          const withDistance = data
            .map(campground => {
              // Parse GPS coordinates if available
              if (!campground.gps_coordinates) {
                return { ...campground, distance: Infinity };
              }
              
              try {
                // Handle different GPS coordinate formats
                const coords = campground.gps_coordinates
                  .replace(/[°''NnWwEeSs]/g, '')
                  .split(/,\s*|\s+/);
                
                if (coords.length >= 2) {
                  const campLat = parseFloat(coords[0]);
                  const campLng = parseFloat(coords[1]);
                  
                  if (!isNaN(campLat) && !isNaN(campLng)) {
                    // Calculate distance in miles between user and campground
                    const distance = calculateDistance(
                      latitude, 
                      longitude, 
                      campLat, 
                      campLng
                    );
                    
                    return { ...campground, distance };
                  }
                }
                
                return { ...campground, distance: Infinity };
              } catch (e) {
                console.error('Error parsing coordinates:', e);
                return { ...campground, distance: Infinity };
              }
            })
            .filter(camp => {
              // If no radius specified or radius is 0, include all results
              if (!searchParams.radius) return true;
              
              // Otherwise, filter by radius (in miles)
              return camp.distance !== Infinity && camp.distance <= searchParams.radius;
            })
            .sort((a, b) => a.distance - b.distance);
          
          if (withDistance.length > 0) {
            console.log('Found nearby campgrounds:', withDistance.length);
            console.log('First result distance:', withDistance[0].distance);
            toast.success(`Found ${withDistance.length} campgrounds near your location`);
            setSearchResults(withDistance);
          } else {
            console.log('No campgrounds found within the specified radius');
            toast.info(searchParams.radius 
              ? `No campgrounds found within ${searchParams.radius} miles of your location` 
              : 'No campgrounds found near your location');
            setSearchResults([]);
          }
          
          setIsSearching(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not access your location. Please check your browser permissions.');
          setIsSearching(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      setIsSearching(false);
    }
  };
  
  return { handleLocationSearch };
};
