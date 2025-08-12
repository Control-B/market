from fastapi import APIRouter
from app.api.v1.endpoints import auth, rfps, offers, users, organizations, products, orders, pools, ai_concierge

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(rfps.router, prefix="/rfps", tags=["rfps"])
api_router.include_router(offers.router, prefix="/rfps", tags=["offers"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(pools.router, prefix="/pools", tags=["pools"])
api_router.include_router(ai_concierge.router, prefix="/ai-concierge", tags=["ai-concierge"])
