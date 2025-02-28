
import { findNearestPointIndex } from './routeUtils';
import { findNearbyAttraction } from '../placesService';
import { AttractionStop, AttractionType } from '@/components/route-planning/types';

export const calculateAttractionStops = async (
  route: any, 
  interval: number = 100,
  attractionType: AttractionType = 'any'
): Promise<AttractionStop[]> => {
  console.log('Calculating attraction stops every:', interval, 'miles, type:', attractionType);
  
  const attractionStops: AttractionStop[] = [];
  const totalDistance = route.distance / 1609.34;
  
  const numStops = Math.floor(totalDistance / interval);
  
  if (numStops <= 0) return [];
  
  // Type mapping for consistent comparison
  const typeMapping: Record<string, string[]> = {
    'museum': ['museum'],
    'park': ['park'],
    'tourist_attractions': ['tourist_attraction', 'tourist'],
    'amusement_park': ['amusement_park', 'theme_park', 'water_park'],
    'art_gallery': ['art_gallery', 'art'],
    'historic_site': ['landmark', 'historic', 'historical', 'monument'],
    'natural_feature': ['natural_feature', 'natural', 'scenic'],
    'point_of_interest': ['point_of_interest'],
    'any': []
  };
  
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * interval) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    try {
      // For tourist attractions, make sure to use the right search term
      const searchType = attractionType === 'tourist_attractions' ? 'tourist_attraction' : attractionType;
      
      console.log(`Finding attraction near ${coordinates} with type ${searchType}`);
      const attraction = await findNearbyAttraction(coordinates, 5000, searchType);
      
      if (attraction) {
        console.log(`Found attraction data for stop ${i}:`, attraction);
        
        // If the search is for specific attractions (not 'any'),
        // and we're not getting that type, continue looking
        if (attractionType !== 'any') {
          let matchesType = false;
          
          // For tourist attractions special case
          if (attractionType === 'tourist_attractions') {
            matchesType = true; // They should all be tourist attractions based on our search
          } 
          // For other specific types, check if the attraction type matches
          else if (attraction.attractionType) {
            const mappedTypes = typeMapping[attractionType] || [];
            if (mappedTypes.some(type => 
              attraction.attractionType?.includes(type) || 
              (attraction.name + ' ' + attraction.address).toLowerCase().includes(type)
            )) {
              matchesType = true;
            }
          }
          
          if (!matchesType) {
            console.log(`Skipping attraction ${attraction.name} because it doesn't match type ${attractionType}`);
            continue;
          }
        }
        
        // Set the attraction type correctly for display
        let displayType = attraction.attractionType || 'attraction';
        if (attractionType === 'tourist_attractions') {
          displayType = 'tourist attraction';
        }
        
        attractionStops.push({
          location: coordinates,
          name: attraction.address,
          attractionName: attraction.name,
          distance: Math.round(progress * totalDistance),
          rating: attraction.rating,
          website: attraction.website,
          phone_number: attraction.phone_number,
          attractionType: displayType
        });
        
        console.log(`Added attraction stop ${i}: ${attraction.name} with type ${displayType}`);
      }
    } catch (error) {
      console.error('Error finding attraction:', error);
    }
  }

  console.log(`Final attraction stops count: ${attractionStops.length}`);
  return attractionStops;
};
