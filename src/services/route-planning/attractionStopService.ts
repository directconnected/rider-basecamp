
import { findNearestPointIndex } from './routeUtils';
import { findNearbyAttraction } from '../placesService';
import { AttractionStop } from '@/components/route-planning/types';

export const calculateAttractionStops = async (
  route: any, 
  interval: number = 100,
  attractionType: string = 'any'
): Promise<AttractionStop[]> => {
  console.log('Calculating attraction stops every:', interval, 'miles, type:', attractionType);
  
  const attractionStops: AttractionStop[] = [];
  const totalDistance = route.distance / 1609.34;
  
  const numStops = Math.floor(totalDistance / interval);
  
  if (numStops <= 0) return [];
  
  // Type mapping for consistent comparison
  const typeMapping: Record<string, string> = {
    'museum': 'museum',
    'park': 'park',
    'tourist_attraction': 'tourist attraction',
    'amusement_park': 'amusement park',
    'art_gallery': 'art gallery',
    'historic_site': 'historic site',
    'natural_feature': 'natural attraction',
    'point_of_interest': 'point of interest'
  };
  
  // Convert the selected type to a consistent format for comparison
  const normalizedSelectedType = typeMapping[attractionType] || attractionType.replace('_', ' ');
  console.log(`Normalized selected attraction type: ${normalizedSelectedType}`);
  
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * interval) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    try {
      // Use the specific attraction type when searching for nearby attractions
      const attraction = await findNearbyAttraction(coordinates, 5000, attractionType);
      
      if (attraction) {
        console.log(`Found attraction data for stop ${i}:`, attraction);
        
        // Determine the specific attraction type from the place types
        let specificType = 'attraction';
        if (attraction.types && attraction.types.length > 0) {
          // Try to find a matching type using our mapping
          for (const type of attraction.types) {
            if (typeMapping[type]) {
              specificType = typeMapping[type];
              break;
            }
          }
        }
        
        console.log(`Attraction ${attraction.name} has specific type: ${specificType}`);
        console.log(`Comparing with selected type: ${normalizedSelectedType}`);
        
        // Only add this attraction if:
        // 1. User selected 'any', OR
        // 2. The specific type matches the normalized selected type, OR
        // 3. One of the raw types includes the selected type
        const typeMatches = 
          attractionType === 'any' || 
          specificType === normalizedSelectedType ||
          (attraction.types && attraction.types.some(type => 
            type === attractionType || 
            type.includes(attractionType) || 
            attractionType.includes(type)
          ));
        
        console.log(`Type match result for ${attraction.name}: ${typeMatches}`);
        
        if (typeMatches) {
          attractionStops.push({
            location: coordinates,
            name: attraction.address,
            attractionName: attraction.name,
            distance: Math.round(progress * totalDistance),
            rating: attraction.rating,
            website: attraction.website,
            phone_number: attraction.phone_number,
            attractionType: specificType
          });
          console.log(`Added attraction stop: ${attraction.name}`);
        } else {
          console.log(`Skipping attraction ${attraction.name} because it doesn't match type ${attractionType}`);
        }
      }
    } catch (error) {
      console.error('Error finding attraction:', error);
    }
  }

  console.log(`Final attraction stops count: ${attractionStops.length}`);
  return attractionStops;
};
