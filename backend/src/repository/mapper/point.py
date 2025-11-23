from repository.mapper.base import BaseMapper

from model.schemas.point import Point


class PointMapper(BaseMapper):
    schema = Point