
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
    
    try {
      console.log(`Finding restaurant near ${coordinates} with type ${restaurantType}`);
      const restaurant = await findNearbyRestaurant(coordinates, 5000, restaurantType);
      
      if (restaurant) {
        console.log(`Found restaurant data for stop ${i}:`, restaurant);
        
        // Only add this restaurant if it's the requested type or if we requested "any"
        if (restaurantType === 'any' || restaurant.restaurantType === restaurantType) {
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
          
          console.log(`Added restaurant stop ${i}: ${restaurant.name} with type ${restaurant.restaurantType}`);
        } else {
          console.log(`Skipped restaurant ${restaurant.name} because type ${restaurant.restaurantType} doesn't match requested type ${restaurantType}`);
        }
      }
    } catch (error) {
      console.error('Error finding restaurant:', error);
    }
  }

  console.log(`Final restaurant stops count: ${restaurantStops.length}`);
  
  // Log the restaurant types found for debugging
  if (restaurantStops.length > 0) {
    console.log('Restaurant types found:', restaurantStops.map(r => r.restaurantType));
  }
  
  return restaurantStops;
};
