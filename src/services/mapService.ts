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
  
  if (!mapboxgl.accessToken) {
    console.error('Mapbox token not initialized');
    return [];
  }
  
  // Sample fewer points to get major cities/locations along route
  const numSamplePoints = Math.min(numDays + 1, 8);
  const step = Math.floor(coordinates.length / numSamplePoints);
  
  for (let i = 1; i < numSamplePoints - 1; i++) {
    const pointIndex = i * step;
    const [lng, lat] = coordinates[pointIndex];
    
    try {
      // Get places near this point
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
        `types=place&` + // Only get actual cities/places
        `limit=1&` + // Get the nearest major place
        `access_token=${mapboxgl.accessToken}`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const place = data.features[0];
        const progress = pointIndex / coordinates.length;
        const distanceFromStart = Math.round(totalDistance * progress);

        // Default to restaurant since we don't have actual business type data
        // This represents a potential stop in a major city
        pois.push({
          name: place.text,
          type: 'restaurant',
          location: place.center as [number, number],
          description: `${place.place_name} (${distanceFromStart} miles from start)`
        });
      }
    } catch (error) {
      console.error(`Error fetching location for point ${i}:`, error);
      continue;
    }
  }

  // No need to remove duplicates since we're using unique places
  return pois;
};
