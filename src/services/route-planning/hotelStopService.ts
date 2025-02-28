
import { HotelStop } from '@/components/route-planning/types';

export const calculateHotelStops = async (
  route: any, 
  milesPerDay: number,
  preferredLodgingType: string = 'any'
): Promise<HotelStop[]> => {
  console.log('Calculating hotel stops without Places API');
  
  const hotelStops: HotelStop[] = [];
  
  if (!route || !route.geometry || !route.geometry.coordinates) {
    console.log('Invalid route data for hotel stop calculation');
    return [];
  }
  
  const totalDistanceInMeters = route.distance;
  const totalDistanceInMiles = totalDistanceInMeters / 1609.34;
  
  // Place hotel stops at regular intervals based on miles per day
  let currentMiles = milesPerDay; // First stop after a day of driving
  
  while (currentMiles < totalDistanceInMiles) {
    // Find coordinates near this mileage point
    const mileageProgress = currentMiles / totalDistanceInMiles;
    const coordinateIndex = Math.floor(mileageProgress * route.geometry.coordinates.length);
    
    if (coordinateIndex < route.geometry.coordinates.length) {
      const coords = route.geometry.coordinates[coordinateIndex];
      
      const name = preferredLodgingType === 'campground' 
        ? `Campground at mile ${Math.round(currentMiles)}`
        : `Accommodation at mile ${Math.round(currentMiles)}`;
      
      hotelStops.push({
        location: [coords[0], coords[1]],
        name: name,
        hotelName: name,
        distance: currentMiles,
        rating: 4.0,
        lodgingType: preferredLodgingType
      });
    }
    
    currentMiles += milesPerDay;
  }
  
  return hotelStops;
};
