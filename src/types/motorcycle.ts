
export interface Motorcycle {
  id: number;
  created_at: string;
  year: string | null;
  make: string | null;
  model: string | null;
  msrp: number | null;
  current_value: number | null;
  value?: number;
  engine_type: string | null;
  transmission: string | null;
  clutch: string | null;
  front_suspension: string | null;
  rear_suspension: string | null;
  front_brakes: string | null;
  rear_brakes: string | null;
  front_tire: string | null;
  rear_tire: string | null;
  rake: string | null;
  trail: string | null;
  length: string | null;
  width: string | null;
  height: string | null;
  seat_height: string | null;
  ground_clearance: string | null;
  wheelbase: string | null;
  fuel_capacity: string | null;
  curb_weight: string | null;
  colors: string | null;
}

export interface SearchParams {
  year: string;
  make: string;
  model: string;
  vin: string;
}
