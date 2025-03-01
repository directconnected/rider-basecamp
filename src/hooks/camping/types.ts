
export type CampgroundResult = {
  id: number;
  campground_name: string;
  address_1?: string;
  address_2?: string | null;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  gps_coordinates?: string;
  website?: string;
  email?: string;
  created_at?: string;
  // Added for location-based search
  distance?: number;
};
