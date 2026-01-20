from sqlalchemy import select, insert
from sqlalchemy.orm import selectinload, joinedload

from model.db.point import PointOrm, PointMediaOrm, TourPointOrm
from model.db.tour import TourOrm
from model.db.organization import OrganizationOrm
from repository.base import BaseRepository
from repository.mapper.tour import TourMapper


class TourRepository(BaseRepository):
    model = TourOrm
    mapper = TourMapper

    async def get_with_rel(self, *filter, **filter_by):
        # Если передан org_id, добавляем фильтр по организации
        stmt = (
            select(self.model)
            .filter(*filter)
            .filter_by(**filter_by)
            .options(
                joinedload(self.model.organization).selectinload(OrganizationOrm.phones),
                selectinload(self.model.points)
                .selectinload(PointOrm.media)
            )
        )
        result = await self._session.execute(stmt)
        tours = result.scalars().all()
        
        # Сортируем точки по порядку для каждого тура
        for tour in tours:
            # Получаем TourPoint записи для сортировки
            tour_points_stmt = (
                select(TourPointOrm)
                .filter_by(tour_id=tour.id)
                .order_by(TourPointOrm.order)
            )
            tour_points_result = await self._session.execute(tour_points_stmt)
            tour_points = tour_points_result.scalars().all()
            
            # Создаем словарь для быстрого доступа
            point_order_map = {tp.point_id: tp.order for tp in tour_points}
            
            # Сортируем точки по порядку
            tour.points.sort(key=lambda p: point_order_map.get(p.id, 999))
        
        return tours