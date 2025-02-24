
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
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location name');
    }

    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const place = data.features.find((f: any) => 
        f.place_type.includes('place') || 
        f.place_type.includes('locality') ||
        f.place_type.includes('region')
      );
      
      return place ? place.text : 'Fuel Stop';
    }
    
    return 'Fuel Stop';
  } catch (error) {
    console.error('Error getting location name:', error);
    return 'Fuel Stop';
  }
};

export const findPointsOfInterest = async (route: any): Promise<PointOfInterest[]> => {
  const pois: PointOfInterest[] = [];
  const coordinates = route.geometry.coordinates;
  const numPoints = coordinates.length;
  
  // Sample points along the route at intervals
  const samplePoints = [
    Math.floor(numPoints * 0.25),  // 25% along route
    Math.floor(numPoints * 0.5),   // 50% along route
    Math.floor(numPoints * 0.75)   // 75% along route
  ];

  const poiTypes = ['restaurant', 'hotel', 'campground'];
  
  for (const pointIndex of samplePoints) {
    const [lng, lat] = coordinates[pointIndex];
    
    try {
      // Search for POIs around this point
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi&limit=3&access_token=${mapboxgl.accessToken}`
      );

      if (!response.ok) continue;

      const data = await response.json();
      
      if (data.features) {
        for (const feature of data.features) {
          // Determine POI type based on Mapbox category
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

          pois.push({
            name: feature.text || 'Unknown Location',
            type,
            location: feature.center as [number, number],
            description: feature.properties?.description || 
                        feature.place_name?.split(',').slice(1).join(',').trim() ||
                        `${type} near route`
          });
        }
      }
    } catch (error) {
      console.error('Error fetching POIs:', error);
      continue;
    }
  }

  // Filter to ensure we have a mix of different types and limit total suggestions
  const uniquePois = pois.filter((poi, index, self) =>
    index === self.findIndex((p) => p.name === poi.name)
  );

  const finalPois = uniquePois.slice(0, 6); // Limit to 6 suggestions
  console.log('Found POIs:', finalPois); // Debug log
  return finalPois;
};
