
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
  
  // Always try to find at least 3 attraction stops
  const actualNumStops = Math.max(3, numStops);
  
  for (let i = 1; i <= actualNumStops; i++) {
    const progress = i / actualNumStops;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    // Try multiple times with increasing radius if we don't find the preferred type
    let attraction = null;
    let attempts = 0;
    let searchRadius = 5000; // Start with 5km
    const maxAttempts = 6; // Increase max attempts to find attractions
    
    while (!attraction && attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1}: Finding attraction near ${coordinates} with type ${attractionType} and radius ${searchRadius}m`);
        
        // Only search for specific type (not any fallback) if a non-any type is requested
        if (attractionType !== 'any') {
          attraction = await findNearbyAttraction(coordinates, searchRadius, attractionType);
          
          if (attraction) {
            console.log(`Found ${attractionType} attraction for stop ${i}:`, attraction.name);
            // Ensure it has the specific requested type
            attraction.attractionType = attractionType;
            break;
          }
        } else {
          // For 'any' type, just find any attraction
          attraction = await findNearbyAttraction(coordinates, searchRadius, 'any');
          if (attraction) {
            console.log(`Found any attraction for stop ${i}:`, attraction.name);
            break;
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
        attractionType: attraction.attractionType || attractionType // Use the actual type
      });
      
      console.log(`Added attraction stop ${i}: ${attraction.name} with type ${attraction.attractionType}`);
    } else if (attractionType !== 'any') {
      // We couldn't find the specific type, don't add a fallback for specific searches
      console.log(`Could not find attraction of type ${attractionType} for stop ${i} after ${maxAttempts} attempts`);
    } else {
      // For 'any' type, add a placeholder
      console.log(`Could not find any attraction for stop ${i} after ${maxAttempts} attempts`);
      
      const placeholderName = `Attraction near mile ${Math.round(progress * totalDistance)}`;
      attractionStops.push({
        location: coordinates,
        name: `Near route point ${Math.round(progress * totalDistance)}`,
        attractionName: placeholderName,
        distance: Math.round(progress * totalDistance),
        attractionType: 'any'
      });
      console.log(`Added placeholder attraction stop ${i}`);
    }
  }

  console.log(`Final attraction stops count: ${attractionStops.length}`);
  
  // If we couldn't find any attractions of the specified type, return an empty array
  // instead of falling back to 'any'
  if (attractionStops.length === 0 && attractionType !== 'any') {
    console.log(`No attractions found of type ${attractionType}`);
    return [];
  }
  
  // Log the attraction types found for debugging
  if (attractionStops.length > 0) {
    console.log('Attraction types found:', attractionStops.map(a => a.attractionType));
  }
  
  return attractionStops;
};
