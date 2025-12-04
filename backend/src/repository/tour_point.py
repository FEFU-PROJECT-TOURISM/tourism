from model.db.point import TourPointOrm
from repository.base import BaseRepository
from repository.mapper.tour_point import TourPointMapper


class TourPointRepository(BaseRepository):
    model = TourPointOrm
    mapper = TourPointMapper