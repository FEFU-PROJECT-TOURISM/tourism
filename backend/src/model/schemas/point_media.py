from pydantic import BaseModel

from model.schemas.base import Id


class PointMediaAdd(BaseModel):
    media_id: int
    point_id: int


class PointMedia(PointMediaAdd, Id):
    pass