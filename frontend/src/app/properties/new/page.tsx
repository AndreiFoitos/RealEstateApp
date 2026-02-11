'use client';

import { propertyAPI } from '@/lib/api';
import PropertyForm from '@/components/PropertyForm';

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Property</h1>
        <PropertyForm
        onSubmit={async (data) => {
            await propertyAPI.create(data);
        }}
        submitLabel="Create Property"
        />

    </div>
  );
}