from fastapi import APIRouter


router = APIRouter(prefix="/metrics", tags=["Metrics"])
#
# @router.get("")
# async def get_metrics():