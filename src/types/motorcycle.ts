
export interface Motorcycle {
  id: number;
  created_at: string;
  year: string | null;
  make: string | null;
  model: string | null;
  msrp: number | null;
  current_value: number | null;
  value?: number;
}

export interface SearchParams {
  year: string;
  make: string;
  model: string;
  vin: string;
}
