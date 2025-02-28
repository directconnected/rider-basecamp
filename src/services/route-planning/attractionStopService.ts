
import { findNearestPointIndex } from './routeUtils';
import { findNearbyAttraction } from '../placesService';
import { AttractionStop, AttractionType } from '@/components/route-planning/types';

export const calculateAttractionStops = async (
  route: any, 
  interval: number = 100,
  attractionType: AttractionType = 'any'
): Promise<AttractionStop[]> => {
  console.log('Calculating attraction stops every:', interval, 'miles, type:', attractionType);
  
  const attractionStops: AttractionStop[] = [];
  const totalDistance = route.distance / 1609.34;
  
  const numStops = Math.floor(totalDistance / interval);
  
  if (numStops <= 0) return [];
  
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * interval) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    // Try multiple times with increasing radius if we don't find the preferred type
    let attraction = null;
    let attempts = 0;
    let searchRadius = 5000; // Start with 5km
    const maxAttempts = attractionType === 'any' ? 2 : 4; // Try harder for specific types
    
    while (!attraction && attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1}: Finding attraction near ${coordinates} with type ${attractionType} and radius ${searchRadius}m`);
        attraction = await findNearbyAttraction(coordinates, searchRadius, attractionType);
        
        if (attraction) {
          console.log(`Found attraction data for stop ${i}:`, attraction);
          
          // Only add this attraction if it's the requested type or if we requested "any"
          if (attractionType === 'any' || attraction.attractionType === attractionType) {
            console.log(`Found matching attraction: ${attraction.name} with type: ${attraction.attractionType}`);
            break;
          } else {
            console.log(`Attraction ${attraction.name} has type ${attraction.attractionType} which doesn't match requested ${attractionType}, trying again`);
            attraction = null; // Reset and try again
          }
        }
      } catch (error) {
        console.error(`Error in attempt ${attempts + 1}:`, error);
      }
      
      attempts++;
      searchRadius += 5000; // Increase radius by 5km each attempt
    }
    
    if (attraction) {
      attractionStops.push({
        location: coordinates,
        name: attraction.address,
        attractionName: attraction.name,
        distance: Math.round(progress * totalDistance),
        rating: attraction.rating,
        website: attraction.website,
        phone_number: attraction.phone_number,
        attractionType: attraction.attractionType
      });
      
      console.log(`Added attraction stop ${i}: ${attraction.name} with type ${attraction.attractionType}`);
    } else {
      console.log(`Could not find attraction of type ${attractionType} for stop ${i} after ${maxAttempts} attempts`);
    }
  }

  console.log(`Final attraction stops count: ${attractionStops.length}`);
  
  // Log the attraction types found for debugging
  if (attractionStops.length > 0) {
    console.log('Attraction types found:', attractionStops.map(a => a.attractionType));
  }
  
  return attractionStops;
};
