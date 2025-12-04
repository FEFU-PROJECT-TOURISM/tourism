from fastapi import APIRouter

from api.depends.db import db_dep
from model.schemas.tour import TourAdd, TourAddReq
from view.tour import TourView

router = APIRouter(prefix="/tour", tags=["Tour"])


@router.get("")
async def get_tours(
        db: db_dep,
):
    return await TourView(db=db).get_tours()


@router.post("")
async def create_tour(
    db: db_dep,
    tour: TourAddReq,

):
    return await TourView(db=db).create_tour(
        tour=tour
    )