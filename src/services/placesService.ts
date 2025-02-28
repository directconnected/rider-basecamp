
export const findNearbyAttraction = async (
  coordinates: [number, number], 
  radius: number = 5000,
  attractionType: string = 'any'
): Promise<PlaceResult | null> => {
  console.log(`Finding nearby attraction of type: ${attractionType}`);
  
  // Map our UI attraction types to Google Places API types and keywords
  const typeMapping: Record<string, { type: string, keyword?: string }> = {
    'museum': { type: 'museum' },
    'park': { type: 'park' },
    'tourist_attraction': { type: 'tourist_attraction' },
    'tourist_attractions': { type: 'tourist_attraction' }, // Handle plural form
    'amusement_park': { type: 'amusement_park' },
    'art_gallery': { type: 'art_gallery' },
    'historic_site': { type: 'point_of_interest', keyword: 'historic' },
    'natural_feature': { type: 'natural_feature' },
    'point_of_interest': { type: 'point_of_interest' }
  };
  
  if (attractionType === 'any') {
    return findPlace(coordinates, 'tourist_attraction', radius);
  }
  
  // Get the mapped type configuration
  const typeConfig = typeMapping[attractionType] || { type: 'tourist_attraction' };
  
  // Use the mapped type and keyword
  console.log(`Searching for attraction with type: ${typeConfig.type} and keyword: ${typeConfig.keyword || 'none'}`);
  
  try {
    // Attempt to find exactly the type requested
    const result = await findPlace(coordinates, typeConfig.type as any, radius, typeConfig.keyword);
    if (result) {
      console.log(`Found ${attractionType} attraction:`, result.name);
      return result;
    }
    
    // If the exact type wasn't found, and it's not 'any', try as a point_of_interest with the type as keyword
    if (attractionType !== 'any' && !result) {
      console.log(`No ${attractionType} found, trying as point_of_interest with keyword`);
      const fallbackResult = await findPlace(coordinates, 'point_of_interest', radius, attractionType.replace(/_/g, ' '));
      if (fallbackResult) {
        console.log(`Found fallback ${attractionType} attraction:`, fallbackResult.name);
      }
      return fallbackResult;
    }
    
    return null;
  } catch (error) {
    console.error(`Error finding ${attractionType} attraction:`, error);
    return null;
  }
};
