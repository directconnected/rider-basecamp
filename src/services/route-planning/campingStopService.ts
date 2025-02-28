
import { CampingStop } from '@/components/route-planning/types';

export const calculateCampingStops = async (
  route: any, 
  interval: number = 200
): Promise<CampingStop[]> => {
  console.log('Camping stops calculation has been removed (Google Places API dependency)');
  return [];
};
