from model.schemas.base import TourId, Id


class TourPointAdd(TourId):
    point_id: int


class TourPoint(TourPointAdd, Id):
    pass