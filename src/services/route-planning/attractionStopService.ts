
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
  const typeMapping: Record<string, string[]> = {
    'museum': ['museum'],
    'park': ['park'],
    'tourist_attraction': ['tourist_attraction'],
    'amusement_park': ['amusement_park'],
    'art_gallery': ['art_gallery'],
    'historic_site': ['point_of_interest', 'historic'],
    'natural_feature': ['natural_feature'],
    'point_of_interest': ['point_of_interest']
  };
  
  // For more user-friendly display, we map the API types to display names
  const displayTypes: Record<string, string> = {
    'museum': 'museum',
    'park': 'park',
    'tourist_attraction': 'tourist attraction',
    'amusement_park': 'amusement park',
    'art_gallery': 'art gallery',
    'historic_site': 'historic site',
    'natural_feature': 'natural attraction',
    'point_of_interest': 'point of interest'
  };
  
  console.log(`Selected attraction type: ${attractionType}`);
  
  // Convert the selected type to the correct API search term 
  let searchType = attractionType;
  
  // Special handling for tourist attractions
  if (attractionType === 'tourist_attractions') {
    searchType = 'tourist_attraction';
  }
  
  for (let i = 1; i <= numStops; i++) {
    const progress = (i * interval) / totalDistance;
    if (progress >= 1) break;
    
    const pointIndex = Math.floor(progress * route.geometry.coordinates.length);
    const coordinates = route.geometry.coordinates[pointIndex] as [number, number];
    
    try {
      // Use the specific attraction type when searching for nearby attractions
      const attraction = await findNearbyAttraction(coordinates, 5000, searchType);
      
      if (attraction) {
        console.log(`Found attraction data for stop ${i}:`, attraction);
        
        // Determine the specific attraction type from the place types
        let specificType = 'attraction';
        if (attraction.types && attraction.types.length > 0) {
          // Try to find a matching type using our mapping
          for (const apiType of attraction.types) {
            const normalizedType = apiType.replace(/_/g, ' ');
            for (const [key, value] of Object.entries(displayTypes)) {
              if (normalizedType === value) {
                specificType = value;
                break;
              }
            }
            // If we already found a specific type, break out
            if (specificType !== 'attraction') break;
          }
        }
        
        console.log(`Attraction ${attraction.name} has specific type: ${specificType}`);
        
        // Check if this attraction matches our filter criteria
        let typeMatches = false;
        
        // "any" type matches everything
        if (attractionType === 'any') {
          typeMatches = true;
        }
        // Tourist attractions special case
        else if (attractionType === 'tourist_attractions' && 
                (attraction.types?.includes('tourist_attraction') || 
                 specificType === 'tourist attraction')) {
          typeMatches = true;
        }
        // For other specific types
        else if (attraction.types) {
          // Check if any of the attraction's types match our search type
          for (const type of attraction.types) {
            // Direct match
            if (type === searchType) {
              typeMatches = true;
              break;
            }
            
            // Check against our mapping if available
            if (typeMapping[searchType]) {
              if (typeMapping[searchType].some(mappedType => type.includes(mappedType))) {
                typeMatches = true;
                break;
              }
            }
          }
        }
        
        console.log(`Type match result for ${attraction.name}: ${typeMatches}`);
        
        if (typeMatches) {
          // For tourist attractions, always set the display type correctly
          if (attractionType === 'tourist_attractions') {
            specificType = 'tourist attraction';
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
