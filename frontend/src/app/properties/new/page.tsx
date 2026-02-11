'use client';

import Link from 'next/link';
import { propertyAPI } from '@/lib/api';
import PropertyForm from '@/components/PropertyForm';

export default function NewPropertyPage() {
  return (
    <div>
      <Link href="/properties" style={{ color: '#5a6070', textDecoration: 'none', fontSize: '13px', display: 'inline-block', marginBottom: '28px' }}>
        ← Properties
      </Link>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 700, color: '#e2e4ec', marginBottom: '6px', letterSpacing: '-0.02em' }}>
        Add Property
      </h1>
      <p style={{ fontSize: '13px', color: '#5a6070', marginBottom: '28px' }}>
        30 days of energy data will be generated automatically
      </p>
      <PropertyForm
        onSubmit={async (data) => { await propertyAPI.create(data); }}
        submitLabel="Create Property"
      />
    </div>
  );
}