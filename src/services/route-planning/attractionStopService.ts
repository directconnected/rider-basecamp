
import { AttractionStop, AttractionType } from "@/components/route-planning/types";
import { fetchNearbyAttractions } from "@/services/route-points";

/**
 * Calculates attraction stops along a route
 */
export const calculateAttractionStops = async (
  route: any, 
  spacing: number = 100,
  preferredType: AttractionType = 'any'
): Promise<AttractionStop[]> => {
  try {
    if (!route?.geometry?.coordinates) {
      console.error('Invalid route geometry');
      return [];
    }
    
    const totalDistanceInMeters = route.distance;
    const totalDistanceInMiles = totalDistanceInMeters / 1609.34;
    const coordinates = route.geometry.coordinates;
    
    const attractionStops: AttractionStop[] = [];
    
    // Try to place stops roughly every 'spacing' miles
    const numStops = Math.max(1, Math.ceil(totalDistanceInMiles / spacing));
    
    if (numStops <= 1) {
      // For short routes, just add one attraction near the middle
      const midpointIndex = Math.floor(coordinates.length / 2);
      const [lon, lat] = coordinates[midpointIndex];
      
      const nearbyAttractions = await fetchNearbyAttractions(lat, lon, preferredType, 2);
      attractionStops.push(...nearbyAttractions);
    } else {
      // For longer routes, space attractions out
      for (let i = 1; i < numStops; i++) {
        const segmentDistance = (i * totalDistanceInMiles) / numStops;
        const segmentIndex = Math.floor((i * coordinates.length) / numStops);
        
        // Get coordinates for this segment
        if (segmentIndex >= coordinates.length) continue;
        const [lon, lat] = coordinates[segmentIndex];
        
        // Fetch attractions near this point
        const nearbyAttractions = await fetchNearbyAttractions(lat, lon, preferredType, 1);
        
        // Add to our stops
        nearbyAttractions.forEach(attraction => {
          // Adjust distance to be from the start of the route
          const adjustedAttraction = {
            ...attraction,
            distance: Math.round(segmentDistance)
          };
          attractionStops.push(adjustedAttraction);
        });
      }
    }
    
    console.log(`Found ${attractionStops.length} attraction stops with preferred type: ${preferredType}`);
    return attractionStops;
  } catch (error) {
    console.error("Error calculating attraction stops:", error);
    return [];
  }
};
