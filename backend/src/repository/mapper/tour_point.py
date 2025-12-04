from model.schemas.tour_point import TourPoint
from repository.mapper.base import BaseMapper


class TourPointMapper(BaseMapper):
    schema = TourPoint