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
        created_tour_points = await TourPointService(db=self._db).create_tour_point(created_tour.id, tour.tour_points)
        await self._db.commit()
        return "OK"

    async def get_tours_by_organization(self, org_id: int):
        return await TourService(db=self._db).get_tours_by_organization(org_id=org_id)

    async def update_tour(self, tour_id: int, tour: TourAddReq, current_org_id: int):
        return await TourService(db=self._db).update_tour(tour_id=tour_id, tour=tour, org_id=current_org_id)

    async def delete_tour(self, tour_id: int, current_org_id: int):
        await TourService(db=self._db).delete_tour(tour_id=tour_id, org_id=current_org_id)
        await self._db.commit()
        return {"message": "Тур успешно удален"}


