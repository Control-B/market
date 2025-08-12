from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

from app.core.database import Base

class RFPThread(Base):
    __tablename__ = "rfp_threads"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rfp_id = Column(UUID(as_uuid=True), ForeignKey("rfps.id"), nullable=False)
    title = Column(String, nullable=False)
    is_private = Column(Boolean, default=False)  # Private thread between buyer and specific seller
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    rfp = relationship("RFP", back_populates="threads")
    messages = relationship("RFPThreadMessage", back_populates="thread")

class RFPThreadMessage(Base):
    __tablename__ = "rfp_thread_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    thread_id = Column(UUID(as_uuid=True), ForeignKey("rfp_threads.id"), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    content = Column(Text, nullable=False)
    message_type = Column(String, default="text")  # text, file, offer_update, etc.
    
    # For file messages
    file_path = Column(String, nullable=True)
    file_name = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    thread = relationship("RFPThread", back_populates="messages")
    sender = relationship("User")
