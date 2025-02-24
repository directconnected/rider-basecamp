
import mapboxgl from 'mapbox-gl';
import { getLocationName } from './mapService';
import { FuelStop } from "@/hooks/useRoutePlanning";

interface GasStation {
  name: string;
  address: string;
  coordinates: [number, number];
  distance: number;
}

const findNearestGasStation = async (coordinates: [number, number]): Promise<GasStation | null> => {
  console.log('Searching for gas stations near coordinates:', coordinates);
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/gas%20station.json?` + 
      `proximity=${coordinates[0]},${coordinates[1]}&` +
      `types=poi&` +
      `category=fuel&` +
      `limit=1&` +
      `access_token=${mapboxgl.accessToken}`
    );

    if (!response.ok) {
      console.error('Gas station search failed:', response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('Mapbox Places API response:', data);

    if (!data.features || data.features.length === 0) {
      console.log('No gas stations found near coordinates:', coordinates);
      return null;
    }

    const station = data.features[0];
    const result = {
      name: station.text,
      address: station.place_name,
      coordinates: station.center as [number, number],
      distance: station.properties.distance || 0
    };

    console.log('Found gas station:', result);
    return result;
  } catch (error) {
    console.error('Error finding gas station:', error);
    return null;
  }
};

export const calculateFuelStops = async (route: any, fuelMileage: number): Promise<FuelStop[]> => {
  console.log('Calculating fuel stops with mileage:', fuelMileage);
  const fuelStops: FuelStop[] = [];
  const totalDistance = route.distance / 1609.34; // Convert to miles
  
  // Calculate number of fuel stops needed based on provided fuel mileage
  // We'll stop at 80% of max range to maintain a safety buffer
  const safeRange = fuelMileage * 0.8;
  const numStops = Math.ceil(totalDistance / safeRange) - 1; // -1 because we start with a full tank
  
  console.log('Number of fuel stops needed:', numStops);
  
  if (numStops <= 0) {
    console.log('No fuel stops needed - destination within range');
    return [];
  }
  
  // Calculate evenly spaced stops
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * safeRange) / totalDistance;
    if (progress >= 1) break;
    
    const coordinates = route.geometry.coordinates[
      Math.floor(progress * route.geometry.coordinates.length)
    ] as [number, number];
    
    console.log(`Looking for gas station at stop ${i}:`, coordinates);
    
    const gasStation = await findNearestGasStation(coordinates);
    
    if (gasStation) {
      fuelStops.push({
        location: gasStation.coordinates,
        name: `${gasStation.name} - ${gasStation.address}`,
        distance: Math.round(progress * totalDistance)
      });
      console.log(`Added fuel stop ${i}:`, gasStation);
    } else {
      // Fallback to approximate location if no gas station found
      const locationName = await getLocationName(coordinates);
      fuelStops.push({
        location: coordinates,
        name: `Refueling Stop near ${locationName}`,
        distance: Math.round(progress * totalDistance)
      });
      console.log(`Added fallback fuel stop ${i} near:`, locationName);
    }
  }

  console.log('Final fuel stops:', fuelStops);
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

