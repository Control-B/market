from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationResponse

router = APIRouter()

@router.post("/", response_model=OrganizationResponse)
async def create_organization(
    org_data: OrganizationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new organization"""
    organization = Organization(
        name=org_data.name,
        description=org_data.description,
        industry=org_data.industry,
        size=org_data.size,
        website=org_data.website
    )
    
    db.add(organization)
    db.commit()
    db.refresh(organization)
    
    # Assign current user to organization
    current_user.organization_id = organization.id
    db.commit()
    
    return OrganizationResponse.from_orm(organization)

@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get organization details"""
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Check if user has access to this organization
    if current_user.organization_id != organization.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    return OrganizationResponse.from_orm(organization)
