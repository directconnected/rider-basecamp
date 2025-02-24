import mapboxgl from 'mapbox-gl';
import { getLocationName } from './mapService';
import { findNearbyGasStation, findNearbyLodging } from './placesService';
import { FuelStop, HotelStop } from "@/hooks/useRoutePlanning";

interface GasStation {
  name: string;
  address: string;
  coordinates: [number, number];
  distance: number;
}

const findNearestGasStation = async (coordinates: [number, number]): Promise<GasStation | null> => {
  console.log('Searching for gas stations near coordinates:', coordinates);
  
  try {
    if (!coordinates || coordinates.length !== 2 || 
        !isFinite(coordinates[0]) || !isFinite(coordinates[1])) {
      console.error('Invalid coordinates:', coordinates);
      return null;
    }

    const station = await findNearbyGasStation(coordinates);
    
    if (!station) {
      console.log('No gas stations found near coordinates:', coordinates);
      return null;
    }

    return {
      name: station.name,
      address: station.address,
      coordinates: station.location,
      distance: 0 // We'll calculate this if needed
    };
  } catch (error) {
    console.error('Error finding gas station:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return null;
  }
};

const findNearestHotel = async (coordinates: [number, number]): Promise<{ name: string; location: [number, number] } | null> => {
  console.log('Searching for hotels near coordinates:', coordinates);
  
  try {
    if (!coordinates || coordinates.length !== 2 || 
        !isFinite(coordinates[0]) || !isFinite(coordinates[1])) {
      console.error('Invalid coordinates for hotel search:', coordinates);
      return null;
    }

    const hotel = await findNearbyLodging(coordinates);

    if (!hotel) {
      console.log('No hotels found near coordinates:', coordinates);
      return null;
    }

    return {
      name: hotel.name,
      location: hotel.location
    };
  } catch (error) {
    console.error('Error finding hotel:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return null;
  }
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

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
      fuelStops.push({
        location: coordinates,
        name: `Near ${locationName}`,
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
      const hotel = await findNearestHotel(coordinates);
      
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
