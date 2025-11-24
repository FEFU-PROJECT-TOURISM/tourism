from model.schemas.point import PointAdd
from service.base import BaseService


class PointService(BaseService):

    async def get_points(self):
        return await self.db.point.read_filtered()


    async def create_point(self, data: PointAdd):
        created_point = await self.db.point.create(data)
        return created_point