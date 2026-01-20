from fastapi import APIRouter
from typing import Annotated

from api.depends.db import db_dep
from api.depends.auth import current_org_dep
from model.schemas.tour import TourAdd, TourAddReq
from model.schemas.organization import OrganizationTokenData
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
    current_org: current_org_dep,
):
    return await TourView(db=db).create_tour(
        tour=tour,
        org_id=current_org.id
    )


@router.get("/{tour_id}")
async def get_tour(
    db: db_dep,
    tour_id: int,
):
    return await TourView(db=db).get_tour(tour_id=tour_id)


@router.put("/{tour_id}")
async def update_tour(
    db: db_dep,
    tour_id: int,
    tour: TourAddReq,
    current_org: current_org_dep,
):
    """Обновление тура (только для владельца)"""
    return await TourView(db=db).update_tour(
        tour_id=tour_id,
        tour=tour,
        current_org_id=current_org.id
    )


@router.delete("/{tour_id}")
async def delete_tour(
    db: db_dep,
    tour_id: int,
    current_org: current_org_dep,
):
    """Удаление тура (только для владельца)"""
    return await TourView(db=db).delete_tour(
        tour_id=tour_id,
        current_org_id=current_org.id
    )