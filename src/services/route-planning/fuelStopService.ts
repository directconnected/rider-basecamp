
import { findNearestPointIndex } from './routeUtils';
import { findNearbyGasStation } from '../placesService';
import { FuelStop } from '@/hooks/useRoutePlanning';

export const calculateFuelStops = async (route: any, fuelMileage: number): Promise<FuelStop[]> => {
  console.log('Calculating fuel stops with mileage:', fuelMileage);
  
  const fuelStops: FuelStop[] = [];
  const totalDistance = route.distance / 1609.34; // Convert to miles
  
  const safeRange = fuelMileage * 0.8;
  const numStops = Math.ceil(totalDistance / safeRange) - 1;
  
  console.log('Number of fuel stops needed:', numStops);
  
  if (numStops <= 0) {
    console.log('No fuel stops needed - destination within range');
    return [];
  }
  
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * safeRange) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    console.log(`Looking for gas station at stop ${i}:`, coordinates);
    
    try {
      const gasStation = await findNearbyGasStation(coordinates);
      
      fuelStops.push({
        location: coordinates,
        name: gasStation ? gasStation.name : `Gas Station Stop ${i}`,
        distance: Math.round(progress * totalDistance)
      });
      console.log(`Added fuel stop ${i}`);
    } catch (error) {
      console.error(`Error processing stop ${i}:`, error);
      fuelStops.push({
        location: coordinates,
        name: `Gas Station Stop ${i}`,
        distance: Math.round(progress * totalDistance)
      });
    }
  }

  return fuelStops;
};
