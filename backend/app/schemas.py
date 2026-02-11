from pydantic import BaseModel, Field
from uuid import UUID

class PropertyCreate(BaseModel):
    name: str
    address: str
    type: str
    floor_area_m2: float = Field(gt=0)
    year_of_construction: int = Field(ge=1800, le=2030)
    number_of_inhabitants: int = Field(ge=0, le=50)
    ceiling_height_m: float = Field(gt=1.5, le=6.0)

class Property(PropertyCreate):
    id: UUID