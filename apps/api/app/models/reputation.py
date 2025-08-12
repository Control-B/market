from sqlalchemy import Column, String, DateTime, Integer, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

from app.core.database import Base

class ReputationMetric(Base):
    __tablename__ = "reputation_metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Overall scores
    overall_score = Column(Float, default=0.0)  # 0-100
    response_rate = Column(Float, default=0.0)  # 0-100
    delivery_accuracy = Column(Float, default=0.0)  # 0-100
    communication_score = Column(Float, default=0.0)  # 0-100
    
    # Metrics
    total_orders = Column(Integer, default=0)
    completed_orders = Column(Integer, default=0)
    on_time_deliveries = Column(Integer, default=0)
    average_response_time_hours = Column(Float, default=0.0)
    
    # Reviews
    total_reviews = Column(Integer, default=0)
    positive_reviews = Column(Integer, default=0)
    neutral_reviews = Column(Integer, default=0)
    negative_reviews = Column(Integer, default=0)
    
    # Verification
    is_verified = Column(String, default=False)
    verification_date = Column(DateTime, nullable=True)
    verification_method = Column(String, nullable=True)  # email, phone, id, business
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="reputation")
    reviews = relationship("Review", back_populates="reputation_metric")

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reviewed_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)
    category = Column(String, nullable=False)  # quality, communication, delivery, overall
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    reviewer = relationship("User", foreign_keys=[reviewer_id])
    reviewed_user = relationship("User", foreign_keys=[reviewed_user_id])
    order = relationship("Order")
    reputation_metric = relationship("ReputationMetric", back_populates="reviews")
