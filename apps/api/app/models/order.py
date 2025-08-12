from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer, ForeignKey, Enum, JSON, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
import enum

from app.core.database import Base

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    REFUNDED = "refunded"
    FAILED = "failed"

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rfp_id = Column(UUID(as_uuid=True), ForeignKey("rfps.id"), nullable=False)
    offer_id = Column(UUID(as_uuid=True), ForeignKey("offers.id"), nullable=False)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    payment_intent_id = Column(String, nullable=True)  # Stripe payment intent
    escrow_release_date = Column(DateTime, nullable=True)
    delivery_deadline = Column(DateTime, nullable=True)
    completion_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Group buying
    pool_id = Column(UUID(as_uuid=True), ForeignKey("pools.id"), nullable=True)
    
    # Relationships
    rfp = relationship("RFP")
    offer = relationship("Offer")
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="orders")
    seller = relationship("User", foreign_keys=[seller_id])
    pool = relationship("Pool", back_populates="orders")
    disputes = relationship("Dispute", back_populates="order")
