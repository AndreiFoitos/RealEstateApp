from fastapi import APIRouter, HTTPException
from uuid import UUID
from app.database import supabase
from app.schemas import PropertyCreate
from app.energy import generate_energy

router = APIRouter()

@router.post("/properties", status_code=201)
def create_property(payload: PropertyCreate):
    prop = supabase.table("properties").insert(payload.dict()).execute()
    if not prop.data:
        raise HTTPException(400, "Create failed")

    property_data = prop.data[0]
    property_id = property_data["id"]
    
    energy = generate_energy(
        property_id=property_id,
        floor_area_m2=property_data["floor_area_m2"],
        year_of_construction=property_data["year_of_construction"],
        number_of_inhabitants=property_data["number_of_inhabitants"],
        ceiling_height_m=property_data["ceiling_height_m"],
        property_type=property_data["type"]
    )

    supabase.table("energy_data").insert([
        {**e, "property_id": property_id} for e in energy
    ]).execute()

    return property_data

@router.get("/properties")
def list_properties():
    return supabase.table("properties").select("*").execute().data

@router.get("/properties/{id}")
def get_property(id: UUID):
    res = supabase.table("properties").select("*").eq("id", id).single().execute()
    if not res.data:
        raise HTTPException(404,"Property not found")
    return res.data

@router.put("/properties/{id}")
def update_property(id: UUID, payload: PropertyCreate):
    property_id = str(id)

    res = supabase.table("properties").update(payload.dict()).eq("id", property_id).execute()

    if not res.data:
        raise HTTPException(404, "Property not found")


    property_data = res.data[0]

    supabase.table("energy_data").delete().eq("property_id", property_id).execute()

    energy = generate_energy(
        property_id=property_id,
        floor_area_m2=payload.floor_area_m2,
        year_of_construction=payload.year_of_construction,
        number_of_inhabitants=payload.number_of_inhabitants,
        ceiling_height_m=payload.ceiling_height_m,
        property_type=payload.type
    )

    supabase.table("energy_data").insert([
        {**e, "property_id": property_id}
        for e in energy
    ]).execute()

    return property_data


@router.delete("/properties/{id}")
def delete_property(id: UUID):
    res = supabase.table("properties").delete().eq("id", id).execute()

    if not res.data:
        raise HTTPException(404,"Property not found")

    return {"ok": True}


@router.get("/properties/{id}/energy")
def get_energy(id: UUID):
    data = supabase.table("energy_data").select("date,kwh").eq("property_id", id).order("date").execute().data
    
    return {
        "property_id": str(id),
        "readings": [{"date": r["date"], "kwh": r["kwh"]} for r in data]
    }