
import { RestaurantStop, RestaurantType } from '@/components/route-planning/types';

export const calculateRestaurantStops = async (
  route: any, 
  interval: number = 100,
  restaurantType: RestaurantType = 'any'
): Promise<RestaurantStop[]> => {
  console.log(`Calculating restaurant stops without Places API (type: ${restaurantType})`);
  
  const restaurantStops: RestaurantStop[] = [];
  
  if (!route || !route.geometry || !route.geometry.coordinates) {
    console.log('Invalid route data for restaurant stop calculation');
    return [];
  }
  
  const totalDistanceInMeters = route.distance;
  const totalDistanceInMiles = totalDistanceInMeters / 1609.34;
  
  // Place restaurants at regular intervals
  let currentMiles = interval / 2; // First stop halfway to the interval
  
  const getRestaurantName = (index: number) => {
    switch (restaurantType) {
      case 'fast_food':
        return `Fast Food at mile ${Math.round(currentMiles)}`;
      case 'cafe':
        return `Café at mile ${Math.round(currentMiles)}`;
      case 'fine_dining':
        return `Fine Dining at mile ${Math.round(currentMiles)}`;
      case 'any':
      default:
        const types = ['Fast Food', 'Café', 'Restaurant', 'Diner', 'Bistro'];
        return `${types[index % types.length]} at mile ${Math.round(currentMiles)}`;
    }
  };
  
  let index = 0;
  while (currentMiles < totalDistanceInMiles) {
    // Find coordinates near this mileage point
    const mileageProgress = currentMiles / totalDistanceInMiles;
    const coordinateIndex = Math.floor(mileageProgress * route.geometry.coordinates.length);
    
    if (coordinateIndex < route.geometry.coordinates.length) {
      const coords = route.geometry.coordinates[coordinateIndex];
      const name = getRestaurantName(index);
      
      restaurantStops.push({
        location: [coords[0], coords[1]],
        name: name,
        restaurantName: name,
        distance: currentMiles,
        rating: 4.0 + (Math.random() * 1.0), // Random rating between 4.0-5.0
        restaurantType: restaurantType === 'any' 
          ? (['fast_food', 'cafe', 'fine_dining'] as RestaurantType[])[index % 3]
          : restaurantType
      });
    }
    
    currentMiles += interval;
    index++;
  }
  
  return restaurantStops;
};
