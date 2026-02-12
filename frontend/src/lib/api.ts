import { Property, PropertyCreate, EnergyData } from '@/types/property';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }

  return response.json();
}

export const propertyAPI = {
  // Get all properties
  getAll: async (): Promise<Property[]> => {
    return fetchAPI('/properties');
  },

  // Get single property
  getById: async (id: string): Promise<Property> => {
    return fetchAPI(`/properties/${id}`);
  },

  // Create property
  create: async (data: PropertyCreate): Promise<Property> => {
    return fetchAPI('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update property
  update: async (id: string, data: PropertyCreate): Promise<Property> => {
    return fetchAPI(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete property
  delete: async (id: string): Promise<void> => {
    return fetchAPI(`/properties/${id}`, {
      method: 'DELETE',
    });
  },

  // Get energy data
  getEnergy: async (id: string): Promise<EnergyData> => {
    return fetchAPI(`/properties/${id}/energy`);
  },
};