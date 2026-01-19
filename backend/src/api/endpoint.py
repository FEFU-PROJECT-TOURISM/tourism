from fastapi import APIRouter

from api.router.health import router as health_router
from api.router.point import router as point_router
from api.router.tour import router as tour_router
from api.router.auth import router as auth_router

router = APIRouter()
router.include_router(health_router)
router.include_router(auth_router)
router.include_router(point_router)
router.include_router(tour_router)