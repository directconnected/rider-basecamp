
import React, { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Compass, MapPin, Clock, Calendar, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Breadcrumbs from "@/components/Breadcrumbs";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

  const [mapboxToken, setMapboxToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PointOfInterest[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 3
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxToken}`
      );
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

  const findPointsOfInterest = async (route: any) => {
    // This is a simplified version. In a real app, you would:
    // 1. Use the route coordinates to create a buffer
    // 2. Search for POIs within that buffer
    // 3. Filter and sort results
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
    if (!mapboxToken) {
      toast({
        title: "Mapbox token required",
        description: "Please enter your Mapbox token to use the route planning feature.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Geocode start and end points
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

      // Get route from Mapbox Directions API
      const routeResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&access_token=${mapboxToken}`
      );
      const routeData = await routeResponse.json();

      if (routeData.routes && routeData.routes.length > 0) {
        const route = routeData.routes[0];

        // Add route to map
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

          // Fit map to route bounds
          const coordinates = route.geometry.coordinates;
          const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: number[]) => {
            return bounds.extend(coord as mapboxgl.LngLatLike);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

          map.current.fitBounds(bounds, {
            padding: 50
          });
        }

        // Find points of interest along the route
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
        description: "There was an error planning your route. Please try again.",
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

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-theme-600" />
                      Plan Your Route
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!mapboxToken && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Mapbox Token</label>
                        <Input
                          placeholder="Enter your Mapbox token"
                          value={mapboxToken}
                          onChange={(e) => setMapboxToken(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Required for route planning. Get your token at mapbox.com
                        </p>
                      </div>
                    )}
                    
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
                      disabled={isLoading || !mapboxToken}
                    >
                      {isLoading ? "Planning Route..." : "Plan Route"}
                    </Button>
                  </CardContent>
                </Card>

                {suggestions.length > 0 && (
                  <Card className="mt-8">
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

              <div className="h-[600px] rounded-lg overflow-hidden">
                <div ref={mapContainer} className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RoutePlanning;
