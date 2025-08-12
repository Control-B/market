from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer, Float, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
import enum

from app.core.database import Base

class ProductStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"

class Product(Base):
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    subcategory = Column(String, nullable=True)
    
    # Pricing
    base_price = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    price_type = Column(String, default="fixed")  # fixed, hourly, per_unit
    
    # Inventory
    stock_quantity = Column(Integer, nullable=True)  # null for services
    min_order_quantity = Column(Integer, default=1)
    max_order_quantity = Column(Integer, nullable=True)
    
    # Seller info
    seller_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True)
    
    # Product details
    specifications = Column(JSON, nullable=True)  # Technical specs
    features = Column(JSON, nullable=True)  # Feature list
    tags = Column(JSON, nullable=True)  # Search tags
    
    # Status and visibility
    status = Column(Enum(ProductStatus), default=ProductStatus.DRAFT)
    is_featured = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    
    # SEO and marketing
    meta_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)
    slug = Column(String, nullable=True, unique=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    seller = relationship("User")
    organization = relationship("Organization")
    images = relationship("ProductImage", back_populates="product")
    variants = relationship("ProductVariant", back_populates="product")
    reviews = relationship("ProductReview", back_populates="product")

class ProductImage(Base):
    __tablename__ = "product_images"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    image_path = Column(String, nullable=False)
    alt_text = Column(String, nullable=True)
    is_primary = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    product = relationship("Product", back_populates="images")

class ProductVariant(Base):
    __tablename__ = "product_variants"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    name = Column(String, nullable=False)  # e.g., "Size", "Color"
    value = Column(String, nullable=False)  # e.g., "Large", "Red"
    price_adjustment = Column(Float, default=0.0)
    stock_quantity = Column(Integer, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    product = relationship("Product", back_populates="variants")

class ProductReview(Base):
    __tablename__ = "product_reviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String, nullable=True)
    comment = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    product = relationship("Product", back_populates="reviews")
    reviewer = relationship("User")
    order = relationship("Order")
