
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
  const mockPOIs: PointOfInterest[] = [
    {
      name: "Mountain View Campground",
      type: "camping",
      location: [-98.5795, 39.8283],
      description: "Beautiful campground with full RV hookups and tent sites."
    },
    {
      name: "Roadside Diner",
      type: "restaurant",
      location: [-98.5795, 39.8283],
      description: "Classic American diner serving breakfast all day."
    },
    {
      name: "Comfort Inn",
      type: "hotel",
      location: [-98.5795, 39.8283],
      description: "Clean, comfortable rooms with free breakfast."
    }
  ];
  return mockPOIs;
};
