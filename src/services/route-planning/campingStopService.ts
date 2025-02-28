
import { findNearestPointIndex } from './routeUtils';
import { findNearbyCampground } from '../placesService';
import { CampingStop } from '@/components/route-planning/types';

export const calculateCampingStops = async (
  route: any, 
  interval: number = 200
): Promise<CampingStop[]> => {
  console.log('Calculating camping stops every:', interval, 'miles');
  
  const campingStops: CampingStop[] = [];
  const totalDistance = route.distance / 1609.34;
  
  const numStops = Math.floor(totalDistance / interval);
  
  if (numStops <= 0) return [];
  
  // Always try to find at least 3 camping stops
  const actualNumStops = Math.max(3, numStops);
  
  for (let i = 1; i <= actualNumStops; i++) {
    const progress = i / actualNumStops;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    // Try multiple times with increasing radius
    let campground = null;
    let attempts = 0;
    let searchRadius = 10000; // Start with 10km - campgrounds are often further from main routes
    const maxAttempts = 6;
    
    while (!campground && attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1}: Finding campground near ${coordinates} with radius ${searchRadius}m`);
        campground = await findNearbyCampground(coordinates, searchRadius);
        
        if (campground) {
          console.log(`Found campground data for stop ${i}:`, campground);
          break;
        }
      } catch (error) {
        console.error(`Error in attempt ${attempts + 1}:`, error);
      }
      
      attempts++;
      searchRadius += 10000; // Increase radius by 10km each attempt
    }
    
    if (campground) {
      campingStops.push({
        location: coordinates,
        name: campground.address,
        campgroundName: campground.name,
        distance: Math.round(progress * totalDistance),
        rating: campground.rating,
        website: campground.website,
        phone_number: campground.phone_number,
        campingType: 'campground'
      });
      
      console.log(`Added campground stop ${i}: ${campground.name}`);
    } else {
      console.log(`Could not find campground for stop ${i} after ${maxAttempts} attempts`);
      
      // Create a placeholder campground if none was found
      const placeholderName = `Campground near mile ${Math.round(progress * totalDistance)}`;
      campingStops.push({
        location: coordinates,
        name: `Near route point ${Math.round(progress * totalDistance)}`,
        campgroundName: placeholderName,
        distance: Math.round(progress * totalDistance),
        campingType: 'campground'
      });
      console.log(`Added placeholder campground stop ${i}`);
    }
  }

  console.log(`Final camping stops count: ${campingStops.length}`);
  return campingStops;
};
