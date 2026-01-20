from sqlalchemy import select
from sqlalchemy.orm import selectinload

from model.db.point import PointOrm
from repository.base import BaseRepository
from repository.mapper.point import PointMapper


class PointRepository(BaseRepository):
    model = PointOrm
    mapper = PointMapper

    async def get_points_with_media(self):
        """Получает все точки с загруженными медиа"""
        stmt = (
            select(self.model)
            .options(selectinload(PointOrm.media))
        )
        result = await self._session.execute(stmt)
        points = result.scalars().all()
        return points
