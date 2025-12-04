from model.schemas.tour import TourAdd, TourAddReq, Tour
from service.base import BaseService


class TourService(BaseService):

    async def get_tours(self):
        return await self.db.tour.get_with_rel()


    async def create_tour(self, tour: TourAddReq) -> Tour:
        return await self.db.tour.create(TourAdd(
            name=tour.name,
            description=tour.description,
            )
        )
