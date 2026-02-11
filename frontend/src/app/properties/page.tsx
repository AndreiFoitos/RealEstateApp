import Link from "next/link";
import { getProperties, deleteProperty } from "@/lib/api";

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link
          href="/properties/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Property
        </Link>
      </div>

      <div className="space-y-4">
        {properties.map((property: any) => (
          <div
            key={property.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{property.name}</h2>
              <p className="text-sm text-gray-600">
                {property.type} — {property.address}
              </p>
            </div>

            <Link
              href={`/properties/${property.id}`}
              className="text-blue-600 underline"
            >
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
