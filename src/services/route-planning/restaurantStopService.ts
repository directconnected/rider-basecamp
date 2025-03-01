
import { RestaurantStop, RestaurantType } from "@/components/route-planning/types";
import { fetchNearbyRestaurants } from "@/services/route-points";

/**
 * Calculates restaurant stops along a route
 */
export const calculateRestaurantStops = async (
  route: any, 
  spacing: number = 150,
  preferredType: RestaurantType = 'any'
): Promise<RestaurantStop[]> => {
  try {
    if (!route?.geometry?.coordinates) {
      console.error('Invalid route geometry');
      return [];
    }
    
    const totalDistanceInMeters = route.distance;
    const totalDistanceInMiles = totalDistanceInMeters / 1609.34;
    const coordinates = route.geometry.coordinates;
    
    const restaurantStops: RestaurantStop[] = [];
    
    // Try to place stops roughly every 'spacing' miles
    const numStops = Math.max(1, Math.ceil(totalDistanceInMiles / spacing));
    
    if (numStops <= 1) {
      // For short routes, just add one restaurant near the middle
      const midpointIndex = Math.floor(coordinates.length / 2);
      const [lon, lat] = coordinates[midpointIndex];
      
      const nearbyRestaurants = await fetchNearbyRestaurants(lat, lon, preferredType, 2);
      restaurantStops.push(...nearbyRestaurants);
    } else {
      // For longer routes, space restaurants out
      for (let i = 1; i < numStops; i++) {
        const segmentDistance = (i * totalDistanceInMiles) / numStops;
        const segmentIndex = Math.floor((i * coordinates.length) / numStops);
        
        // Get coordinates for this segment
        if (segmentIndex >= coordinates.length) continue;
        const [lon, lat] = coordinates[segmentIndex];
        
        // Fetch restaurants near this point
        const nearbyRestaurants = await fetchNearbyRestaurants(lat, lon, preferredType, 1);
        
        // Add to our stops
        nearbyRestaurants.forEach(restaurant => {
          // Adjust distance to be from the start of the route
          const adjustedRestaurant = {
            ...restaurant,
            distance: Math.round(segmentDistance)
          };
          restaurantStops.push(adjustedRestaurant);
        });
      }
    }
    
    console.log(`Found ${restaurantStops.length} restaurant stops with preferred type: ${preferredType}`);
    return restaurantStops;
  } catch (error) {
    console.error("Error calculating restaurant stops:", error);
    return [];
  }
};
