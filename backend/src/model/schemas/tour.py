from model.schemas.base import Name, Id


class TourAdd(Name):
    description: str = ""


class Tour(TourAdd, Id):
    pass