
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

export const findPointsOfInterest = async (route: any): Promise<PointOfInterest[]> => {
  const pois: PointOfInterest[] = [];
  const coordinates = route.geometry.coordinates;
  const totalDistance = route.distance / 1609.34; // Convert to miles
  const milesPerDay = 300; // Default miles per day
  const numDays = Math.ceil(totalDistance / milesPerDay);
  
  // Calculate sample points for each day's journey
  const samplePoints = Array.from({ length: numDays }, (_, i) => {
    const progress = (i + 0.5) / numDays; // Sample at midday for each day
    return Math.floor(coordinates.length * progress);
  });

  // Add evening stop points
  const eveningStops = Array.from({ length: numDays }, (_, i) => {
    const progress = (i + 1) / numDays;
    return Math.floor(coordinates.length * progress);
  });

  // Combine all sampling points
  const allSamplePoints = [...samplePoints, ...eveningStops];
  
  for (const pointIndex of allSamplePoints) {
    if (pointIndex >= coordinates.length) continue;
    
    const [lng, lat] = coordinates[pointIndex];
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi&limit=3&access_token=${mapboxgl.accessToken}`
      );

      if (!response.ok) continue;

      const data = await response.json();
      
      if (data.features) {
        for (const feature of data.features) {
          let type: 'restaurant' | 'hotel' | 'camping' = 'restaurant';
          
          if (feature.properties && feature.properties.category) {
            const categories = Array.isArray(feature.properties.category) 
              ? feature.properties.category 
              : [feature.properties.category];
            
            if (categories.some(cat => cat.includes('lodging'))) {
              type = 'hotel';
            } else if (categories.some(cat => cat.includes('campground'))) {
              type = 'camping';
            } else if (categories.some(cat => 
              cat.includes('restaurant') || 
              cat.includes('food') || 
              cat.includes('cafe')
            )) {
              type = 'restaurant';
            }
          }

          const progress = pointIndex / coordinates.length;
          const distanceFromStart = Math.round(totalDistance * progress);

          pois.push({
            name: feature.text || 'Unknown Location',
            type,
            location: feature.center as [number, number],
            description: feature.properties?.description || 
                        `${feature.text} (${distanceFromStart} miles from start)`
          });
        }
      }
    } catch (error) {
      console.error('Error fetching POIs:', error);
      continue;
    }
  }

  const uniquePois = pois.filter((poi, index, self) =>
    index === self.findIndex((p) => p.name === poi.name)
  );

  // Limit to 12 suggestions (2 per day: midday and evening)
  const finalPois = uniquePois.slice(0, Math.min(12, numDays * 2));
  console.log('Found POIs:', finalPois);
  return finalPois;
};
