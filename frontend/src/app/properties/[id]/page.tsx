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
    loadData();
  }, [id]);

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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await propertyAPI.delete(id);
      router.push('/properties');
    } catch (err) {
      alert('Failed to delete property');
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
        <Link href="/properties" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to properties
        </Link>
      </div>
    );
  }

  const totalKwh = energyData?.readings.reduce((sum, r) => sum + r.kwh_consumed, 0) || 0;
  const avgKwh = energyData?.readings.length ? totalKwh / energyData.readings.length : 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/properties" className="text-blue-600 hover:underline">
          ← Back to properties
        </Link>
      </div>

      {/* Property Details Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{property.name}</h1>
          <div className="space-x-2">
            <Link
              href={`/properties/${id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Type</p>
            <p className="font-semibold capitalize">{property.type}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Floor Area</p>
            <p className="font-semibold">{property.floor_area_m2} m²</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600 text-sm">Address</p>
            <p className="font-semibold">{property.address}</p>
          </div>
        </div>
      </div>

      {/* Energy Statistics */}
      {energyData && energyData.readings.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <p className="text-gray-600 text-sm">Total Consumption</p>
            <p className="text-2xl font-bold text-blue-600">{totalKwh.toFixed(1)} kWh</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <p className="text-gray-600 text-sm">Average Daily</p>
            <p className="text-2xl font-bold text-green-600">{avgKwh.toFixed(1)} kWh</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <p className="text-gray-600 text-sm">Days Tracked</p>
            <p className="text-2xl font-bold text-purple-600">{energyData.readings.length}</p>
          </div>
        </div>
      )}

      {/* Energy Chart */}
      {energyData && energyData.readings.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Energy Consumption Over Time</h2>
          <EnergyChart data={energyData.readings} />
        </div>
      )}

      {/* Energy Data Table */}
      {energyData && energyData.readings.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-xl font-bold p-6 border-b">Energy Readings</h2>
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    kWh Consumed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {energyData.readings.map((reading, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(reading.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reading.kwh_consumed.toFixed(2)} kWh
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No energy data available for this property</p>
        </div>
      )}
    </div>
  );
}