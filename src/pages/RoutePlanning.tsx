import React, { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Compass, MapPin, Clock, Calendar, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Breadcrumbs from "@/components/Breadcrumbs";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

interface PointOfInterest {
  name: string;
  type: 'restaurant' | 'hotel' | 'camping';
  location: [number, number];
  description: string;
}

const RoutePlanning = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    startPoint: "",
    destination: "",
    startDate: "",
    duration: "1"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PointOfInterest[]>([]);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        console.log("Edge function response:", data, error);

        if (error) {
          console.error('Edge function error:', error);
          throw error;
        }
        
        if (!data?.token) {
          console.error('No token in response:', data);
          throw new Error('No token returned from edge function');
        }

        mapboxgl.accessToken = data.token;
        console.log("Mapbox token set:", !!mapboxgl.accessToken);

        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-98.5795, 39.8283],
          zoom: 3
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      } catch (error) {
        console.error('Map initialization error:', error);
        toast({
          title: "Map Error",
          description: "Could not initialize the map. Please try again later.",
          variant: "destructive"
        });
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [toast]);

  const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
    try {
      console.log("Geocoding location:", location, "Token:", !!mapboxgl.accessToken);

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
      console.log("Geocoding response:", data);

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

  const planRoute = async () => {
    setIsLoading(true);
    try {
      if (!mapboxgl.accessToken) {
        throw new Error('Mapbox token not initialized');
      }

      const startCoords = await geocodeLocation(formData.startPoint);
      const endCoords = await geocodeLocation(formData.destination);

      if (!startCoords || !endCoords) {
        toast({
          title: "Location Error",
          description: "Could not find one or both locations. Please check your input and try again.",
          variant: "destructive"
        });
        return;
      }

      console.log("Fetching route for coordinates:", startCoords, endCoords);

      const routeResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      if (!routeResponse.ok) {
        throw new Error(`Route planning failed: ${routeResponse.status} ${routeResponse.statusText}`);
      }

      const routeData = await routeResponse.json();
      console.log("Route data:", routeData);

      if (routeData.routes && routeData.routes.length > 0) {
        const route = routeData.routes[0];

        if (map.current) {
          if (map.current.getSource('route')) {
            (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            });
          } else {
            map.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: route.geometry
              }
            });

            map.current.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#0084ff',
                'line-width': 4
              }
            });
          }

          const coordinates = route.geometry.coordinates;
          const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: number[]) => {
            return bounds.extend(coord as mapboxgl.LngLatLike);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

          map.current.fitBounds(bounds, {
            padding: 50
          });
        }

        const pois = await findPointsOfInterest(route);
        setSuggestions(pois);

        toast({
          title: "Route Planned",
          description: "Your route has been planned and points of interest have been found.",
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
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-theme-600" />
                    Plan Your Route
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Starting Point</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter starting location"
                        value={formData.startPoint}
                        onChange={(e) => setFormData(prev => ({ ...prev, startPoint: e.target.value }))}
                      />
                      <Button variant="outline" size="icon">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Destination</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter destination"
                        value={formData.destination}
                        onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                      />
                      <Button variant="outline" size="icon">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date</label>
                      <div className="flex gap-2">
                        <Input 
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                        <Button variant="outline" size="icon">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration (Days)</label>
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          placeholder="Days" 
                          min="1"
                          value={formData.duration}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        />
                        <Button variant="outline" size="icon">
                          <Clock className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={planRoute}
                    disabled={isLoading}
                  >
                    {isLoading ? "Planning Route..." : "Plan Route"}
                  </Button>
                </CardContent>
              </Card>

              {suggestions.length > 0 && (
                <Card className="mt-8 mb-12">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-theme-600" />
                      Suggested Stops
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {suggestions.map((poi, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h3 className="font-semibold">{poi.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">Type: {poi.type}</p>
                          <p className="text-sm text-gray-600">{poi.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RoutePlanning;
