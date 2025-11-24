from fastapi import APIRouter, status

router = APIRouter(prefix="/health", tags=["Health"])

@router.get(
    path="",
    description="Health check",
    response_model=str,
    status_code=status.HTTP_200_OK,
)
async def health():
    return "OK"
