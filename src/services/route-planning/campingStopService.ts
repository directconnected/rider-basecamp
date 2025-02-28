
import { findNearestPointIndex } from './routeUtils';
import { findNearbyCampground } from '../placesService';
import { CampingStop } from '@/components/route-planning/types';

export const calculateCampingStops = async (
  route: any, 
  milesPerDay: number, 
  campingType: string = 'any'
): Promise<CampingStop[]> => {
  console.log('Calculating camping stops with miles per day:', milesPerDay, 'camping type:', campingType);
  
  const campingStops: CampingStop[] = [];
  const totalDistance = route.distance / 1609.34;
  
  const numStops = Math.floor(totalDistance / milesPerDay);
  
  if (numStops <= 0) return [];
  
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * milesPerDay) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    // Try multiple times with increasing radius
    let campground = null;
    let attempts = 0;
    let searchRadius = 10000; // Start with 10km for campgrounds (they're more spread out)
    const maxAttempts = 3;
    
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
      searchRadius += 10000; // Increase radius by 10km each attempt for campgrounds
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
        campingType: campingType
      });
      console.log(`Added campground stop ${i}: ${campground.name}`);
    } else {
      console.log(`Could not find campground for stop ${i} after ${maxAttempts} attempts`);
    }
  }

  console.log(`Final camping stops count: ${campingStops.length}`);
  
  return campingStops;
};
