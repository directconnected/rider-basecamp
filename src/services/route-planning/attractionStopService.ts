
import { findNearestPointIndex } from './routeUtils';
import { findNearbyAttraction } from '../placesService';
import { AttractionStop } from '@/components/route-planning/types';

export const calculateAttractionStops = async (route: any, interval: number): Promise<AttractionStop[]> => {
  console.log('Calculating attraction stops every:', interval, 'miles');
  
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
      const attraction = await findNearbyAttraction(coordinates);
      
      if (attraction) {
        attractionStops.push({
          location: coordinates,
          name: attraction.address,
          attractionName: attraction.name,
          distance: Math.round(progress * totalDistance),
          rating: attraction.rating
        });
      }
    } catch (error) {
      console.error('Error finding attraction:', error);
    }
  }

  return attractionStops;
};
