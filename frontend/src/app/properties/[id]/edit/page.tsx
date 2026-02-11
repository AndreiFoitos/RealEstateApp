'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { propertyAPI } from '@/lib/api';
import PropertyForm from '@/components/PropertyForm';
import { Property } from '@/types/property';

export default function EditPropertyPage() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const data = await propertyAPI.getById(id);
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error || 'Property not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Property</h1>
      <PropertyForm
        initialData={property}
        onSubmit={async (data) => {
            await propertyAPI.update(id, data);
        }}
        submitLabel="Update Property"
        />

    </div>
  );
}
