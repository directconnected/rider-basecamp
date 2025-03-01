
export interface CampgroundResult {
  id: number;
  campground_name: string;
  address_1: string;
  address_2?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  phone?: string | null;
  website?: string | null;
  email?: string | null;
  gps_coordinates?: string | null;
  created_at?: string;
  
  // Additional properties used in CampsiteSearchResults.tsx
  water?: string | null;
  showers?: string | null;
  season?: string | null;
  sites?: string | null;
  rv_length?: string | null;
  pets?: string | null;
  fee?: string | null;
  type?: string | null;
  price_per_night?: string | null;
  monthly_rate?: string | null;
  elev?: number | null;
  location?: [number, number] | null;
  cell_service?: string | null;
  reviews?: string | null;
  amenities?: string | null;
  photos?: string[] | null;
  distance?: number | null;
  rating?: number | null;
}

export interface CampsiteSearchState {
  searchResults: CampgroundResult[];
  isSearching: boolean;
  currentPage: number;
}
