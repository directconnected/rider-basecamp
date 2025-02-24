
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GasPump } from "lucide-react";

interface RouteMapProps {
  startCoords: [number, number];
  endCoords: [number, number];
  route: any;
  fuelStops: Array<{
    location: [number, number];
    name: string;
    distance: number;
  }>;
}

const RouteMap = ({ startCoords, endCoords, route, fuelStops }: RouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: startCoords,
      zoom: 9
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add the route line
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
          'line-color': '#3b82f6',
          'line-width': 4
        }
      });

      // Add start and end markers
      new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat(startCoords)
        .setPopup(new mapboxgl.Popup().setHTML("<p>Start</p>"))
        .addTo(map.current);

      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(endCoords)
        .setPopup(new mapboxgl.Popup().setHTML("<p>Destination</p>"))
        .addTo(map.current);

      // Add fuel stop markers
      fuelStops.forEach((stop) => {
        new mapboxgl.Marker({ color: '#f59e0b' })
          .setLngLat(stop.location)
          .setPopup(new mapboxgl.Popup().setHTML(
            `<p>${stop.name}</p><p>Distance: ${Math.round(stop.distance)} miles</p>`
          ))
          .addTo(map.current!);
      });

      // Fit the map to show the entire route
      const bounds = new mapboxgl.LngLatBounds()
        .extend(startCoords)
        .extend(endCoords);

      fuelStops.forEach(stop => {
        bounds.extend(stop.location);
      });

      map.current.fitBounds(bounds, {
        padding: 50
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [startCoords, endCoords, route, fuelStops]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GasPump className="h-5 w-5 text-theme-600" />
          Route Map & Fuel Stops
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapContainer} className="w-full h-[400px] rounded-lg overflow-hidden" />
      </CardContent>
    </Card>
  );
};

export default RouteMap;
