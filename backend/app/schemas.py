from pydantic import BaseModel, Field
from uuid import UUID

class PropertyCreate(BaseModel):
    name: str
    address: str
    type: str
    floor_area_m2: float = Field(gt=0)

class Property(PropertyCreate):
    id: UUID
