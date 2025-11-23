from service.base import BaseService


class TourService(BaseService):

    async def get_tours(self):
        return await self.db.tour.get_with_rel()
