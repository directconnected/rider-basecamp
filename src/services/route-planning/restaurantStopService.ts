
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
  
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * interval) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    // Try multiple times with increasing radius if we don't find the preferred type
    let restaurant = null;
    let attempts = 0;
    let searchRadius = 5000; // Start with 5km
    const maxAttempts = restaurantType === 'any' ? 2 : 5; // Try harder for specific types
    
    while (!restaurant && attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1}: Finding restaurant near ${coordinates} with type ${restaurantType} and radius ${searchRadius}m`);
        restaurant = await findNearbyRestaurant(coordinates, searchRadius, restaurantType);
        
        if (restaurant) {
          console.log(`Found restaurant data for stop ${i}:`, restaurant);
          
          // Only add this restaurant if it's the requested type or if we requested "any"
          if (restaurantType === 'any' || restaurant.restaurantType === restaurantType) {
            console.log(`Found matching restaurant: ${restaurant.name} with type: ${restaurant.restaurantType}`);
            break;
          } else {
            console.log(`Restaurant ${restaurant.name} has type ${restaurant.restaurantType} which doesn't match requested ${restaurantType}, trying again`);
            restaurant = null; // Reset and try again
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
        restaurantType: restaurant.restaurantType
      });
      
      console.log(`Added restaurant stop ${i}: ${restaurant.name} with type: ${restaurant.restaurantType}`);
    } else {
      console.log(`Could not find restaurant of type ${restaurantType} for stop ${i} after ${maxAttempts} attempts`);
    }
  }

  console.log(`Final restaurant stops count: ${restaurantStops.length}`);
  
  // Log the restaurant types found for debugging
  if (restaurantStops.length > 0) {
    console.log('Restaurant types found:', restaurantStops.map(r => r.restaurantType));
  }
  
  return restaurantStops;
};
