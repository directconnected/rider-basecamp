
import mapboxgl from 'mapbox-gl';
import { calculateFuelStops, calculateHotelStops } from './stopCalculationService';
import { FuelStop, HotelStop } from "@/hooks/useRoutePlanning";

export { calculateFuelStops, calculateHotelStops };

export const planRoute = async (start: [number, number], end: [number, number]) => {
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
  );

  if (!response.ok) {
    throw new Error(`Route planning failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.routes[0];
};
