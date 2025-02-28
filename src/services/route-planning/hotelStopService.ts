
import { HotelStop } from '@/components/route-planning/types';

export const calculateHotelStops = async (
  route: any, 
  milesPerDay: number,
  preferredLodgingType: string = 'any'
): Promise<HotelStop[]> => {
  console.log('Hotel stops calculation has been removed (Google Places API dependency)');
  return [];
};
