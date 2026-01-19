from model.schemas.base import Name, Id
from model.schemas.point import Point
from model.schemas.organization import Organization


class TourBase(Name):
    description: str = ""

from pydantic import BaseModel

class TourPointOrder(BaseModel):
    point_id: int
    order: int

class TourAddReq(TourBase):
    tour_points: list[TourPointOrder]

class TourAdd(TourBase):
    pass

class Tour(TourBase, Id):
    organization: Organization | None = None