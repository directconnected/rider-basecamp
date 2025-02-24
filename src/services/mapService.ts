import mapboxgl from 'mapbox-gl';
import { supabase } from "@/integrations/supabase/client";
import { PointOfInterest } from "@/hooks/useRoutePlanning";

export const initializeMapbox = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('get-mapbox-token');
    
    if (error) {
      throw error;
    }
    
    if (!data?.token) {
      throw new Error('No token returned from edge function');
    }

    mapboxgl.accessToken = data.token;
    return true;
  } catch (error) {
    console.error('Mapbox initialization error:', error);
    return false;
  }
};

export const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
  try {
    if (!mapboxgl.accessToken) {
      throw new Error('Mapbox token not initialized');
    }

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxgl.accessToken}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return data.features[0].center;
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

export const getLocationName = async (coordinates: [number, number]): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?types=poi,place&limit=1&access_token=${mapboxgl.accessToken}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location name');
    }

    const data = await response.json();
    return data.features?.[0]?.text || data.features?.[0]?.place_name || 'Unknown Location';
  } catch (error) {
    console.error('Error getting location name:', error);
    return 'Unknown Location';
  }
};

export const findPointsOfInterest = async (route: any, milesPerDay: number): Promise<PointOfInterest[]> => {
  if (!route?.geometry?.coordinates || !Array.isArray(route.geometry.coordinates)) {
    console.error('Invalid route geometry:', route);
    return [];
  }

  const pois: PointOfInterest[] = [];
  const coordinates = route.geometry.coordinates;
  const totalDistance = route.distance / 1609.34; // Convert to miles
  const numDays = Math.ceil(totalDistance / milesPerDay);
  
  console.log('Starting POI search with params:', {
    totalDistance,
    milesPerDay,
    numDays,
    totalCoordinates: coordinates.length
  });

  if (!mapboxgl.accessToken) {
    console.error('Mapbox token not initialized');
    return [];
  }
  
  // Sample points along the route
  const numSamplePoints = Math.min(numDays * 2, 10); // Max 10 sample points
  const step = Math.floor(coordinates.length / numSamplePoints);
  
  for (let i = 1; i < numSamplePoints - 1; i++) {
    const pointIndex = i * step;
    const [lng, lat] = coordinates[pointIndex];
    
    try {
      console.log(`Searching POIs near point ${i}:`, { lng, lat });
      
      // Changed to include more place types and removed the poi type restriction
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
        `types=poi,place&` + // Simple type filter
        `limit=25&` + 
        `access_token=${mapboxgl.accessToken}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        for (const feature of data.features) {
          if (!feature.text && !feature.place_name) continue;

          const searchString = JSON.stringify(feature).toLowerCase();
          let type: 'restaurant' | 'hotel' | 'camping';

          // Simpler type determination
          if (searchString.includes('hotel') || searchString.includes('motel') || searchString.includes('lodging')) {
            type = 'hotel';
          } else if (searchString.includes('camp') || searchString.includes('park')) {
            type = 'camping';
          } else {
            type = 'restaurant'; // Default to restaurant for other POIs
          }

          const progress = pointIndex / coordinates.length;
          const distanceFromStart = Math.round(totalDistance * progress);
          const name = feature.text || feature.place_name?.split(',')[0] || 'Unknown Location';
          const fullAddress = feature.place_name || feature.text;

          pois.push({
            name,
            type,
            location: feature.center as [number, number],
            description: `${fullAddress} (${distanceFromStart} miles from start)`
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching POIs for point ${i}:`, error);
      continue;
    }
  }

  // Remove duplicates
  const uniquePois = Array.from(new Map(pois.map(poi => [poi.name, poi])).values());
  
  // Sort POIs to ensure a good mix of types (prefer hotels and camping spots)
  const sortedPois = uniquePois.sort((a, b) => {
    if (a.type === 'hotel' && b.type !== 'hotel') return -1;
    if (a.type === 'camping' && b.type !== 'camping') return -1;
    return 0;
  });

  // Limit the number of POIs
  const maxPois = Math.min(12, numDays * 2);
  return sortedPois.slice(0, maxPois);
};
