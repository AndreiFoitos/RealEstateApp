const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function getProperties() {
  const res = await fetch(`${API_URL}/properties`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch properties");
  }

  return res.json();
}

export async function getProperty(id: string) {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch property");
  }

  return res.json();
}

export async function createProperty(data: any) {
  const res = await fetch(`${API_URL}/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create property");
  }

  return res.json();
}

export async function updateProperty(id: string, data: any) {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update property");
  }

  return res.json();
}

export async function deleteProperty(id: string) {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete property");
  }
}

export async function getEnergy(id: string) {
  const res = await fetch(`${API_URL}/properties/${id}/energy`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch energy data");
  }

  return res.json();
}
