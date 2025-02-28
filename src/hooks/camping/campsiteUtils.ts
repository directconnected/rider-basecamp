
// Calculate distance between two points in miles using the Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// Process and filter campground results based on search parameters
export const processSearchResults = (
  results: any[], 
  coordinates: [number, number], 
  radiusMiles: number, 
  isAnyDistance: boolean
): any[] => {
  let processedResults = [...results];
  
  // Calculate distances for all results
  processedResults.forEach(result => {
    if (result.location && result.location[0] && result.location[1]) {
      const distance = calculateDistance(
        coordinates[1], coordinates[0], 
        result.location[1], result.location[0]
      );
      result.distance = distance;
    }
  });
  
  // Sort by distance
  processedResults.sort((a, b) => (a.distance || 999) - (b.distance || 999));
  
  // Filter by specific radius if not "Any Distance"
  if (!isAnyDistance) {
    processedResults = processedResults.filter(result => 
      result.distance !== undefined && result.distance <= radiusMiles
    );
  }
  
  return processedResults;
};
