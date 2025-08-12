from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_pools():
    """List buying pools - TODO: Implement"""
    return {"message": "Pools endpoint - coming soon"}

@router.post("/")
async def create_pool():
    """Create buying pool - TODO: Implement"""
    return {"message": "Create pool - coming soon"}
