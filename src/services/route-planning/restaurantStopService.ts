
import { findNearestPointIndex } from './routeUtils';
import { findNearbyRestaurant } from '../placesService';
import { RestaurantStop } from '@/components/route-planning/types';

export const calculateRestaurantStops = async (
  route: any, 
  milesPerMeal: number = 150, 
  restaurantType: string = 'any'
): Promise<RestaurantStop[]> => {
  console.log('Calculating restaurant stops every:', milesPerMeal, 'miles, type:', restaurantType);
  
  const restaurantStops: RestaurantStop[] = [];
  const totalDistance = route.distance / 1609.34;
  
  const numStops = Math.floor(totalDistance / milesPerMeal);
  
  if (numStops <= 0) return [];
  
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * milesPerMeal) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    try {
      const restaurant = await findNearbyRestaurant(coordinates, 5000, restaurantType);
      
      if (restaurant) {
        console.log(`Restaurant data for stop ${i}:`, restaurant);
        
        // Ensure we're getting the actual restaurant type from the API
        const actualRestaurantType = restaurant.restaurantType || 'restaurant';
        console.log(`Restaurant type for ${restaurant.name}: ${actualRestaurantType}`);
        
        restaurantStops.push({
          location: coordinates,
          name: restaurant.address,
          restaurantName: restaurant.name,
          distance: Math.round(progress * totalDistance),
          rating: restaurant.rating,
          website: restaurant.website,
          phone_number: restaurant.phone_number,
          restaurantType: actualRestaurantType // Use the actual type returned from the API
        });
        
        console.log(`Added restaurant stop ${i} with type: ${actualRestaurantType}`);
      }
    } catch (error) {
      console.error('Error finding restaurant:', error);
    }
  }

  return restaurantStops;
};
