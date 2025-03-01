
export interface CampgroundResult {
  campground_name: string;
  address_1: string;
  address_2: string;
  city?: string;
  state?: string | null;
  zip_code? string;
  phone?: string;
  website?: string;
  
}

export interface CampsiteSearchState {
  searchResults: CampgroundResult[];
  isSearching: boolean;
  currentPage: number;
}
