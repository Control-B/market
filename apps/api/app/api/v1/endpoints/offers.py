from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.rfp import RFP
from app.models.offer import Offer
from app.schemas.offer import OfferCreate, OfferResponse
from app.services.ai_service import suggest_counteroffer

router = APIRouter()

@router.post("/{rfp_id}/offers", response_model=OfferResponse)
async def create_offer(
    rfp_id: str,
    offer_data: OfferCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit an offer for an RFP"""
    # Check if RFP exists and is published
    rfp = db.query(RFP).filter(RFP.id == rfp_id).first()
    if not rfp:
        raise HTTPException(status_code=404, detail="RFP not found")
    
    if rfp.status != "published":
        raise HTTPException(status_code=400, detail="Can only submit offers to published RFPs")
    
    # Check if user is not the buyer
    if rfp.buyer_id == current_user.id:
        raise HTTPException(status_code=400, detail="Buyers cannot submit offers to their own RFPs")
    
    # Check if user already submitted an offer
    existing_offer = db.query(Offer).filter(
        Offer.rfp_id == rfp_id,
        Offer.seller_id == current_user.id
    ).first()
    
    if existing_offer:
        raise HTTPException(status_code=400, detail="You have already submitted an offer for this RFP")
    
    # Create the offer
    offer = Offer(
        rfp_id=rfp_id,
        seller_id=current_user.id,
        price=offer_data.price,
        description=offer_data.description,
        delivery_time=offer_data.delivery_time,
        organization_id=current_user.organization_id
    )
    
    db.add(offer)
    db.commit()
    db.refresh(offer)
    
    return OfferResponse.from_orm(offer)

@router.get("/{rfp_id}/offers", response_model=List[OfferResponse])
async def list_offers(
    rfp_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all offers for an RFP"""
    # Check if RFP exists
    rfp = db.query(RFP).filter(RFP.id == rfp_id).first()
    if not rfp:
        raise HTTPException(status_code=404, detail="RFP not found")
    
    # Only the buyer can see all offers
    if rfp.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the buyer can view offers")
    
    offers = db.query(Offer).filter(Offer.rfp_id == rfp_id).all()
    return [OfferResponse.from_orm(offer) for offer in offers]

@router.get("/offers/my", response_model=List[OfferResponse])
async def list_my_offers(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List offers submitted by the current user"""
    offers = db.query(Offer).filter(
        Offer.seller_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return [OfferResponse.from_orm(offer) for offer in offers]

@router.get("/offers/{offer_id}", response_model=OfferResponse)
async def get_offer(
    offer_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific offer"""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    # Check if user can view this offer
    rfp = db.query(RFP).filter(RFP.id == offer.rfp_id).first()
    if not rfp:
        raise HTTPException(status_code=404, detail="RFP not found")
    
    if offer.seller_id != current_user.id and rfp.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return OfferResponse.from_orm(offer)

@router.put("/offers/{offer_id}", response_model=OfferResponse)
async def update_offer(
    offer_id: str,
    offer_data: OfferCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an offer"""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    # Only the seller can update their offer
    if offer.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the seller can update this offer")
    
    # Check if RFP is still accepting offers
    rfp = db.query(RFP).filter(RFP.id == offer.rfp_id).first()
    if rfp.status != "published":
        raise HTTPException(status_code=400, detail="Cannot update offer for closed RFP")
    
    # Update fields
    offer.price = offer_data.price
    offer.description = offer_data.description
    offer.delivery_time = offer_data.delivery_time
    offer.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(offer)
    
    return OfferResponse.from_orm(offer)

@router.delete("/offers/{offer_id}")
async def delete_offer(
    offer_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an offer"""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    # Only the seller can delete their offer
    if offer.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the seller can delete this offer")
    
    # Check if RFP is still accepting offers
    rfp = db.query(RFP).filter(RFP.id == offer.rfp_id).first()
    if rfp.status != "published":
        raise HTTPException(status_code=400, detail="Cannot delete offer for closed RFP")
    
    db.delete(offer)
    db.commit()
    
    return {"message": "Offer deleted successfully"}

@router.post("/offers/{offer_id}/accept")
async def accept_offer(
    offer_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Accept an offer (buyer only)"""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    rfp = db.query(RFP).filter(RFP.id == offer.rfp_id).first()
    if not rfp:
        raise HTTPException(status_code=404, detail="RFP not found")
    
    # Only the buyer can accept offers
    if rfp.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the buyer can accept offers")
    
    # Check if RFP is still open
    if rfp.status != "published":
        raise HTTPException(status_code=400, detail="Cannot accept offer for closed RFP")
    
    # Update RFP status to awarded
    rfp.status = "awarded"
    rfp.awarded_offer_id = offer.id
    rfp.updated_at = datetime.utcnow()
    
    # Update offer status to accepted
    offer.status = "accepted"
    offer.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Offer accepted successfully"}

@router.get("/offers/{offer_id}/suggestions")
async def get_offer_suggestions(
    offer_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI suggestions for offer negotiation"""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    rfp = db.query(RFP).filter(RFP.id == offer.rfp_id).first()
    if not rfp:
        raise HTTPException(status_code=404, detail="RFP not found")
    
    # Only the buyer or seller can get suggestions
    if offer.seller_id != current_user.id and rfp.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get market average (simplified - in real app, this would query historical data)
    market_average = (rfp.budget_min + rfp.budget_max) / 2 if rfp.budget_min and rfp.budget_max else offer.price
    
    # Generate AI suggestions
    suggestions = await suggest_counteroffer(
        buyer_offer=offer.price,
        seller_original=offer.price,
        market_average=market_average
    )
    
    return suggestions
