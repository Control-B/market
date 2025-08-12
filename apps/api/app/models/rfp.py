from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
import enum

from app.core.database import Base

class RFPStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    CLOSED = "closed"
    AWARDED = "awarded"
    CANCELLED = "cancelled"

class RFP(Base):
    __tablename__ = "rfps"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    budget_min = Column(Integer, nullable=True)
    budget_max = Column(Integer, nullable=True)
    deadline = Column(DateTime, nullable=False)
    location = Column(String, nullable=True)
    requirements = Column(JSON, nullable=True)  # AI-normalized structured requirements
    status = Column(Enum(RFPStatus), default=RFPStatus.DRAFT)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True)
    is_private = Column(Boolean, default=False)
    ai_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    buyer = relationship("User", back_populates="rfps")
    organization = relationship("Organization")
    offers = relationship("Offer", back_populates="rfp")
    files = relationship("RFPFile", back_populates="rfp")
    threads = relationship("RFPThread", back_populates="rfp")
