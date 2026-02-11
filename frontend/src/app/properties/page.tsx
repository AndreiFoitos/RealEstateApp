'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { propertyAPI } from '@/lib/api';
import { Property } from '@/types/property';

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  apartment: { bg: '#1a2035', text: '#60a5fa', border: '#1e3a5f' },
  office:    { bg: '#1e1a35', text: '#a78bfa', border: '#352a5f' },
  house:     { bg: '#1a2e1e', text: '#4ade80', border: '#1e4a28' },
};

function TypeBadge({ type }: { type: string }) {
  const c = TYPE_COLORS[type] || TYPE_COLORS.apartment;
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: 500,
      backgroundColor: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      textTransform: 'capitalize',
    }}>
      {type}
    </span>
  );
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadProperties(); }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyAPI.getAll();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    try {
      await propertyAPI.delete(id);
      await loadProperties();
    } catch {
      alert('Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '120px' }}>
        <div style={{
          width: '32px', height: '32px',
          border: '3px solid #1e2130',
          borderTop: '3px solid #d4a843',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#2a1515', border: '1px solid #5a2020', borderRadius: '8px', padding: '18px 22px', color: '#f87171', fontSize: '15px' }}>
        {error}
      </div>
    );
  }

  const currentYear = new Date().getFullYear();

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '36px', fontWeight: 700, color: '#e2e4ec', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Properties
          </h1>
          <p style={{ fontSize: '16px', color: '#5a6070' }}>
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} in your portfolio
          </p>
        </div>
        <Link href="/properties/new" style={{
          textDecoration: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: 600,
          color: '#0c0e14',
          backgroundColor: '#d4a843',
        }}>
          Add Property
        </Link>
      </div>

      {/* Empty state */}
      {properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px dashed #1e2130', borderRadius: '12px' }}>
          <p style={{ color: '#e2e4ec', fontFamily: 'Syne, sans-serif', fontSize: '22px', marginBottom: '10px' }}>No properties yet</p>
          <p style={{ color: '#5a6070', fontSize: '16px', marginBottom: '26px' }}>Add your first property to start tracking energy consumption</p>
          <Link href="/properties/new" style={{ textDecoration: 'none', padding: '10px 22px', borderRadius: '8px', fontSize: '16px', fontWeight: 600, color: '#0c0e14', backgroundColor: '#d4a843' }}>
            Add Property
          </Link>
        </div>
      ) : (
        <div style={{ border: '1px solid #1e2130', borderRadius: '10px', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 0.8fr 1.5fr 0.7fr 0.7fr 0.7fr 150px',
            padding: '12px 22px',
            backgroundColor: '#10121a',
            borderBottom: '1px solid #1e2130',
          }}>
            {['Name', 'Type', 'Address', 'Area', 'Year', 'People', 'Actions'].map((h) => (
              <span key={h} style={{ fontSize: '13px', fontWeight: 600, color: '#5a6070', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {properties.map((property, i) => {
            const age = currentYear - property.year_of_construction;
            return (
              <div
                key={property.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 0.8fr 1.5fr 0.7fr 0.7fr 0.7fr 150px',
                  padding: '18px 22px',
                  borderBottom: i < properties.length - 1 ? '1px solid #1a1d27' : 'none',
                  backgroundColor: '#0e1018',
                  alignItems: 'center',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#131621')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0e1018')}
              >
                <Link href={`/properties/${property.id}`} style={{ textDecoration: 'none' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: '#e2e4ec', fontFamily: 'Syne, sans-serif' }}>
                    {property.name}
                  </span>
                </Link>

                <div><TypeBadge type={property.type} /></div>

                <span style={{ fontSize: '15px', color: '#8b90a0' }}>
                  {property.address}
                </span>

                <span style={{ fontSize: '15px', color: '#e2e4ec', fontWeight: 500 }}>
                  {property.floor_area_m2} m²
                </span>

                <span style={{ fontSize: '15px', color: '#8b90a0' }} title={`${age} years old`}>
                  {property.year_of_construction}
                </span>

                <span style={{ fontSize: '15px', color: '#8b90a0' }}>
                  {property.number_of_inhabitants}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href={`/properties/${property.id}`} style={{
                    textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                    padding: '6px 12px', borderRadius: '6px',
                    color: '#8b90a0', border: '1px solid #1e2130', backgroundColor: 'transparent',
                  }}>
                    View
                  </Link>
                  <Link href={`/properties/${property.id}/edit`} style={{
                    textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                    padding: '6px 12px', borderRadius: '6px',
                    color: '#8b90a0', border: '1px solid #1e2130', backgroundColor: 'transparent',
                  }}>
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(property.id)} style={{
                    fontSize: '14px', fontWeight: 500,
                    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer',
                    color: '#f87171', border: '1px solid #3a1a1a', backgroundColor: 'transparent',
                  }}>
                    Del
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}