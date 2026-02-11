import { getProperty, getEnergy } from "@/lib/api";

export default async function PropertyDetail({
  params,
}: {
  params: { id: string };
}) {
  const property = await getProperty(params.id);
  const energy = await getEnergy(params.id);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{property.name}</h1>

      <div className="mb-8">
        <p><strong>Type:</strong> {property.type}</p>
        <p><strong>Address:</strong> {property.address}</p>
        <p><strong>Floor area:</strong> {property.floor_area_m2} m²</p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Energy Usage</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Date</th>
            <th className="border p-2 text-left">kWh</th>
          </tr>
        </thead>
        <tbody>
          {energy.map((entry: any) => (
            <tr key={entry.date}>
              <td className="border p-2">{entry.date}</td>
              <td className="border p-2">{entry.kwh}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
