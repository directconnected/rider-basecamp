
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
  
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * interval) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    try {
      const attraction = await findNearbyAttraction(coordinates, 5000, attractionType);
      
      if (attraction) {
        console.log(`Attraction data for stop ${i}:`, attraction);
        
        // Determine more specific attraction type from the place types
        let specificType = attractionType;
        if (attraction.types && attraction.types.length > 0) {
          // Map Google Places types to more user-friendly labels
          const typeMapping: Record<string, string> = {
            'museum': 'museum',
            'art_gallery': 'art gallery',
            'park': 'park',
            'amusement_park': 'amusement park',
            'tourist_attraction': 'tourist attraction',
            'church': 'church',
            'place_of_worship': 'place of worship',
            'historic_site': 'historic site',
            'natural_feature': 'natural attraction',
            'zoo': 'zoo',
            'aquarium': 'aquarium',
            'stadium': 'stadium',
            'library': 'library',
            'campground': 'campground',
            'point_of_interest': 'point of interest'
          };
          
          // Try to find a more specific type
          for (const type of attraction.types) {
            if (typeMapping[type]) {
              specificType = typeMapping[type];
              break;
            }
          }
        }
        
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
        console.log(`Added attraction stop ${i}: ${attraction.name} with website: ${attraction.website} and phone: ${attraction.phone_number}`);
      }
    } catch (error) {
      console.error('Error finding attraction:', error);
    }
  }

  return attractionStops;
};
