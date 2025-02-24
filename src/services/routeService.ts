
import mapboxgl from 'mapbox-gl';
import { getLocationName } from './mapService';
import { FuelStop } from "@/hooks/useRoutePlanning";

export const calculateFuelStops = async (route: any): Promise<FuelStop[]> => {
  const fuelStops: FuelStop[] = [];
  const totalDistance = route.distance / 1609.34; // Convert to miles
  const numStops = Math.floor(totalDistance / 200);
  
  for (let i = 1; i <= numStops; i++) {
    const progress = i / (numStops + 1);
    const coordinates = route.geometry.coordinates[
      Math.floor(progress * route.geometry.coordinates.length)
    ] as [number, number];
    
    const locationName = await getLocationName(coordinates);
    
    fuelStops.push({
      location: coordinates,
      name: `${locationName} Fuel Stop`,
      distance: progress * totalDistance
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
