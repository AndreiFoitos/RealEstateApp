'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Property, PropertyCreate } from '@/types/property';

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (data: PropertyCreate) => Promise<void>;
  submitLabel: string;
}

export default function PropertyForm({ initialData, onSubmit, submitLabel }: PropertyFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PropertyCreate>({
    name: initialData?.name || '',
    address: initialData?.address || '',
    type: initialData?.type || 'apartment',
    floor_area_m2: initialData?.floor_area_m2 || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'floor_area_m2' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }
    if (formData.floor_area_m2 <= 0) {
      setError('Floor area must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(formData);
      router.push('/properties');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Property Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Apartment Groningen Center"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Property Type *
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="apartment">Apartment</option>
          <option value="office">Office</option>
          <option value="house">House</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Grote Markt 1, Groningen"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="floor_area_m2" className="block text-sm font-medium text-gray-700 mb-2">
          Floor Area (m²) *
        </label>
        <input
          type="number"
          id="floor_area_m2"
          name="floor_area_m2"
          value={formData.floor_area_m2}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 85.5"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}