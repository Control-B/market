from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class Offer(Base):
    __tablename__ = "offers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    rfp_id = Column(String, ForeignKey("rfps.id"), nullable=False)
    seller_id = Column(String, ForeignKey("users.id"), nullable=False)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    
    # Offer details
    price = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    delivery_time = Column(String, nullable=False)
    
    # Status and metadata
    status = Column(String, default="pending")  # pending, accepted, rejected, withdrawn
    is_private = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    rfp = relationship("RFP", back_populates="offers")
    seller = relationship("User", back_populates="offers_submitted")
    organization = relationship("Organization", back_populates="offers")
