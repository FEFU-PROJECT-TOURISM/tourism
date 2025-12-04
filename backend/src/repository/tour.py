from sqlalchemy import select, insert
from sqlalchemy.orm import selectinload

from model.db.point import PointOrm, PointMediaOrm
from model.db.tour import TourOrm
from repository.base import BaseRepository
from repository.mapper.tour import TourMapper


class TourRepository(BaseRepository):
    model = TourOrm
    mapper = TourMapper

    async def get_with_rel(self):
        stmt = select(self.model).options(selectinload(self.model.points).selectinload(PointOrm.media))
        result = await self._session.execute(stmt)
        return result.scalars().all()