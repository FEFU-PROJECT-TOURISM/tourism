from model.schemas.tour import TourAdd, TourAddReq
from service.tour import TourService
from service.tour_point import TourPointService
from view.base import BaseView


class TourView(BaseView):

    async def get_tours(self):
        return await TourService(db=self._db).get_tours()
    

    async def get_tour(self, tour_id: int):
        return await TourService(db=self._db).get_tour(tour_id=tour_id)


    async def create_tour(self, tour: TourAddReq, org_id: int):
        created_tour = await TourService(db=self._db).create_tour(tour, org_id)
        created_tour_points = await TourPointService(db=self._db).create_tour_point(created_tour.id, tour.tour_point_ids)
        await self._db.commit()
        return "OK"
    


