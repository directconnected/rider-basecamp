import mapboxgl from 'mapbox-gl';
import { getLocationName } from './mapService';
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
    // Validate coordinates
    if (!coordinates || coordinates.length !== 2 || 
        !isFinite(coordinates[0]) || !isFinite(coordinates[1])) {
      console.error('Invalid coordinates:', coordinates);
      return null;
    }

    // Configuration for search
    const searchRadii = [5000, 10000, 15000]; // Search radii in meters
    const searchTerms = ['gas station', 'fuel', 'petrol station'];
    let station = null;

    // Try different search radii if needed
    for (const radius of searchRadii) {
      for (const term of searchTerms) {
        // Build the query URL with proper parameters
        const queryUrl = new URL('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(term) + '.json');
        queryUrl.searchParams.append('proximity', `${coordinates[1]},${coordinates[0]}`); // longitude,latitude
        queryUrl.searchParams.append('types', 'poi');
        queryUrl.searchParams.append('limit', '1');
        queryUrl.searchParams.append('access_token', mapboxgl.accessToken);
        queryUrl.searchParams.append('radius', radius.toString());

        console.log(`Trying search with term "${term}" and radius ${radius}m`);
        
        const response = await fetch(queryUrl.toString());

        if (!response.ok) {
          console.error(`Search failed for term "${term}" with radius ${radius}m:`, response.statusText);
          continue;
        }

        const data = await response.json();
        console.log(`API response for "${term}" (${radius}m radius):`, data);

        if (data.features && data.features.length > 0) {
          // Filter to ensure we have a fuel-related POI
          const fuelStation = data.features.find(feature => 
            feature.properties?.category?.toLowerCase().includes('fuel') ||
            feature.properties?.category?.toLowerCase().includes('gas') ||
            (feature.place_type?.includes('poi') && 
             feature.text?.toLowerCase().includes('gas'))
          );

          if (fuelStation) {
            station = fuelStation;
            console.log(`Found fuel station with ${radius}m radius:`, fuelStation);
            break;
          }
        }
      }
      
      if (station) break; // Stop searching if we found a station
    }

    if (!station) {
      console.log('No gas stations found near coordinates:', coordinates);
      return null;
    }

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

const findNearestHotel = async (coordinates: [number, number]): Promise<{ name: string; location: [number, number] } | null> => {
  console.log('Searching for hotels near coordinates:', coordinates);
  
  try {
    if (!coordinates || coordinates.length !== 2 || 
        !isFinite(coordinates[0]) || !isFinite(coordinates[1])) {
      console.error('Invalid coordinates for hotel search:', coordinates);
      return null;
    }

    // Configuration for search
    const searchTerms = ['hotel', 'motel', 'inn'];
    let hotel = null;

    for (const term of searchTerms) {
      const queryUrl = new URL('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(term) + '.json');
      // Keep longitude,latitude order as per Mapbox docs
      queryUrl.searchParams.append('proximity', `${coordinates[0]},${coordinates[1]}`);
      queryUrl.searchParams.append('types', 'poi');
      queryUrl.searchParams.append('limit', '5');
      queryUrl.searchParams.append('access_token', mapboxgl.accessToken);
      // Add proximity bias to heavily weight nearby results
      queryUrl.searchParams.append('proximity-bias', '1');

      console.log(`Searching for ${term} near lng:${coordinates[0]}, lat:${coordinates[1]}`);
      
      const response = await fetch(queryUrl.toString());

      if (!response.ok) {
        console.error(`Search failed for term "${term}":`, response.statusText);
        continue;
      }

      const data = await response.json();
      console.log(`API response for "${term}":`, data);

      if (data.features && data.features.length > 0) {
        // Filter to ensure we have a lodging-related POI
        const lodging = data.features.find(feature => 
          feature.properties?.category?.toLowerCase().includes('lodging') ||
          feature.properties?.category?.toLowerCase().includes('hotel') ||
          (feature.place_type?.includes('poi') && 
           (feature.text?.toLowerCase().includes('hotel') ||
            feature.text?.toLowerCase().includes('inn') ||
            feature.text?.toLowerCase().includes('motel')))
        );

        if (lodging) {
          hotel = lodging;
          console.log(`Found hotel:`, lodging);
          break;
        }
      }
    }

    if (!hotel) {
      console.log('No hotels found near coordinates:', coordinates);
      return null;
    }

    // Verify we have all required data
    if (!hotel.text || !hotel.center) {
      console.error('Invalid hotel data:', hotel);
      return null;
    }

    return {
      name: hotel.text,
      location: hotel.center as [number, number]
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
