
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
        attraction = await findNearbyAttraction(coordinates, searchRadius, attractionType);
        
        if (attraction) {
          console.log(`Found attraction data for stop ${i}:`, attraction);
          break;
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
      
      // If we can't find the specific type, try to find any attraction
      if (attractionType !== 'any') {
        console.log('Falling back to any attraction type');
        try {
          const fallbackAttraction = await findNearbyAttraction(coordinates, 10000, 'any');
          if (fallbackAttraction) {
            attractionStops.push({
              location: coordinates,
              name: fallbackAttraction.address,
              attractionName: fallbackAttraction.name,
              distance: Math.round(progress * totalDistance),
              rating: fallbackAttraction.rating,
              website: fallbackAttraction.website,
              phone_number: fallbackAttraction.phone_number,
              attractionType: fallbackAttraction.attractionType
            });
            console.log(`Added fallback attraction stop ${i}: ${fallbackAttraction.name}`);
          }
        } catch (error) {
          console.error('Error finding fallback attraction:', error);
        }
      }
    }
  }

  console.log(`Final attraction stops count: ${attractionStops.length}`);
  
  // Ensure we have at least some attraction results
  if (attractionStops.length === 0) {
    console.log('No attractions found for requested type, will try fallback search');
    return calculateAttractionStops(route, interval, 'any');
  }
  
  // Log the attraction types found for debugging
  if (attractionStops.length > 0) {
    console.log('Attraction types found:', attractionStops.map(a => a.attractionType));
  }
  
  return attractionStops;
};
