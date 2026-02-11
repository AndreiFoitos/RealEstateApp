export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'office' | 'house';
  floor_area_m2: number;
  created_at?: string;
}

export interface PropertyCreate {
  name: string;
  address: string;
  type: 'apartment' | 'office' | 'house';
  floor_area_m2: number;
}

export interface PropertyUpdate extends PropertyCreate {}

export interface EnergyReading {
  date: string;
  kwh_consumed: number;
}

export interface EnergyData {
  property_id: string;
  readings: EnergyReading[];
}