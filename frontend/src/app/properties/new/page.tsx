'use client';

import Link from 'next/link';
import { propertyAPI } from '@/lib/api';
import PropertyForm from '@/components/PropertyForm';

export default function NewPropertyPage() {
  return (
    <div>
      <Link href="/properties" style={{ color: '#5a6070', textDecoration: 'none', fontSize: '15px', display: 'inline-block', marginBottom: '30px' }}>
        ← Properties
      </Link>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 700, color: '#e2e4ec', marginBottom: '8px', letterSpacing: '-0.02em' }}>
        Add Property
      </h1>
      <p style={{ fontSize: '15px', color: '#5a6070', marginBottom: '30px' }}>
        Energy consumption will be calculated based on property characteristics
      </p>
      <PropertyForm
        onSubmit={async (data) => { await propertyAPI.create(data); }}
        submitLabel="Create Property"
      />
    </div>
  );
}