from model.db.point import PointMediaOrm
from repository.base import BaseRepository
from repository.mapper.point_media import PointMediaMapper


class PointMediaRepository(BaseRepository):
    model = PointMediaOrm
    mapper = PointMediaMapper