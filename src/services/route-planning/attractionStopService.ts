
import { AttractionStop, AttractionType } from '@/components/route-planning/types';

export const calculateAttractionStops = async (
  route: any, 
  interval: number = 100,
  attractionType: AttractionType = 'any'
): Promise<AttractionStop[]> => {
  console.log(`Calculating attraction stops without Places API (type: ${attractionType})`);
  
  const attractionStops: AttractionStop[] = [];
  
  if (!route || !route.geometry || !route.geometry.coordinates) {
    console.log('Invalid route data for attraction stop calculation');
    return [];
  }
  
  const totalDistanceInMeters = route.distance;
  const totalDistanceInMiles = totalDistanceInMeters / 1609.34;
  
  // Place attractions at regular intervals
  let currentMiles = interval / 2; // First stop halfway to the interval
  
  const getAttractionName = (index: number) => {
    switch (attractionType) {
      case 'museum':
        return `Museum at mile ${Math.round(currentMiles)}`;
      case 'park':
        return `Park at mile ${Math.round(currentMiles)}`;
      case 'landmark':
        return `Landmark at mile ${Math.round(currentMiles)}`;
      case 'any':
      default:
        const types = ['Museum', 'Park', 'Landmark', 'Viewpoint', 'Historic Site'];
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
      const name = getAttractionName(index);
      
      attractionStops.push({
        location: [coords[0], coords[1]],
        name: name,
        attractionName: name,
        distance: currentMiles,
        rating: 4.0 + (Math.random() * 1.0), // Random rating between 4.0-5.0
        attractionType: attractionType === 'any' 
          ? (['museum', 'park', 'landmark'] as AttractionType[])[index % 3]
          : attractionType
      });
    }
    
    currentMiles += interval;
    index++;
  }
  
  return attractionStops;
};
