
import { FuelStop } from '@/hooks/useRoutePlanning';

export const calculateFuelStops = async (route: any, fuelMileage: number): Promise<FuelStop[]> => {
  console.log('Calculating fuel stops without Places API');
  
  // Create placeholder fuel stops based on route distance and fuel mileage
  const fuelStops: FuelStop[] = [];
  
  if (!route || !route.geometry || !route.geometry.coordinates) {
    console.log('Invalid route data for fuel stop calculation');
    return [];
  }
  
  const totalDistanceInMeters = route.distance;
  const totalDistanceInMiles = totalDistanceInMeters / 1609.34;
  
  // Place fuel stops at regular intervals based on fuel mileage
  let currentMiles = fuelMileage; // First stop after tank is empty
  
  while (currentMiles < totalDistanceInMiles) {
    // Find coordinates near this mileage point
    const mileageProgress = currentMiles / totalDistanceInMiles;
    const coordinateIndex = Math.floor(mileageProgress * route.geometry.coordinates.length);
    
    if (coordinateIndex < route.geometry.coordinates.length) {
      const coords = route.geometry.coordinates[coordinateIndex];
      
      fuelStops.push({
        location: [coords[0], coords[1]],
        name: `Fuel Stop at mile ${Math.round(currentMiles)}`,
        distance: currentMiles
      });
    }
    
    currentMiles += fuelMileage;
  }
  
  return fuelStops;
};
