from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_products():
    """List products - TODO: Implement"""
    return {"message": "Products endpoint - coming soon"}

@router.post("/")
async def create_product():
    """Create product - TODO: Implement"""
    return {"message": "Create product - coming soon"}
