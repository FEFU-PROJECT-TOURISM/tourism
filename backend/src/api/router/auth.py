from fastapi import APIRouter

from api.depends.db import db_dep
from model.schemas.organization import OrganizationCreate, OrganizationLogin
from view.organization import OrganizationView

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
async def register(
    db: db_dep,
    org_data: OrganizationCreate,
):
    return await OrganizationView(db=db).register(org_data)


@router.post("/login")
async def login(
    db: db_dep,
    login_data: OrganizationLogin,
):
    return await OrganizationView(db=db).login(login_data)
