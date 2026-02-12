export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'office' | 'house';
  floor_area_m2: number;
  year_of_construction: number;
  number_of_inhabitants: number;
  ceiling_height_m: number;
  created_at?: string;
}

export interface PropertyCreate {
  name: string;
  address: string;
  type: 'apartment' | 'office' | 'house';
  floor_area_m2: number;
  year_of_construction: number;
  number_of_inhabitants: number;
  ceiling_height_m: number;
}


export interface EnergyReading {
  date: string;
  kwh_consumed: number;
}

export interface EnergyData {
  property_id: string;
  readings: EnergyReading[];
}