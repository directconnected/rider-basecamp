
import { findNearestPointIndex } from './routeUtils';
import { findNearbyLodging } from '../placesService';
import { HotelStop } from '@/components/route-planning/types';

export const calculateHotelStops = async (
  route: any, 
  milesPerDay: number,
  preferredLodgingType: string = 'any'
): Promise<HotelStop[]> => {
  console.log('Calculating hotel stops with miles per day:', milesPerDay, 'preferred type:', preferredLodgingType);
  
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
    
    console.log(`Looking for lodging of type ${preferredLodgingType} at stop ${i}:`, coordinates);
    
    // Try multiple times with increasing radius if we don't find the preferred type
    let hotel = null;
    let attempts = 0;
    let searchRadius = 5000; // Start with 5km
    const maxAttempts = preferredLodgingType === 'any' ? 3 : 5; // Try harder for specific types
    
    while (!hotel && attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1}: Searching with radius ${searchRadius}m`);
        hotel = await findNearbyLodging(coordinates, searchRadius, preferredLodgingType);
        
        if (hotel) {
          // Check if the lodging type matches our preference
          if (preferredLodgingType === 'any' || hotel.lodgingType === preferredLodgingType) {
            console.log(`Found matching lodging: ${hotel.name} with type: ${hotel.lodgingType}`);
            break;
          } else {
            console.log(`Found lodging ${hotel.name} but type ${hotel.lodgingType} doesn't match requested ${preferredLodgingType}, trying again`);
            hotel = null; // Reset and try again
          }
        }
      } catch (error) {
        console.error(`Error in attempt ${attempts + 1}:`, error);
      }
      
      attempts++;
      searchRadius += 5000; // Increase radius by 5km each attempt
    }
    
    if (hotel) {
      console.log(`Found lodging for stop ${i}:`, hotel);
      hotelStops.push({
        location: coordinates,
        name: hotel.address,
        hotelName: hotel.name,
        distance: Math.round(progress * totalDistance),
        rating: hotel.rating,
        website: hotel.website,
        phone_number: hotel.phone_number,
        lodgingType: hotel.lodgingType
      });
      console.log(`Added hotel stop ${i}: ${hotel.name} with type: ${hotel.lodgingType}`);
    } else {
      console.error(`Could not find lodging of type ${preferredLodgingType} after ${maxAttempts} attempts`);
    }
  }

  console.log(`Final hotel stops count: ${hotelStops.length}`);
  
  // Log all hotel types for debugging
  if (hotelStops.length > 0) {
    console.log('Hotel types found:', hotelStops.map(h => h.lodgingType));
  }

  return hotelStops;
};
