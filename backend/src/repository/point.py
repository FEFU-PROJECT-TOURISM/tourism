from model.db.point import PointOrm
from repository.base import BaseRepository
from repository.mapper.point import PointMapper


class PointRepository(BaseRepository):
    model = PointOrm
    mapper = PointMapper
