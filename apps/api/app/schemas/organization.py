from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class OrganizationCreate(BaseModel):
    name: str
    description: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    website: Optional[HttpUrl] = None

class OrganizationResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    industry: Optional[str]
    size: Optional[str]
    website: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
