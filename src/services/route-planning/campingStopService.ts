
import { findNearestPointIndex } from './routeUtils';
import { findNearbyCampground } from '../placesService';
import { CampingStop } from '@/components/route-planning/types';

export const calculateCampingStops = async (route: any, milesPerDay: number): Promise<CampingStop[]> => {
  console.log('Calculating camping stops with miles per day:', milesPerDay);
  
  const campingStops: CampingStop[] = [];
  const totalDistance = route.distance / 1609.34;
  
  const numStops = Math.floor(totalDistance / milesPerDay);
  
  if (numStops <= 0) return [];
  
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * milesPerDay) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    try {
      const campground = await findNearbyCampground(coordinates);
      
      if (campground) {
        campingStops.push({
          location: coordinates,
          name: campground.address,
          campgroundName: campground.name,
          distance: Math.round(progress * totalDistance),
          rating: campground.rating
        });
      }
    } catch (error) {
      console.error('Error finding campground:', error);
    }
  }

  return campingStops;
};
