from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.ai_concierge_service import ai_concierge

router = APIRouter()

class ConciergeMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ConciergeResponse(BaseModel):
    content: str
    type: str
    suggestions: list
    timestamp: str

@router.post("/chat", response_model=ConciergeResponse)
async def chat_with_concierge(
    message_data: ConciergeMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Chat with the AI concierge"""
    
    try:
        # Build context from user data
        context = {
            "user_role": current_user.role.value,
            "user_id": str(current_user.id),
            "organization_id": str(current_user.organization_id) if current_user.organization_id else None
        }
        
        # Add any additional context from the request
        if message_data.context:
            context.update(message_data.context)
        
        # Process the message
        response = await ai_concierge.process_message(
            user_id=str(current_user.id),
            message=message_data.message,
            context=context
        )
        
        return ConciergeResponse(**response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@router.get("/templates/{category}")
async def get_rfp_template(
    category: str,
    current_user: User = Depends(get_current_user)
):
    """Get an RFP template for a specific category"""
    
    try:
        template = await ai_concierge.get_rfp_template(category)
        return template
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting template: {str(e)}")

@router.post("/analyze-offer")
async def analyze_offer(
    offer_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Analyze an offer and provide insights"""
    
    try:
        analysis = await ai_concierge.analyze_offer(offer_data)
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing offer: {str(e)}")

@router.delete("/clear-history")
async def clear_conversation_history(
    current_user: User = Depends(get_current_user)
):
    """Clear the user's conversation history"""
    
    try:
        ai_concierge.clear_conversation_history(str(current_user.id))
        return {"message": "Conversation history cleared successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing history: {str(e)}")

@router.get("/suggestions")
async def get_suggestions(
    current_user: User = Depends(get_current_user)
):
    """Get contextual suggestions based on user role and activity"""
    
    try:
        suggestions = []
        
        if current_user.role.value == "buyer":
            suggestions = [
                "Help me write an RFP",
                "Browse seller profiles",
                "Market research",
                "Negotiation advice"
            ]
        elif current_user.role.value == "seller":
            suggestions = [
                "Browse active RFPs",
                "Update my profile",
                "Market insights",
                "Pricing strategy"
            ]
        else:
            suggestions = [
                "Help me write an RFP",
                "Analyze an offer",
                "Market research",
                "Platform guide"
            ]
        
        return {"suggestions": suggestions}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting suggestions: {str(e)}")
