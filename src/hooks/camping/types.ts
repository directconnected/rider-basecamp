
export interface CampgroundResult {
  id: number;
  campground_name: string;
  address_1: string | null;
  address_2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  gps_coordinates: string | null;
  created_at: string;
}

export interface CampsiteSearchState {
  searchResults: CampgroundResult[];
  isSearching: boolean;
  currentPage: number;
}
