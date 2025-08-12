from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_orders():
    """List orders - TODO: Implement"""
    return {"message": "Orders endpoint - coming soon"}

@router.post("/")
async def create_order():
    """Create order - TODO: Implement"""
    return {"message": "Create order - coming soon"}
