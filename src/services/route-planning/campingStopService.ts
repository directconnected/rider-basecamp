
import { CampingStop } from "@/components/route-planning/types";
import { fetchNearbyCampgrounds } from "@/services/route-points";

/**
 * Calculates camping stops along a route
 */
export const calculateCampingStops = async (
  route: any, 
  milesPerDay: number = 300,
  preferredCampingType: string = 'any'
): Promise<CampingStop[]> => {
  try {
    if (!route?.geometry?.coordinates) {
      console.error('Invalid route geometry');
      return [];
    }
    
    const totalDistanceInMeters = route.distance;
    const totalDistanceInMiles = totalDistanceInMeters / 1609.34;
    const coordinates = route.geometry.coordinates;
    
    const campingStops: CampingStop[] = [];
    let currentMiles = 0;
    
    while (currentMiles < totalDistanceInMiles) {
      currentMiles += milesPerDay;
      if (currentMiles >= totalDistanceInMiles) break;
      
      // Calculate the index in the coordinates array
      const segmentIndex = Math.min(
        Math.floor((currentMiles / totalDistanceInMiles) * coordinates.length),
        coordinates.length - 1
      );
      
      // Get coordinates for this segment
      const [lon, lat] = coordinates[segmentIndex];
      
      // Fetch campgrounds near this point with preferred type
      const nearbyCampgrounds = await fetchNearbyCampgrounds(lat, lon, 1, preferredCampingType);
      
      // Add to our stops
      nearbyCampgrounds.forEach(campground => {
        // Adjust distance to be from the start of the route
        const adjustedCampground = {
          ...campground,
          distance: Math.round(currentMiles)
        };
        campingStops.push(adjustedCampground);
      });
    }
    
    console.log(`Found ${campingStops.length} camping stops with type: ${preferredCampingType}`);
    return campingStops;
  } catch (error) {
    console.error("Error calculating camping stops:", error);
    return [];
  }
};
