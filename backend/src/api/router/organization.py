from fastapi import APIRouter, HTTPException
from typing import Annotated

from api.depends.db import db_dep
from api.depends.auth import current_org_dep
from model.schemas.organization import OrganizationTokenData, OrganizationUpdate
from view.organization import OrganizationView
from view.tour import TourView

router = APIRouter(prefix="/organization", tags=["Organization"])


@router.get("/{org_id}")
async def get_organization(
    db: db_dep,
    org_id: int,
):
    """Получение информации об организации"""
    return await OrganizationView(db=db).get_organization(org_id=org_id)


@router.put("/{org_id}")
async def update_organization(
    db: db_dep,
    org_id: int,
    org_data: OrganizationUpdate,
    current_org: current_org_dep,
):
    """Обновление информации об организации (только для владельца)"""
    if current_org.id != org_id:
        raise HTTPException(status_code=403, detail="Нет доступа к редактированию этой организации")
    return await OrganizationView(db=db).update_organization(org_id=org_id, org_data=org_data)


@router.get("/{org_id}/tours")
async def get_organization_tours(
    db: db_dep,
    org_id: int,
):
    """Получение туров организации"""
    return await TourView(db=db).get_tours_by_organization(org_id=org_id)
