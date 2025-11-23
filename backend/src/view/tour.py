from service.tour import TourService
from view.base import BaseView


class TourView(BaseView):

    async def get_tours(self):
        return await TourService(db=self._db).get_tours()