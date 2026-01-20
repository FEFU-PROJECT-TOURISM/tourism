from pydantic import BaseModel

from model.schemas.base import Name, Description, Id
from model.schemas.media import Media


class PointAdd(Name, Description):
    longitude: float
    latitude: float


class Point(Id, PointAdd):
    pass


class PointWithMedia(Point):
    media: list[Media]