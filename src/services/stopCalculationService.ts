
import { getLocationName } from './mapService';
import { findNearbyGasStation, findNearbyLodging } from './placesService';
import { FuelStop, HotelStop } from "@/hooks/useRoutePlanning";

export const calculateFuelStops = async (route: any, fuelMileage: number): Promise<FuelStop[]> => {
  console.log('Calculating fuel stops with mileage:', fuelMileage);
  console.log('Route data:', route);
  
  const fuelStops: FuelStop[] = [];
  const totalDistance = route.distance / 1609.34; // Convert to miles
  
  // Calculate number of fuel stops needed based on provided fuel mileage
  // We'll stop at 80% of max range to maintain a safety buffer
  const safeRange = fuelMileage * 0.8;
  const numStops = Math.ceil(totalDistance / safeRange) - 1; // -1 because we start with a full tank
  
  console.log('Number of fuel stops needed:', numStops);
  console.log('Safe range between stops:', safeRange);
  
  if (numStops <= 0) {
    console.log('No fuel stops needed - destination within range');
    return [];
  }
  
  // Calculate evenly spaced stops
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * safeRange) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    console.log(`Looking for gas station at stop ${i}:`, coordinates);
    console.log(`Progress: ${Math.round(progress * 100)}%, Point index: ${pointIndex}`);
    
    try {
      const locationName = await getLocationName(coordinates);
      const gasStation = await findNearbyGasStation(coordinates);
      
      if (!gasStation) {
        console.log(`No gas station found at stop ${i}, retrying with larger radius`);
      }
      
      fuelStops.push({
        location: coordinates,
        name: gasStation ? `${gasStation.name} near ${locationName}` : `Near ${locationName}`,
        distance: Math.round(progress * totalDistance)
      });
      console.log(`Added fuel stop ${i} near:`, locationName);
    } catch (error) {
      console.error(`Error processing stop ${i}:`, error);
      fuelStops.push({
        location: coordinates,
        name: `Near Unknown Location`,
        distance: Math.round(progress * totalDistance)
      });
    }
  }

  console.log('Final fuel stops:', fuelStops);
  return fuelStops;
};

export const calculateHotelStops = async (route: any, milesPerDay: number): Promise<HotelStop[]> => {
  console.log('Calculating hotel stops with miles per day:', milesPerDay);
  console.log('Route data:', route);
  
  const hotelStops: HotelStop[] = [];
  const totalDistance = route.distance / 1609.34; // Convert to miles
  
  // Calculate number of hotel stops needed
  const numStops = Math.floor(totalDistance / milesPerDay);
  
  console.log('Number of hotel stops needed:', numStops);
  
  if (numStops <= 0) {
    console.log('No hotel stops needed - destination within daily range');
    return [];
  }
  
  // Calculate evenly spaced stops
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * milesPerDay) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    console.log(`Looking for hotel at stop ${i}:`, coordinates);
    console.log(`Progress: ${Math.round(progress * 100)}%, Point index: ${pointIndex}`);
    
    try {
      const locationName = await getLocationName(coordinates);
      const hotel = await findNearbyLodging(coordinates);
      
      if (!hotel) {
        console.log(`No hotel found at stop ${i}, tried multiple search radii`);
      }
      
      hotelStops.push({
        location: coordinates,
        name: locationName,
        hotelName: hotel ? hotel.name : "No hotel found",
        distance: Math.round(progress * totalDistance)
      });
      console.log(`Added hotel stop ${i} at:`, locationName);
    } catch (error) {
      console.error(`Error processing hotel stop ${i}:`, error);
      hotelStops.push({
        location: coordinates,
        name: "Unknown Location",
        hotelName: "No hotel found",
        distance: Math.round(progress * totalDistance)
      });
    }
  }

  console.log('Final hotel stops:', hotelStops);
  return hotelStops;
};
