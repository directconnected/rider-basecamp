
import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  calculateRestaurantStops, 
  calculateCampingStops, 
  calculateAttractionStops 
} from '@/services/route-planning';
import { 
  RouteDetails as RouteDetailsType,
  HotelStop 
} from '@/hooks/useRoutePlanning';
import { 
  RestaurantStop, 
  CampingStop, 
  AttractionStop, 
  AttractionType, 
  RestaurantType 
} from './types';

interface StopsCalculatorProps {
  isCalculating: boolean;
  setIsCalculating: (isCalculating: boolean) => void;
  needsRefresh: boolean;
  setNeedsRefresh: (needsRefresh: boolean) => void;
  currentRoute: any;
  routeDetails: RouteDetailsType;
  hotelStops: HotelStop[];
  preferredLodging: string;
  preferredRestaurant: RestaurantType;
  preferredAttraction: AttractionType;
  setRestaurantStops: (stops: RestaurantStop[]) => void;
  setCampingStops: (stops: CampingStop[]) => void;
  setAttractionStops: (stops: AttractionStop[]) => void;
  restaurantStops: RestaurantStop[];
  havePreferencesChanged: () => boolean;
}

/**
 * Component that calculates all the additional stops based on preferences
 */
const StopsCalculator: React.FC<StopsCalculatorProps> = ({
  isCalculating,
  setIsCalculating,
  needsRefresh,
  setNeedsRefresh,
  currentRoute,
  routeDetails,
  hotelStops,
  preferredLodging,
  preferredRestaurant,
  preferredAttraction,
  setRestaurantStops,
  setCampingStops,
  setAttractionStops,
  restaurantStops,
  havePreferencesChanged
}) => {
  const { toast } = useToast();

  // Calculate additional stops when route or preferences change
  useEffect(() => {
    const calculateAdditionalStops = async () => {
      if (!currentRoute?.geometry?.coordinates) return;
      
      const preferenceChanged = havePreferencesChanged();
      
      if (isCalculating) return;
      
      // Check if we need to recalculate
      if (!needsRefresh && !preferenceChanged && restaurantStops.length > 0) {
        console.log('Skipping recalculation as nothing has changed');
        return;
      }
      
      setIsCalculating(true);
      
      try {
        toast({
          title: "Updating your route",
          description: "Recalculating stops based on your preferences...",
          duration: 3000,
        });
        
        // Reset all collections before recalculating
        setRestaurantStops([]);
        setAttractionStops([]);
        if (preferredLodging === 'campground') {
          setCampingStops([]);
        }
        
        // Restaurant stops - we calculate based on the requested type
        console.log('Calculating restaurant stops with type:', preferredRestaurant);
        const restaurants = await calculateRestaurantStops(currentRoute, 150, preferredRestaurant);
        console.log('Calculated restaurant stops:', restaurants);
        setRestaurantStops(restaurants);
        
        // Verify restaurant types - debug logging
        if (restaurants.length > 0) {
          console.log('Restaurant types calculated:', restaurants.map(r => ({
            name: r.restaurantName,
            type: r.restaurantType
          })));
        } else {
          console.log('No restaurant stops found for type:', preferredRestaurant);
        }

        // Camping stops (only if preferred lodging is campground)
        if (preferredLodging === 'campground') {
          console.log('Calculating camping stops for campground preference');
          const camping = await calculateCampingStops(
            currentRoute, 
            Math.floor(routeDetails.distance / (hotelStops.length || 1)),
            preferredLodging
          );
          setCampingStops(camping);
          console.log('Calculated camping stops:', camping);
        }

        // Attraction stops with proper type filtering
        console.log('Calculating attraction stops with type:', preferredAttraction);
        const attractions = await calculateAttractionStops(currentRoute, 100, preferredAttraction);
        console.log('Calculated attraction stops:', attractions);
        setAttractionStops(attractions);
        
        // Verify attraction types - debug logging
        if (attractions.length > 0) {
          console.log('Attraction types calculated:', attractions.map(a => ({
            name: a.attractionName,
            type: a.attractionType
          })));
        } else {
          console.log('No attraction stops found for type:', preferredAttraction);
        }
        
        // Reset the refresh flag
        setNeedsRefresh(false);
        
        toast({
          title: "Route updated",
          description: "Your route has been updated with new preferences.",
          duration: 3000,
        });
      } catch (error) {
        console.error('Error calculating additional stops:', error);
        toast({
          title: "Error updating route",
          description: "There was a problem updating your route. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsCalculating(false);
      }
    };

    calculateAdditionalStops();
  }, [
    currentRoute, 
    routeDetails, 
    hotelStops, 
    preferredLodging, 
    preferredRestaurant, 
    preferredAttraction, 
    needsRefresh,
    isCalculating,
    setIsCalculating,
    setNeedsRefresh,
    setRestaurantStops,
    setCampingStops,
    setAttractionStops,
    restaurantStops,
    toast,
    havePreferencesChanged
  ]);

  return null; // This component doesn't render anything visible
};

export default StopsCalculator;
