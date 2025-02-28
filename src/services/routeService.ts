
import mapboxgl from 'mapbox-gl';
import { FuelStop, HotelStop } from "@/hooks/useRoutePlanning";
import { LodgingType } from '@/components/route-planning/types';

// Helper function to find the nearest point index along route for a given distance
const findNearestPointIndex = (coordinates: [number, number][], distance: number): number => {
  let accumulatedDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lon1, lat1] = coordinates[i];
    const [lon2, lat2] = coordinates[i + 1];
    const segmentDistance = calculateDistance(lat1, lon1, lat2, lon2);
    if (accumulatedDistance + segmentDistance >= distance) {
      return i + 1;
    }
    accumulatedDistance += segmentDistance;
  }
  return coordinates.length - 1;
};

// Calculate the distance between two points using the Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d;
}

// Plan a route between two points using Mapbox Directions API
export const planRoute = async (start: [number, number], end: [number, number]) => {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      return data.routes[0];
    } else {
      console.error("No routes found:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
};

// Calculate fuel stops along a route based on vehicle's fuel mileage
export const calculateFuelStops = async (route: any, fuelMileage: number): Promise<FuelStop[]> => {
  const totalDistanceInMeters = route.distance;
  const totalDistanceInMiles = totalDistanceInMeters / 1609.34;
  const coordinates = route.geometry.coordinates;

  const fuelStops: FuelStop[] = [];
  let currentMiles = fuelMileage;
  let lastStopIndex = 0;

  while (currentMiles < totalDistanceInMiles) {
    const stopIndex = findNearestPointIndex(coordinates, currentMiles * 1609.34);
    if (stopIndex <= lastStopIndex) continue;

    const stopCoordinates = coordinates[stopIndex];
    if (!stopCoordinates) continue;

    // Create a placeholder fuel stop (no Places API)
    fuelStops.push({
      location: [stopCoordinates[0], stopCoordinates[1]],
      name: `Fuel Stop at mile ${Math.round(currentMiles)}`,
      distance: currentMiles
    });

    lastStopIndex = stopIndex;
    currentMiles += fuelMileage;
  }

  return fuelStops;
};

// Calculate hotel/lodging stops along a route based on miles per day
export const calculateHotelStops = async (
  route: any, 
  milesPerDay: number,
  preferredLodgingType: LodgingType = 'any'
): Promise<HotelStop[]> => {
  const totalDistanceInMeters = route.distance;
  const totalDistanceInMiles = totalDistanceInMeters / 1609.34;
  const coordinates = route.geometry.coordinates;

  const hotelStops: HotelStop[] = [];
  let currentMiles = 0;
  let lastStopIndex = 0;

  console.log(`Calculate hotel stops with preferred lodging type: ${preferredLodgingType}`);

  while (currentMiles < totalDistanceInMiles) {
    currentMiles += milesPerDay;
    if (currentMiles >= totalDistanceInMiles) break;

    const stopIndex = findNearestPointIndex(coordinates, currentMiles * 1609.34);
    if (stopIndex <= lastStopIndex) continue;

    const stopCoordinates = coordinates[stopIndex];
    if (!stopCoordinates) continue;

    console.log(`Looking for ${preferredLodgingType} near mile ${currentMiles}`);
    
    // Create a placeholder hotel stop (no Places API)
    const hotelStop: HotelStop = {
      location: [stopCoordinates[0], stopCoordinates[1]],
      name: `${preferredLodgingType === 'campground' ? 'Campground' : 'Accommodation'} at mile ${Math.round(currentMiles)}`,
      hotelName: `${preferredLodgingType === 'campground' ? 'Campground' : 'Accommodation'} Area`,
      distance: currentMiles,
      rating: 4.0,
      lodgingType: preferredLodgingType
    };

    console.log(`Created placeholder lodging: ${hotelStop.name} with type: ${hotelStop.lodgingType}`);
    hotelStops.push(hotelStop);

    lastStopIndex = stopIndex;
  }

  return hotelStops;
};
