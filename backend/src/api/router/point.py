import json

from fastapi import APIRouter, UploadFile, Body, Form

from api.depends.db import db_dep
from view.point import PointView

from model.schemas.point import PointAdd

router = APIRouter(prefix="/point", tags=["Point"])

@router.get("")
async def get_points(
        db: db_dep
):
    return await PointView(db=db).get_points()


@router.post("")
async def create_point(
        db: db_dep,
        photos: list[UploadFile],
        # point_add: PointAdd = Body(...),
        point_add: str = Form(...)
):
    point_data = json.loads(point_add)
    point_add = PointAdd(**point_data)
    return await PointView(db=db).create_point(data=point_add, photos=photos)