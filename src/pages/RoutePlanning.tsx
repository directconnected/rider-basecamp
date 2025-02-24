import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useToast } from "@/components/ui/use-toast";
import RouteForm from "@/components/route-planning/RouteForm";
import RouteDetails from "@/components/route-planning/RouteDetails";
import SuggestedStops from "@/components/route-planning/SuggestedStops";
import RouteMap from "@/components/route-planning/RouteMap";
import RouteItinerary from "@/components/route-planning/RouteItinerary";
import { supabase } from "@/integrations/supabase/client";
import mapboxgl from 'mapbox-gl';

interface PointOfInterest {
  name: string;
  type: 'restaurant' | 'hotel' | 'camping';
  location: [number, number];
  description: string;
}

interface RouteDetails {
  distance: number;
  duration: number;
  startPoint: string;
  destination: string;
}

interface FuelStop {
  location: [number, number];
  name: string;
  distance: number;
}

const RoutePlanning = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    startPoint: "",
    destination: "",
    startDate: "",
    duration: "1"
  });
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [suggestions, setSuggestions] = useState<PointOfInterest[]>([]);
  const [currentRoute, setCurrentRoute] = useState<any>(null);
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [endCoords, setEndCoords] = useState<[number, number] | null>(null);
  const [fuelStops, setFuelStops] = useState<FuelStop[]>([]);

  const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
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
      toast({
        title: "Geocoding Error",
        description: `Could not find location: ${location}. Error: ${error.message}`,
        variant: "destructive"
      });
      return null;
    }
  };

  const findPointsOfInterest = async (route: any) => {
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

  const initializeMapbox = async () => {
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
      toast({
        title: "Map Error",
        description: "Could not initialize the map service. Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  };

  const getLocationName = async (coordinates: [number, number]): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location name');
      }

      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        // Try to get a place name, then locality, then region
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

  const calculateFuelStops = async (route: any) => {
    const fuelStops: FuelStop[] = [];
    const totalDistance = route.distance / 1609.34; // Convert to miles
    const numStops = Math.floor(totalDistance / 200);
    
    for (let i = 1; i <= numStops; i++) {
      const progress = i / (numStops + 1);
      const coordinates = route.geometry.coordinates[
        Math.floor(progress * route.geometry.coordinates.length)
      ] as [number, number];
      
      const locationName = await getLocationName(coordinates);
      
      fuelStops.push({
        location: coordinates,
        name: `${locationName} Fuel Stop`,
        distance: progress * totalDistance
      });
    }

    return fuelStops;
  };

  const planRoute = async () => {
    setIsLoading(true);
    try {
      if (!mapboxgl.accessToken) {
        const initialized = await initializeMapbox();
        if (!initialized) return;
      }

      const start = await geocodeLocation(formData.startPoint);
      const end = await geocodeLocation(formData.destination);

      if (!start || !end) {
        toast({
          title: "Location Error",
          description: "Could not find one or both locations. Please check your input and try again.",
          variant: "destructive"
        });
        return;
      }

      setStartCoords(start);
      setEndCoords(end);

      const routeResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      if (!routeResponse.ok) {
        throw new Error(`Route planning failed: ${routeResponse.status} ${routeResponse.statusText}`);
      }

      const routeData = await routeResponse.json();

      if (routeData.routes && routeData.routes.length > 0) {
        const route = routeData.routes[0];
        setCurrentRoute(route);
        
        // Calculate fuel stops with actual location names
        const calculatedFuelStops = await calculateFuelStops(route);
        setFuelStops(calculatedFuelStops);

        setRouteDetails({
          distance: Math.round(route.distance / 1609.34),
          duration: Math.round(route.duration / 3600),
          startPoint: formData.startPoint,
          destination: formData.destination
        });

        const pois = await findPointsOfInterest(route);
        setSuggestions(pois);

        toast({
          title: "Route Planned",
          description: "Your route has been planned with named fuel stops added every 200 miles.",
        });
      }
    } catch (error) {
      console.error("Route planning error:", error);
      toast({
        title: "Error",
        description: `There was an error planning your route: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormDataChange = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Route Planning
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Plan your next motorcycle adventure
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <RouteForm 
                formData={formData}
                isLoading={isLoading}
                onFormDataChange={handleFormDataChange}
                onPlanRoute={planRoute}
              />
              
              {routeDetails && startCoords && endCoords && currentRoute && (
                <>
                  <RouteDetails 
                    startPoint={routeDetails.startPoint}
                    destination={routeDetails.destination}
                    distance={routeDetails.distance}
                    duration={routeDetails.duration}
                  />
                  <RouteMap
                    startCoords={startCoords}
                    endCoords={endCoords}
                    route={currentRoute}
                    fuelStops={fuelStops}
                  />
                  <RouteItinerary
                    startPoint={routeDetails.startPoint}
                    destination={routeDetails.destination}
                    distance={routeDetails.distance}
                    duration={routeDetails.duration}
                    fuelStops={fuelStops}
                  />
                </>
              )}

              <SuggestedStops suggestions={suggestions} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RoutePlanning;
