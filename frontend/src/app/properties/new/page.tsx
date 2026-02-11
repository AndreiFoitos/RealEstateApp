"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProperty } from "@/lib/api";

export default function NewPropertyPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    address: "",
    type: "",
    floor_area_m2: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "floor_area_m2"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.address || !form.type || form.floor_area_m2 <= 0) {
      alert("Please fill all fields correctly");
      return;
    }

    await createProperty(form);
    router.push("/properties");
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Property</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Address"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="type"
          placeholder="Type (apartment, house...)"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="floor_area_m2"
          type="number"
          placeholder="Floor area (m²)"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
