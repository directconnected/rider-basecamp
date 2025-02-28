
import { findNearestPointIndex } from './routeUtils';
import { findNearbyRestaurant } from '../placesService';
import { RestaurantStop, RestaurantType } from '@/components/route-planning/types';

export const calculateRestaurantStops = async (
  route: any, 
  interval: number = 100,
  restaurantType: RestaurantType = 'any'
): Promise<RestaurantStop[]> => {
  console.log('Calculating restaurant stops every:', interval, 'miles, type:', restaurantType);
  
  const restaurantStops: RestaurantStop[] = [];
  const totalDistance = route.distance / 1609.34;
  
  const numStops = Math.floor(totalDistance / interval);
  
  if (numStops <= 0) return [];
  
  // Always try to find at least 3 restaurant stops
  const actualNumStops = Math.max(3, numStops);
  
  for (let i = 1; i <= actualNumStops; i++) {
    const progress = i / actualNumStops;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    // Try multiple times with increasing radius if we don't find the preferred type
    let restaurant = null;
    let attempts = 0;
    let searchRadius = 5000; // Start with 5km
    const maxAttempts = 6; // Increase max attempts to find restaurants
    
    while (!restaurant && attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1}: Finding restaurant near ${coordinates} with type ${restaurantType} and radius ${searchRadius}m`);
        
        // Only search for specific type (not any fallback) if a non-any type is requested
        if (restaurantType !== 'any') {
          restaurant = await findNearbyRestaurant(coordinates, searchRadius, restaurantType);
          
          if (restaurant) {
            console.log(`Found ${restaurantType} restaurant for stop ${i}:`, restaurant.name);
            // Ensure it has the specific requested type
            restaurant.restaurantType = restaurantType;
            break;
          }
        } else {
          // For 'any' type, just find any restaurant
          restaurant = await findNearbyRestaurant(coordinates, searchRadius, 'any');
          if (restaurant) {
            console.log(`Found any restaurant for stop ${i}:`, restaurant.name);
            break;
          }
        }
      } catch (error) {
        console.error(`Error in attempt ${attempts + 1}:`, error);
      }
      
      attempts++;
      searchRadius += 5000; // Increase radius by 5km each attempt
    }
    
    if (restaurant) {
      restaurantStops.push({
        location: coordinates,
        name: restaurant.address,
        restaurantName: restaurant.name,
        distance: Math.round(progress * totalDistance),
        rating: restaurant.rating,
        website: restaurant.website,
        phone_number: restaurant.phone_number,
        restaurantType: restaurant.restaurantType || restaurantType // Use the requested type from UI
      });
      
      console.log(`Added restaurant stop ${i}: ${restaurant.name} with type: ${restaurant.restaurantType}`);
    } else if (restaurantType !== 'any') {
      // We couldn't find the specific type, don't add a fallback for specific searches
      console.log(`Could not find restaurant of type ${restaurantType} for stop ${i} after ${maxAttempts} attempts`);
    } else {
      // For 'any' type, add a placeholder
      console.log(`Could not find any restaurant for stop ${i} after ${maxAttempts} attempts`);
      
      const placeholderName = `Restaurant near mile ${Math.round(progress * totalDistance)}`;
      restaurantStops.push({
        location: coordinates,
        name: `Near route point ${Math.round(progress * totalDistance)}`,
        restaurantName: placeholderName,
        distance: Math.round(progress * totalDistance),
        restaurantType: 'any'
      });
      console.log(`Added placeholder restaurant stop ${i}`);
    }
  }

  console.log(`Final restaurant stops count: ${restaurantStops.length}`);
  
  // If we couldn't find any restaurants of the specified type, return an empty array
  // instead of falling back to 'any'
  if (restaurantStops.length === 0 && restaurantType !== 'any') {
    console.log(`No restaurants found of type ${restaurantType}`);
    return [];
  }
  
  // Log the restaurant types found for debugging
  if (restaurantStops.length > 0) {
    console.log('Restaurant types found:', restaurantStops.map(r => r.restaurantType));
  }
  
  return restaurantStops;
};
