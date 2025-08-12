from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class OfferBase(BaseModel):
    price: float = Field(..., gt=0, description="Offer price in USD")
    description: str = Field(..., min_length=10, description="Detailed offer description")
    delivery_time: str = Field(..., description="Estimated delivery timeline")

class OfferCreate(OfferBase):
    pass

class OfferUpdate(BaseModel):
    price: Optional[float] = Field(None, gt=0)
    description: Optional[str] = Field(None, min_length=10)
    delivery_time: Optional[str] = None

class OfferResponse(OfferBase):
    id: str
    rfp_id: str
    seller_id: str
    organization_id: Optional[str] = None
    status: str
    is_private: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Seller information (populated via relationship)
    seller: Optional[dict] = None
    
    class Config:
        from_attributes = True

class OfferWithRFP(OfferResponse):
    rfp: Optional[dict] = None
