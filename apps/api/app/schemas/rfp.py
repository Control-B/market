from pydantic import BaseModel, validator
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.rfp import RFPStatus

class RFPCreate(BaseModel):
    title: str
    description: str
    category: str
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    deadline: datetime
    location: Optional[str] = None
    is_private: bool = False

    @validator('budget_max')
    def validate_budget(cls, v, values):
        if v and 'budget_min' in values and values['budget_min']:
            if v <= values['budget_min']:
                raise ValueError('budget_max must be greater than budget_min')
        return v

class RFPUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    deadline: Optional[datetime] = None
    location: Optional[str] = None
    is_private: Optional[bool] = None
    status: Optional[RFPStatus] = None

class RFPResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    budget_min: Optional[int]
    budget_max: Optional[int]
    deadline: datetime
    location: Optional[str]
    requirements: Optional[Dict[str, Any]]
    status: RFPStatus
    buyer_id: str
    organization_id: Optional[str]
    is_private: bool
    ai_summary: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
