
export interface CampgroundResult {
  name: string;
  address: string;
  location: [number, number];
  distance?: number;
  rating?: number;
  phone_number?: string;
  website?: string;
  types?: string[];
  state?: string;
  // Additional campground information
  water?: string;
  showers?: string;
  season?: string;
  sites?: string;
  rv_length?: number;
  pets?: string;
  fee?: string;
  type?: string;
  // New campground information
  price_per_night?: string;
  monthly_rate?: string;
  elev?: number;
  cell_service?: string;
  reviews?: string;
  amenities?: string;
  photos?: string[];
}

export interface CampsiteSearchState {
  searchResults: CampgroundResult[];
  isSearching: boolean;
  currentPage: number;
}
