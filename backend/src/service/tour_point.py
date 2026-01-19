from sqlalchemy.exc import IntegrityError

from model.schemas.tour_point import TourPointAdd
from model.schemas.tour import TourPointOrder
from service.base import BaseService


class TourPointService(BaseService):

    async def create_tour_point(self, tour_id: int, tour_points: list[TourPointOrder]):
        try:
            tour_points_data = [
                TourPointAdd(tour_id=tour_id, point_id=tp.point_id, order=tp.order) 
                for tp in tour_points
            ]
            created_tour_points = await self.db.tour_point.create_bulk(tour_points_data)
            return created_tour_points
        except IntegrityError:
            raise Exception('Invalid fk')