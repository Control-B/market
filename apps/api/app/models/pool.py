from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer, Float, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
import enum

from app.core.database import Base

class PoolStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    CLOSED = "closed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class Pool(Base):
    __tablename__ = "pools"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    
    # Pricing tiers
    target_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    min_participants = Column(Integer, default=1)
    max_participants = Column(Integer, nullable=True)
    
    # Discount structure
    discount_tiers = Column(JSON, nullable=True)  # e.g., [{"participants": 5, "discount": 10}]
    
    # Timeline
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    estimated_delivery = Column(DateTime, nullable=True)
    
    # Creator
    creator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True)
    
    # Status
    status = Column(Enum(PoolStatus), default=PoolStatus.DRAFT)
    is_featured = Column(Boolean, default=False)
    
    # Requirements
    requirements = Column(JSON, nullable=True)  # Product specifications
    terms_conditions = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = relationship("User")
    organization = relationship("Organization")
    members = relationship("PoolMember", back_populates="pool")
    orders = relationship("Order", back_populates="pool")

class PoolMember(Base):
    __tablename__ = "pool_members"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pool_id = Column(UUID(as_uuid=True), ForeignKey("pools.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Commitment
    quantity = Column(Integer, default=1)
    committed_amount = Column(Float, nullable=False)
    
    # Status
    is_confirmed = Column(Boolean, default=False)
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    pool = relationship("Pool", back_populates="members")
    user = relationship("User")
