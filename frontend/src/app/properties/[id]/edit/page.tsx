'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
    propertyAPI.getById(id)
      .then(setProperty)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load property'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '120px' }}>
        <div style={{ width: '28px', height: '28px', border: '2px solid #1e2130', borderTop: '2px solid #d4a843', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div>
        <div style={{ backgroundColor: '#2a1515', border: '1px solid #5a2020', borderRadius: '8px', padding: '16px 20px', color: '#f87171', marginBottom: '16px' }}>
          {error || 'Property not found'}
        </div>
        <Link href="/properties" style={{ color: '#8b90a0', textDecoration: 'none', fontSize: '13px' }}>Back to properties</Link>
      </div>
    );
  }

  return (
    <div>
      <Link href={`/properties/${id}`} style={{ color: '#5a6070', textDecoration: 'none', fontSize: '13px', display: 'inline-block', marginBottom: '28px' }}>
        ← {property.name}
      </Link>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 700, color: '#e2e4ec', marginBottom: '6px', letterSpacing: '-0.02em' }}>
        Edit Property
      </h1>
      <p style={{ fontSize: '13px', color: '#5a6070', marginBottom: '28px' }}>
        Updating details for {property.name}
      </p>
      <PropertyForm
        initialData={property}
        onSubmit={async (data) => { await propertyAPI.update(id, data); }}
        submitLabel="Save Changes"
      />
    </div>
  );
}