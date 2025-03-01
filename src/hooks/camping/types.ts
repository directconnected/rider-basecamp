
export interface CampgroundResult {
  name: string;
  address: string;
  location: [number, number];
  distance?: number;
  rating?: number;
  phone_number?: string;
  website?: string;
  types?: string[];
  state?: string | null;
  
  // Additional campground information (might be null for Google Places results)
  water?: string | null;
  showers?: string | null;
  season?: string | null;
  sites?: string | null;
  rv_length?: number | null;
  pets?: string | null;
  fee?: string | null;
  type?: string;
  // New campground information
  price_per_night?: string | null;
  monthly_rate?: string | null;
  elev?: number | null;
  cell_service?: string | null;
  reviews?: string | null;
  amenities?: string | null;
  photos?: string[] | null;
}

export interface CampsiteSearchState {
  searchResults: CampgroundResult[];
  isSearching: boolean;
  currentPage: number;
}
