from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.rfp import RFP, RFPStatus
from app.schemas.rfp import RFPCreate, RFPResponse, RFPUpdate
from app.services.ai_service import normalize_rfp_requirements

router = APIRouter()

@router.post("/", response_model=RFPResponse)
async def create_rfp(
    rfp_data: RFPCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new RFP"""
    # Normalize requirements using AI
    normalized_requirements = await normalize_rfp_requirements(rfp_data.description)
    
    rfp = RFP(
        title=rfp_data.title,
        description=rfp_data.description,
        category=rfp_data.category,
        budget_min=rfp_data.budget_min,
        budget_max=rfp_data.budget_max,
        deadline=rfp_data.deadline,
        location=rfp_data.location,
        requirements=normalized_requirements,
        buyer_id=current_user.id,
        organization_id=current_user.organization_id,
        is_private=rfp_data.is_private,
        status=RFPStatus.DRAFT
    )
    
    db.add(rfp)
    db.commit()
    db.refresh(rfp)
    
    return RFPResponse.from_orm(rfp)

@router.get("/", response_model=List[RFPResponse])
async def list_rfps(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    status: Optional[RFPStatus] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List RFPs with filters"""
    query = db.query(RFP)
    
    # Apply filters
    if category:
        query = query.filter(RFP.category == category)
    if status:
        query = query.filter(RFP.status == status)
    
    # Don't show private RFPs unless user is the buyer
    query = query.filter(
        (RFP.is_private == False) | (RFP.buyer_id == current_user.id)
    )
    
    rfps = query.offset(skip).limit(limit).all()
    return [RFPResponse.from_orm(rfp) for rfp in rfps]

@router.get("/{rfp_id}", response_model=RFPResponse)
async def get_rfp(
    rfp_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific RFP"""
    rfp = db.query(RFP).filter(RFP.id == rfp_id).first()
    if not rfp:
        raise HTTPException(status_code=404, detail="RFP not found")
    
    # Check if user can view this RFP
    if rfp.is_private and rfp.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return RFPResponse.from_orm(rfp)

@router.put("/{rfp_id}", response_model=RFPResponse)
async def update_rfp(
    rfp_id: str,
    rfp_data: RFPUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an RFP"""
    rfp = db.query(RFP).filter(RFP.id == rfp_id).first()
    if not rfp:
        raise HTTPException(status_code=404, detail="RFP not found")
    
    # Only the buyer can update their RFP
    if rfp.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the buyer can update this RFP")
    
    # Update fields
    for field, value in rfp_data.dict(exclude_unset=True).items():
        setattr(rfp, field, value)
    
    rfp.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(rfp)
    
    return RFPResponse.from_orm(rfp)

@router.post("/{rfp_id}/publish")
async def publish_rfp(
    rfp_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Publish an RFP (change status from DRAFT to PUBLISHED)"""
    rfp = db.query(RFP).filter(RFP.id == rfp_id).first()
    if not rfp:
        raise HTTPException(status_code=404, detail="RFP not found")
    
    if rfp.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the buyer can publish this RFP")
    
    if rfp.status != RFPStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Only draft RFPs can be published")
    
    rfp.status = RFPStatus.PUBLISHED
    rfp.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "RFP published successfully"}

@router.post("/{rfp_id}/close")
async def close_rfp(
    rfp_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Close an RFP"""
    rfp = db.query(RFP).filter(RFP.id == rfp_id).first()
    if not rfp:
        raise HTTPException(status_code=404, detail="RFP not found")
    
    if rfp.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the buyer can close this RFP")
    
    rfp.status = RFPStatus.CLOSED
    rfp.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "RFP closed successfully"}
