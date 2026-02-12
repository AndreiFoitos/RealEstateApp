'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { propertyAPI } from '@/lib/api';
import { Property, EnergyData } from '@/types/property';
import EnergyChart from '@/components/EnergyChart';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const [propertyData, energy] = await Promise.all([
        propertyAPI.getById(id),
        propertyAPI.getEnergy(id),
      ]);
      setProperty(propertyData);
      setEnergyData(energy);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [id]);


  const handleDelete = async () => {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    try {
      await propertyAPI.delete(id);
      router.push('/properties');
    } catch {
      alert('Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '120px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #1e2130', borderTop: '3px solid #d4a843', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div>
        <div style={{ backgroundColor: '#2a1515', border: '1px solid #5a2020', borderRadius: '8px', padding: '18px 22px', color: '#f87171', marginBottom: '18px', fontSize: '15px' }}>
          {error || 'Property not found'}
        </div>
        <Link href="/properties" style={{ color: '#8b90a0', textDecoration: 'none', fontSize: '15px' }}>Back to properties</Link>
      </div>
    );
  }

  const readings = energyData?.readings ?? [];
  const totalKwh = readings.reduce((s, r) => s + r.kwh, 0);
  const avgKwh = readings.length ? totalKwh / readings.length : 0;
  const maxKwh = readings.length ? Math.max(...readings.map(r => r.kwh)) : 0;

  const stats = [
    { label: 'Total — 30 days', value: `${totalKwh.toFixed(1)}`, unit: 'kWh', color: '#d4a843' },
    { label: 'Daily average', value: `${avgKwh.toFixed(1)}`, unit: 'kWh', color: '#60a5fa' },
    { label: 'Peak consumption', value: `${maxKwh.toFixed(1)}`, unit: 'kWh', color: '#f87171' },
  ];

  const currentYear = new Date().getFullYear();
  const buildingAge = currentYear - property.year_of_construction;

  return (
    <div>
      {/* Back */}
      <Link href="/properties" style={{ color: '#5a6070', textDecoration: 'none', fontSize: '15px', display: 'inline-block', marginBottom: '30px' }}>
        ← Properties
      </Link>

      {/* Header card */}
      <div style={{ backgroundColor: '#0e1018', border: '1px solid #1e2130', borderRadius: '10px', padding: '30px 34px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '18px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '12px' }}>
              <span style={{
                display: 'inline-block',
                padding: '3px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                textTransform: 'capitalize', marginBottom: '12px',
                backgroundColor: '#1a2035', color: '#60a5fa', border: '1px solid #1e3a5f',
              }}>
                {property.type}
              </span>
            </div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 700, color: '#e2e4ec', marginBottom: '10px', letterSpacing: '-0.02em' }}>
              {property.name}
            </h1>
            <p style={{ fontSize: '16px', color: '#8b90a0', marginBottom: '16px' }}>{property.address}</p>
            
            {/* Property details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#5a6070', display: 'block', marginBottom: '4px' }}>Floor Area</span>
                <span style={{ fontSize: '16px', color: '#e2e4ec', fontWeight: 500 }}>{property.floor_area_m2} m²</span>
              </div>
              <div>
                <span style={{ fontSize: '13px', color: '#5a6070', display: 'block', marginBottom: '4px' }}>Year Built</span>
                <span style={{ fontSize: '16px', color: '#e2e4ec', fontWeight: 500 }}>
                  {property.year_of_construction} <span style={{ fontSize: '14px', color: '#5a6070' }}>({buildingAge} years old)</span>
                </span>
              </div>
              <div>
                <span style={{ fontSize: '13px', color: '#5a6070', display: 'block', marginBottom: '4px' }}>Inhabitants</span>
                <span style={{ fontSize: '16px', color: '#e2e4ec', fontWeight: 500 }}>
                  {property.number_of_inhabitants} {property.number_of_inhabitants === 1 ? 'person' : 'people'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '13px', color: '#5a6070', display: 'block', marginBottom: '4px' }}>Ceiling Height</span>
                <span style={{ fontSize: '16px', color: '#e2e4ec', fontWeight: 500 }}>{property.ceiling_height_m} m</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href={`/properties/${id}/edit`} style={{
              textDecoration: 'none', padding: '9px 18px', borderRadius: '7px', fontSize: '15px', fontWeight: 500,
              color: '#8b90a0', border: '1px solid #1e2130', backgroundColor: 'transparent',
            }}>
              Edit
            </Link>
            <button onClick={handleDelete} style={{
              padding: '9px 18px', borderRadius: '7px', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
              color: '#f87171', border: '1px solid #3a1a1a', backgroundColor: 'transparent',
            }}>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      {readings.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '18px' }}>
          {stats.map(s => (
            <div key={s.label} style={{ backgroundColor: '#0e1018', border: '1px solid #1e2130', borderRadius: '10px', padding: '22px 26px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#5a6070', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
                {s.label}
              </p>
              <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 700, color: s.color, lineHeight: 1 }}>
                {s.value} <span style={{ fontSize: '16px', fontWeight: 400, color: '#5a6070' }}>{s.unit}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {readings.length > 0 && (
        <div style={{ backgroundColor: '#0e1018', border: '1px solid #1e2130', borderRadius: '10px', padding: '26px 30px', marginBottom: '18px' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 600, color: '#e2e4ec', marginBottom: '26px' }}>
            Energy consumption — 30 days
          </h2>
          <EnergyChart data={readings} />
        </div>
      )}

      {/* Readings table */}
      {readings.length > 0 && (
        <div style={{ backgroundColor: '#0e1018', border: '1px solid #1e2130', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ padding: '18px 26px', borderBottom: '1px solid #1e2130' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 600, color: '#e2e4ec' }}>Daily readings</h2>
          </div>
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#10121a' }}>
                  {['Date', 'kWh consumed', 'vs average'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 26px', fontSize: '13px', fontWeight: 600, color: '#5a6070', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {readings.map((r, i) => {
                  const diff = r.kwh - avgKwh;
                  const isHigh = diff > 0;
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #1a1d27' }}>
                      <td style={{ padding: '14px 26px', fontSize: '15px', color: '#8b90a0' }}>
                        {new Date(r.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '14px 26px', fontSize: '16px', fontWeight: 500, color: '#e2e4ec' }}>
                        {r.kwh.toFixed(2)} kWh
                      </td>
                      <td style={{ padding: '14px 26px' }}>
                        <span style={{
                          fontSize: '14px', fontWeight: 500, padding: '3px 10px', borderRadius: '12px',
                          color: isHigh ? '#f87171' : '#4ade80',
                          backgroundColor: isHigh ? '#2a1515' : '#152a1a',
                        }}>
                          {isHigh ? '+' : ''}{diff.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {readings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed #1e2130', borderRadius: '10px', color: '#5a6070', fontSize: '16px' }}>
          No energy data available for this property
        </div>
      )}
    </div>
  );
}