from model.schemas.tour import Tour
from repository.mapper.base import BaseMapper


class TourMapper(BaseMapper):
    schema = Tour