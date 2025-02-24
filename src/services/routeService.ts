
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
    // Swap coordinates for Mapbox API (it expects longitude,latitude)
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/gas%20station.json?` + 
      `proximity=${coordinates[1]},${coordinates[0]}&` + // Swapped order here
      `types=poi&` +
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
    
    // Verify we have all required data
    if (!station.text || !station.place_name || !station.center) {
      console.error('Invalid station data:', station);
      return null;
    }

    const result = {
      name: station.text,
      address: station.place_name,
      coordinates: station.center as [number, number],
      distance: station.properties?.distance || 0
    };

    console.log('Found gas station:', result);
    return result;
  } catch (error) {
    console.error('Error finding gas station:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return null;
  }
};

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
    } catch (error) {
      console.error(`Error processing stop ${i}:`, error);
      // Still add a fallback stop in case of error
      const locationName = await getLocationName(coordinates);
      fuelStops.push({
        location: coordinates,
        name: `Refueling Stop near ${locationName}`,
        distance: Math.round(progress * totalDistance)
      });
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

