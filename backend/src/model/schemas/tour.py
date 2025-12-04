from model.schemas.base import Name, Id
from model.schemas.point import Point


class TourBase(Name):
    description: str = ""

class TourAddReq(TourBase):
    tour_point_ids: list[int]

class TourAdd(TourBase):
    pass

class Tour(TourBase, Id):
    pass