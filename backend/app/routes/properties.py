from fastapi import APIRouter, HTTPException
from uuid import UUID
from app.database import supabase
from app.schemas import PropertyCreate
from app.energy import generate_energy

router = APIRouter()

@router.post("/properties")
def create_property(payload: PropertyCreate):
    prop = supabase.table("properties").insert(payload.dict()).execute()
    if not prop.data:
        raise HTTPException(400, "Create failed")

    property_id = prop.data[0]["id"]
    energy = generate_energy(property_id)

    supabase.table("energy_data").insert([
        {**e, "property_id": property_id} for e in energy
    ]).execute()

    return prop.data[0]

@router.get("/properties")
def list_properties():
    return supabase.table("properties").select("*").execute().data

@router.get("/properties/{id}")
def get_property(id: UUID):
    res = supabase.table("properties").select("*").eq("id", id).single().execute()
    if not res.data:
        raise HTTPException(404)
    return res.data

@router.put("/properties/{id}")
def update_property(id: UUID, payload: PropertyCreate):
    res = supabase.table("properties").update(payload.dict()).eq("id", id).execute()
    return res.data

@router.delete("/properties/{id}")
def delete_property(id: UUID):
    supabase.table("properties").delete().eq("id", id).execute()
    return {"ok": True}

@router.get("/properties/{id}/energy")
def get_energy(id: UUID):
    return supabase.table("energy_data") \
        .select("date,kwh") \
        .eq("property_id", id) \
        .order("date") \
        .execute().data
