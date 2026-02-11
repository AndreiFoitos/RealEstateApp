'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Property, PropertyCreate } from '@/types/property';

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (data: PropertyCreate) => Promise<void>;
  submitLabel: string;
}

const inputStyle = {
  width: '100%',
  backgroundColor: '#0c0e14',
  border: '1px solid #1e2130',
  borderRadius: '7px',
  padding: '10px 14px',
  color: '#e2e4ec',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.15s',
} as React.CSSProperties;

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  color: '#8b90a0',
  marginBottom: '6px',
  letterSpacing: '0.02em',
} as React.CSSProperties;

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
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'floor_area_m2' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setError('Property name is required'); return; }
    if (!formData.address.trim()) { setError('Address is required'); return; }
    if (formData.floor_area_m2 <= 0) { setError('Floor area must be greater than 0'); return; }
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
    <form onSubmit={handleSubmit} style={{ maxWidth: '520px' }}>
      {error && (
        <div style={{ backgroundColor: '#2a1515', border: '1px solid #5a2020', borderRadius: '7px', padding: '12px 16px', color: '#f87171', fontSize: '13px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div style={{ backgroundColor: '#0e1018', border: '1px solid #1e2130', borderRadius: '10px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Name */}
        <div>
          <label style={labelStyle} htmlFor="name">Property Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
            placeholder="e.g. Centrum Apartment"
            required
            style={{ ...inputStyle, borderColor: focused === 'name' ? '#d4a843' : '#1e2130' }}
          />
        </div>

        {/* Type */}
        <div>
          <label style={labelStyle}>Property Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {(['apartment', 'office', 'house'] as const).map(t => (
              <label key={t} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 8px',
                borderRadius: '7px',
                cursor: 'pointer',
                border: `1px solid ${formData.type === t ? '#d4a843' : '#1e2130'}`,
                backgroundColor: formData.type === t ? 'rgba(212, 168, 67, 0.08)' : '#0c0e14',
                fontSize: '13px',
                fontWeight: 500,
                color: formData.type === t ? '#d4a843' : '#8b90a0',
                textTransform: 'capitalize',
                transition: 'all 0.15s',
                userSelect: 'none',
              }}>
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={formData.type === t}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        {/* Address */}
        <div>
          <label style={labelStyle} htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onFocus={() => setFocused('address')}
            onBlur={() => setFocused(null)}
            placeholder="e.g. Grote Markt 1, Groningen"
            required
            style={{ ...inputStyle, borderColor: focused === 'address' ? '#d4a843' : '#1e2130' }}
          />
        </div>

        {/* Floor area */}
        <div>
          <label style={labelStyle} htmlFor="floor_area_m2">Floor Area (m²)</label>
          <input
            type="number"
            id="floor_area_m2"
            name="floor_area_m2"
            value={formData.floor_area_m2 || ''}
            onChange={handleChange}
            onFocus={() => setFocused('floor_area_m2')}
            onBlur={() => setFocused(null)}
            placeholder="e.g. 85"
            min="0"
            step="0.01"
            required
            style={{ ...inputStyle, borderColor: focused === 'floor_area_m2' ? '#d4a843' : '#1e2130' }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1, padding: '10px', borderRadius: '7px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              backgroundColor: loading ? '#8a6e30' : '#d4a843',
              color: '#0c0e14', fontSize: '14px', fontWeight: 600,
            }}
          >
            {loading ? 'Saving...' : submitLabel}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              flex: 1, padding: '10px', borderRadius: '7px', cursor: 'pointer',
              backgroundColor: 'transparent', color: '#8b90a0',
              border: '1px solid #1e2130', fontSize: '14px', fontWeight: 500,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}