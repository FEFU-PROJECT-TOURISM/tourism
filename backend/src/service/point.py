from model.schemas.point import PointAdd
from repository.mapper.point import PointMapper
from service.base import BaseService


class PointService(BaseService):

    async def get_points(self):
        """Получает все точки с медиа"""
        points = await self.db.point.get_points_with_media()
        return [PointMapper.to_schema_with_media(point) for point in points]


    async def create_point(self, data: PointAdd):
        created_point = await self.db.point.create(data)
        return created_point