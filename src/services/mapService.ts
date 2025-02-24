
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
  const pois: PointOfInterest[] = [];
  const coordinates = route.geometry.coordinates;
  const totalDistance = route.distance / 1609.34; // Convert to miles
  const numDays = Math.ceil(totalDistance / milesPerDay);
  
  console.log('Finding POIs for route:', {
    totalDistance,
    milesPerDay,
    numDays,
    totalCoordinates: coordinates.length
  });
  
  // Sample fewer points to avoid rate limiting
  const numSamplePoints = Math.min(numDays * 2, 10); // Max 10 sample points
  const step = Math.floor(coordinates.length / numSamplePoints);
  
  for (let i = 1; i < numSamplePoints - 1; i++) {
    const pointIndex = i * step;
    const [lng, lat] = coordinates[pointIndex];
    
    try {
      console.log(`Searching POIs near: ${lng},${lat}`);
      
      // Query with expanded search radius and specific POI types
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
        `types=poi&limit=10&` +
        `proximity=${lng},${lat}&` +
        `radius=10000&` + // 10km radius
        `access_token=${mapboxgl.accessToken}`
      );

      if (!response.ok) {
        console.error('Mapbox API error:', await response.text());
        continue;
      }

      const data = await response.json();
      console.log('Mapbox response:', data);
      
      if (data.features && data.features.length > 0) {
        for (const feature of data.features) {
          // Skip features without a name
          if (!feature.text && !feature.place_name) continue;

          // Default to restaurant if no clear category is found
          let type: 'restaurant' | 'hotel' | 'camping' = 'restaurant';
          
          const categories = [
            ...(feature.properties?.category || []),
            ...(feature.properties?.categories || []),
            feature.place_type,
            feature.properties?.type
          ].flat().filter(Boolean).map(cat => String(cat).toLowerCase());

          if (categories.some(cat => 
            cat.includes('lodging') || 
            cat.includes('hotel') || 
            cat.includes('motel') ||
            cat.includes('inn')
          )) {
            type = 'hotel';
          } else if (categories.some(cat => 
            cat.includes('camp') || 
            cat.includes('rv') ||
            cat.includes('outdoor')
          )) {
            type = 'camping';
          } else if (categories.some(cat => 
            cat.includes('restaurant') || 
            cat.includes('food') || 
            cat.includes('cafe') ||
            cat.includes('dining') ||
            cat.includes('bar')
          )) {
            type = 'restaurant';
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
      console.error('Error fetching POIs:', error);
      continue;
    }
  }

  // Remove duplicates and sort by type
  const uniquePois = pois.filter((poi, index, self) =>
    index === self.findIndex((p) => (
      p.name === poi.name && p.type === poi.type
    ))
  );

  // Sort POIs to ensure a good mix of types
  const sortedPois = uniquePois.sort((a, b) => {
    if (a.type === b.type) return 0;
    if (a.type === 'hotel') return -1;
    if (b.type === 'hotel') return 1;
    if (a.type === 'camping') return -1;
    if (b.type === 'camping') return 1;
    return 0;
  });

  console.log('Found POIs before filtering:', sortedPois);

  // Take the top N suggestions, ensuring at least one of each type if available
  const finalPois: PointOfInterest[] = [];
  const typeCounts = { hotel: 0, camping: 0, restaurant: 0 };
  const maxPerType = Math.ceil(Math.min(12, numDays * 2) / 3);

  for (const poi of sortedPois) {
    if (typeCounts[poi.type] < maxPerType) {
      finalPois.push(poi);
      typeCounts[poi.type]++;
    }
    
    if (Object.values(typeCounts).reduce((a, b) => a + b) >= Math.min(12, numDays * 2)) {
      break;
    }
  }

  console.log('Final POIs:', finalPois);
  return finalPois;
};
