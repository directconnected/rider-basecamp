
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
        restaurant = await findNearbyRestaurant(coordinates, searchRadius, restaurantType);
        
        if (restaurant) {
          console.log(`Found restaurant data for stop ${i}:`, restaurant);
          
          // Ensure the restaurant has the requested type for UI consistency
          restaurant.restaurantType = restaurantType;
          break;
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
        restaurantType: restaurantType // Use the requested type from UI
      });
      
      console.log(`Added restaurant stop ${i}: ${restaurant.name} with type: ${restaurant.restaurantType}`);
    } else {
      console.log(`Could not find restaurant of type ${restaurantType} for stop ${i} after ${maxAttempts} attempts`);
      
      // If we can't find the specific type, try to find any restaurant
      if (restaurantType !== 'any') {
        console.log('Falling back to any restaurant type');
        try {
          const fallbackRestaurant = await findNearbyRestaurant(coordinates, 10000, 'any');
          if (fallbackRestaurant) {
            restaurantStops.push({
              location: coordinates,
              name: fallbackRestaurant.address,
              restaurantName: fallbackRestaurant.name,
              distance: Math.round(progress * totalDistance),
              rating: fallbackRestaurant.rating,
              website: fallbackRestaurant.website,
              phone_number: fallbackRestaurant.phone_number,
              restaurantType: restaurantType // Show the requested type in UI
            });
            console.log(`Added fallback restaurant stop ${i}: ${fallbackRestaurant.name}`);
          }
        } catch (error) {
          console.error('Error finding fallback restaurant:', error);
        }
      }
    }
  }

  console.log(`Final restaurant stops count: ${restaurantStops.length}`);
  
  // Ensure we have at least some restaurant results
  if (restaurantStops.length === 0) {
    console.log('No restaurants found for requested type, will try fallback search');
    return calculateRestaurantStops(route, interval, 'any');
  }
  
  // Log the restaurant types found for debugging
  if (restaurantStops.length > 0) {
    console.log('Restaurant types found:', restaurantStops.map(r => r.restaurantType));
  }
  
  return restaurantStops;
};
