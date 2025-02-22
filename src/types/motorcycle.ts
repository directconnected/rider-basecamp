
export interface Motorcycle {
  id: number;
  created_at: string;
  year: string | null;
  make: string | null;
  model: string | null;
  msrp: string | null;
  current_value: string | null;
  value?: number;
}

export interface SearchParams {
  year: string;
  make: string;
  model: string;
  vin: string;
}
