
/**
 * Calculates the distance between two points on Earth using the Haversine formula
 * @param lat1 Latitude of first point in degrees
 * @param lon1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lon2 Longitude of second point in degrees
 * @returns Distance in miles
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3958.8; // Earth's radius in miles
  
  // Convert latitude and longitude from degrees to radians
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  
  // Haversine formula
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  // Distance in miles
  return R * c;
};

/**
 * Finds the nearest points of interest to a given location
 * @param lat Latitude of the center point
 * @param lon Longitude of the center point
 * @param points Array of points with lat/lon properties
 * @param maxDistance Maximum distance in miles (optional)
 * @returns Array of points sorted by distance
 */
export const findNearbyPoints = <T extends { latitude: number; longitude: number }>(
  lat: number,
  lon: number,
  points: T[],
  maxDistance?: number
): (T & { distance: number })[] => {
  const pointsWithDistance = points.map(point => {
    const distance = calculateDistance(lat, lon, point.latitude, point.longitude);
    return { ...point, distance };
  });

  // Filter by max distance if provided
  const filteredPoints = maxDistance
    ? pointsWithDistance.filter(p => p.distance <= maxDistance)
    : pointsWithDistance;

  // Sort by distance
  return filteredPoints.sort((a, b) => a.distance - b.distance);
};
