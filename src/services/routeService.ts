
import mapboxgl from 'mapbox-gl';
import { findNearbyGasStation, findNearbyLodging } from "./placesService";
import { FuelStop, HotelStop } from "@/hooks/useRoutePlanning";
import { LodgingType } from '@/components/route-planning/types';

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

    const gasStation = await findNearbyGasStation([stopCoordinates[0], stopCoordinates[1]]);
    if (gasStation) {
      fuelStops.push({
        location: gasStation.location,
        name: gasStation.name,
        distance: currentMiles
      });
    }

    lastStopIndex = stopIndex;
    currentMiles += fuelMileage;
  }

  return fuelStops;
};

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
  let maxAttempts = 10; // Maximum number of attempts to find a matching lodging

  console.log(`Calculate hotel stops with preferred lodging type: ${preferredLodgingType}`);

  while (currentMiles < totalDistanceInMiles) {
    currentMiles += milesPerDay;
    if (currentMiles >= totalDistanceInMiles) break;

    const stopIndex = findNearestPointIndex(coordinates, currentMiles * 1609.34);
    if (stopIndex <= lastStopIndex) continue;

    const stopCoordinates = coordinates[stopIndex];
    if (!stopCoordinates) continue;

    console.log(`Looking for ${preferredLodgingType} near mile ${currentMiles}`);
    
    // Try multiple times with increasing radius if we don't find the preferred type
    let hotel = null;
    let attempts = 0;
    let searchRadius = 5000; // Start with 5km
    
    while (!hotel && attempts < maxAttempts) {
      hotel = await findNearbyLodging(
        [stopCoordinates[0], stopCoordinates[1]], 
        searchRadius, 
        preferredLodgingType
      );
      
      if (hotel) {
        // Check if the lodging type matches our preference
        if (preferredLodgingType === 'any' || hotel.lodgingType === preferredLodgingType) {
          console.log(`Found matching lodging: ${hotel.name} with type: ${hotel.lodgingType}`);
          break;
        } else {
          console.log(`Found lodging ${hotel.name} but type ${hotel.lodgingType} doesn't match requested ${preferredLodgingType}, trying again`);
          hotel = null; // Reset and try again
        }
      }
      
      attempts++;
      searchRadius += 5000; // Increase radius by 5km each attempt
      console.log(`Attempt ${attempts}: Increasing search radius to ${searchRadius}m`);
    }
    
    if (hotel) {
      console.log(`Found lodging: ${hotel.name} with rating: ${hotel.rating}, type: ${hotel.lodgingType}`);
      hotelStops.push({
        location: hotel.location,
        name: hotel.address,
        hotelName: hotel.name,
        distance: currentMiles,
        rating: hotel.rating,
        website: hotel.website,
        phone_number: hotel.phone_number,
        lodgingType: hotel.lodgingType
      });
    } else {
      console.log(`Could not find ${preferredLodgingType} after ${maxAttempts} attempts, moving to next stop`);
    }

    lastStopIndex = stopIndex;
  }

  return hotelStops;
};
