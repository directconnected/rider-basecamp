
import { findNearestPointIndex } from './routeUtils';
import { findNearbyLodging } from '../placesService';
import { HotelStop } from '@/components/route-planning/types';

export const calculateHotelStops = async (route: any, milesPerDay: number): Promise<HotelStop[]> => {
  console.log('Calculating hotel stops with miles per day:', milesPerDay);
  
  const hotelStops: HotelStop[] = [];
  const totalDistance = route.distance / 1609.34;
  
  const numStops = Math.floor(totalDistance / milesPerDay);
  
  console.log('Number of hotel stops needed:', numStops);
  
  if (numStops <= 0) {
    console.log('No hotel stops needed - destination within daily range');
    return [];
  }
  
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * milesPerDay) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    console.log(`Looking for hotel at stop ${i}:`, coordinates);
    
    try {
      const hotel = await findNearbyLodging(coordinates);
      
      if (hotel) {
        console.log(`Hotel data for stop ${i}:`, hotel);
        hotelStops.push({
          location: coordinates,
          name: hotel.address,
          hotelName: hotel.name,
          distance: Math.round(progress * totalDistance),
          rating: hotel.rating,
          website: hotel.website,
          phone_number: hotel.phone_number
        });
        console.log(`Added hotel stop ${i}: ${hotel.name} with website: ${hotel.website} and phone: ${hotel.phone_number}`);
      }
    } catch (error) {
      console.error(`Error processing hotel stop ${i}:`, error);
    }
  }

  return hotelStops;
};
