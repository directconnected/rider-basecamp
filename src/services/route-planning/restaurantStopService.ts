
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
        
        // Use the provided restaurantType unless it's 'any', then use the type from the API
        let displayType = restaurantType === 'any' ? 
          (restaurant.restaurantType || 'restaurant') : 
          restaurantType;
        
        // Format the display type to be more human-readable
        displayType = displayType.replace(/_/g, ' ');
        
        console.log(`Using restaurant type for display: ${displayType}`);
        
        restaurantStops.push({
          location: coordinates,
          name: restaurant.address,
          restaurantName: restaurant.name,
          distance: Math.round(progress * totalDistance),
          rating: restaurant.rating,
          website: restaurant.website,
          phone_number: restaurant.phone_number,
          restaurantType: displayType
        });
        
        console.log(`Added restaurant stop ${i}: ${restaurant.name}`);
      }
    } catch (error) {
      console.error('Error finding restaurant:', error);
    }
  }

  console.log(`Final restaurant stops count: ${restaurantStops.length}`);
  return restaurantStops;
};
