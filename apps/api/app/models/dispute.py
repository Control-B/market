from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
import enum

from app.core.database import Base

class DisputeStatus(str, enum.Enum):
    OPENED = "opened"
    UNDER_REVIEW = "under_review"
    RESOLVED = "resolved"
    CLOSED = "closed"

class DisputeType(str, enum.Enum):
    QUALITY_ISSUE = "quality_issue"
    DELIVERY_DELAY = "delivery_delay"
    WRONG_ITEM = "wrong_item"
    PAYMENT_ISSUE = "payment_issue"
    COMMUNICATION = "communication"
    OTHER = "other"

class Dispute(Base):
    __tablename__ = "disputes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    opened_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Dispute details
    dispute_type = Column(Enum(DisputeType), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    evidence = Column(JSON, nullable=True)  # Links to files, screenshots, etc.
    
    # Resolution
    status = Column(Enum(DisputeStatus), default=DisputeStatus.OPENED)
    resolution = Column(Text, nullable=True)
    resolution_date = Column(DateTime, nullable=True)
    resolved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order = relationship("Order", back_populates="disputes")
    opener = relationship("User", foreign_keys=[opened_by])
    resolver = relationship("User", foreign_keys=[resolved_by])
    messages = relationship("DisputeMessage", back_populates="dispute")

class DisputeMessage(Base):
    __tablename__ = "dispute_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dispute_id = Column(UUID(as_uuid=True), ForeignKey("disputes.id"), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    content = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=False)  # Internal admin notes
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    dispute = relationship("Dispute", back_populates="messages")
    sender = relationship("User")
