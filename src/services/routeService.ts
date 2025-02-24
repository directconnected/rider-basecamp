
import mapboxgl from 'mapbox-gl';
import { getLocationName } from './mapService';
import { FuelStop } from "@/hooks/useRoutePlanning";

export const calculateFuelStops = async (route: any, fuelMileage: number): Promise<FuelStop[]> => {
  const fuelStops: FuelStop[] = [];
  const totalDistance = route.distance / 1609.34; // Convert to miles
  
  // Calculate number of fuel stops needed based on provided fuel mileage
  // We'll stop at 80% of max range to maintain a safety buffer
  const safeRange = fuelMileage * 0.8;
  const numStops = Math.ceil(totalDistance / safeRange) - 1; // -1 because we start with a full tank
  
  if (numStops <= 0) {
    return []; // No fuel stops needed if the destination is within range
  }
  
  // Calculate evenly spaced stops
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * safeRange) / totalDistance;
    if (progress >= 1) break; // Don't add stops beyond the destination
    
    const coordinates = route.geometry.coordinates[
      Math.floor(progress * route.geometry.coordinates.length)
    ] as [number, number];
    
    const locationName = await getLocationName(coordinates);
    
    fuelStops.push({
      location: coordinates,
      name: `Refueling Stop near ${locationName}`,
      distance: Math.round(progress * totalDistance)
    });
  }

  return fuelStops;
};

export const planRoute = async (start: [number, number], end: [number, number]) => {
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
  );

  if (!response.ok) {
    throw new Error(`Route planning failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.routes[0];
};
