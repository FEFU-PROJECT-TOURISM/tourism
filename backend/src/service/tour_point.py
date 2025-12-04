from sqlalchemy.exc import IntegrityError

from model.schemas.tour_point import TourPointAdd
from service.base import BaseService


class TourPointService(BaseService):

    async def create_tour_point(self, tour_id: int, points_id: list[int]):
        try:
            tour_points = await self.db.tour_point.create_bulk(TourPointAdd(tour_id=tour_id, point_id=p_id) for p_id in points_id)
            return tour_points
        except IntegrityError:
            raise Exception('Invalid fk')