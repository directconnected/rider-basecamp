
import { CampingStop } from '@/components/route-planning/types';

export const calculateCampingStops = async (
  route: any, 
  interval: number = 200
): Promise<CampingStop[]> => {
  console.log('Calculating camping stops without Places API');
  
  const campingStops: CampingStop[] = [];
  
  if (!route || !route.geometry || !route.geometry.coordinates) {
    console.log('Invalid route data for camping stop calculation');
    return [];
  }
  
  const totalDistanceInMeters = route.distance;
  const totalDistanceInMiles = totalDistanceInMeters / 1609.34;
  
  // Place camping stops at regular intervals
  let currentMiles = interval / 2; // First stop halfway to the interval
  
  while (currentMiles < totalDistanceInMiles) {
    // Find coordinates near this mileage point
    const mileageProgress = currentMiles / totalDistanceInMiles;
    const coordinateIndex = Math.floor(mileageProgress * route.geometry.coordinates.length);
    
    if (coordinateIndex < route.geometry.coordinates.length) {
      const coords = route.geometry.coordinates[coordinateIndex];
      const name = `Campground at mile ${Math.round(currentMiles)}`;
      
      campingStops.push({
        location: [coords[0], coords[1]],
        name: name,
        campgroundName: name,
        distance: currentMiles,
        rating: 4.0 + (Math.random() * 1.0), // Random rating between 4.0-5.0
        amenities: ['Tent sites', 'Restrooms', 'Fire pits']
      });
    }
    
    currentMiles += interval;
  }
  
  return campingStops;
};
