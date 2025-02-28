
import { RestaurantType, AttractionType, LodgingType } from './types';

export const formatRestaurantType = (type: string): string => {
  if (!type) return 'Restaurant';
  
  switch (type) {
    case 'fast_food': return 'Fast Food';
    case 'fine_dining': return 'Fine Dining';
    default:
      // Convert snake_case to Title Case
      return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
};

export const formatLodgingType = (type: string): string => {
  if (!type || type === 'any') return 'Hotel';
  
  switch (type) {
    case 'bed_and_breakfast': return 'Bed & Breakfast';
    default:
      // Convert snake_case to Title Case
      return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
};

export const formatAttractionType = (type: string): string => {
  if (!type || type === 'any') return 'Attraction';
  
  switch (type) {
    case 'point_of_interest': return 'Point of Interest';
    case 'tourist_attraction': return 'Tourist Attraction';
    case 'art_gallery': return 'Art Gallery';
    case 'amusement_park': return 'Amusement Park';
    case 'historic_site': return 'Historic Site';
    case 'natural_feature': return 'Natural Feature';
    default:
      // Convert snake_case to Title Case
      return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
};
