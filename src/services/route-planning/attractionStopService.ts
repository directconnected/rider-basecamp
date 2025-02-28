
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
    
    try {
      console.log(`Finding attraction near ${coordinates} with type ${attractionType}`);
      const attraction = await findNearbyAttraction(coordinates, 5000, attractionType);
      
      if (attraction) {
        console.log(`Found attraction data for stop ${i}:`, attraction);
        
        // Only add this attraction if it's the requested type or if we requested "any"
        if (attractionType === 'any' || attraction.attractionType === attractionType) {
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
          console.log(`Skipped attraction ${attraction.name} because type ${attraction.attractionType} doesn't match requested type ${attractionType}`);
        }
      }
    } catch (error) {
      console.error('Error finding attraction:', error);
    }
  }

  console.log(`Final attraction stops count: ${attractionStops.length}`);
  
  // Log all attraction stops for debugging
  console.log('All attraction stops before filtering:', attractionStops.length, attractionStops.map(a => ({
    name: a.attractionName,
    type: a.attractionType
  })));
  
  return attractionStops;
};
