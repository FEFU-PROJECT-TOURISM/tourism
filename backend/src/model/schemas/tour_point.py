from model.schemas.base import TourId, Id


class TourPointAdd(TourId):
    point_id: int
    order: int = 0


class TourPoint(TourPointAdd, Id):
    pass