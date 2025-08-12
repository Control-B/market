// User and Authentication Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  organization_id?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  BUYER = "buyer",
  SELLER = "seller",
  ADMIN = "admin",
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  is_verified: boolean;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
}

// RFP Types
export interface RFP {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  deadline: string;
  location?: string;
  requirements?: Record<string, any>;
  status: RFPStatus;
  buyer_id: string;
  organization_id?: string;
  is_private: boolean;
  ai_summary?: string;
  created_at: string;
  updated_at: string;
}

export enum RFPStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  CLOSED = "closed",
  AWARDED = "awarded",
  CANCELLED = "cancelled",
}

// Offer Types
export interface Offer {
  id: string;
  rfp_id: string;
  seller_id: string;
  price: number;
  description: string;
  delivery_time: number; // days
  terms: string;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
}

export enum OfferStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

// Product Types
export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock_quantity: number;
  images: string[];
  specifications: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Order Types
export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  rfp_id?: string;
  product_id?: string;
  quantity: number;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_address: Address;
  created_at: string;
  updated_at: string;
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

// Address Type
export interface Address {
  id: string;
  user_id?: string;
  organization_id?: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Group Buy Types
export interface Pool {
  id: string;
  name: string;
  description: string;
  product_id: string;
  min_quantity: number;
  target_quantity: number;
  current_quantity: number;
  base_price: number;
  tiers: PoolTier[];
  deadline: string;
  status: PoolStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PoolTier {
  quantity: number;
  discount_percentage: number;
}

export enum PoolStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Search Types
export interface SearchFilters {
  category?: string;
  price_min?: number;
  price_max?: number;
  location?: string;
  seller_rating?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// AI Concierge Types
export interface AIConciergeMessage {
  id: string;
  user_id: string;
  rfp_id?: string;
  message: string;
  response: string;
  created_at: string;
}

// Reputation Types
export interface ReputationMetric {
  id: string;
  user_id: string;
  overall_score: number;
  delivery_score: number;
  communication_score: number;
  quality_score: number;
  total_orders: number;
  on_time_delivery_rate: number;
  created_at: string;
  updated_at: string;
}
