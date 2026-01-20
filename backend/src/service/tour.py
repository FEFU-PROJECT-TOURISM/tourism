from model.schemas.tour import TourAdd, TourAddReq, Tour
from service.base import BaseService


class TourService(BaseService):

    async def get_tours(self):
        return await self.db.tour.get_with_rel()


    async def get_tour(self, tour_id: int) -> Tour:
        tour = await self.db.tour.get_with_rel(id=tour_id)
        if len(tour) == 0:
            return {}
        else:
            return tour[0]


    async def create_tour(self, tour: TourAddReq, org_id: int) -> Tour:
        from pydantic import BaseModel
        class TourAddWithOrg(BaseModel):
            name: str
            description: str
            org_id: int
        
        return await self.db.tour.create(TourAddWithOrg(
            name=tour.name,
            description=tour.description,
            org_id=org_id
            )
        )

    async def get_tours_by_organization(self, org_id: int):
        tours = await self.db.tour.get_with_rel(org_id=org_id)
        return tours

    async def update_tour(self, tour_id: int, tour: TourAddReq, org_id: int) -> Tour:
        from fastapi import HTTPException
        from sqlalchemy import update
        from model.db.tour import TourOrm
        
        # Проверяем существование тура и права доступа
        existing_tours = await self.db.tour.get_with_rel(id=tour_id)
        if len(existing_tours) == 0:
            raise HTTPException(status_code=404, detail="Тур не найден")
        
        existing_tour = existing_tours[0]
        # Проверяем права доступа через inspect, чтобы избежать lazy loading
        from sqlalchemy import inspect
        insp = inspect(existing_tour)
        org_attr = insp.attrs.get('organization')
        if org_attr and hasattr(org_attr, 'loaded_value') and org_attr.loaded_value:
            if org_attr.loaded_value.id != org_id:
                raise HTTPException(status_code=403, detail="Нет доступа к редактированию этого тура")
        
        # Обновляем основную информацию тура
        stmt = update(TourOrm).where(TourOrm.id == tour_id).values(
            name=tour.name,
            description=tour.description
        )
        await self.db._async_session.execute(stmt)
        
        # Обновляем точки тура
        from service.tour_point import TourPointService
        tour_point_service = TourPointService(db=self.db)
        
        # Удаляем старые связи
        from sqlalchemy import delete
        from model.db.point import TourPointOrm
        delete_stmt = delete(TourPointOrm).where(TourPointOrm.tour_id == tour_id)
        await self.db._async_session.execute(delete_stmt)
        
        # Создаем новые связи
        await tour_point_service.create_tour_point(tour_id, tour.tour_points)
        
        # Получаем обновленный тур
        updated_tours = await self.db.tour.get_with_rel(id=tour_id)
        return updated_tours[0] if len(updated_tours) > 0 else None

    async def delete_tour(self, tour_id: int, org_id: int):
        from fastapi import HTTPException
        from sqlalchemy import delete
        from model.db.tour import TourOrm
        
        # Проверяем существование тура и права доступа
        existing_tours = await self.db.tour.get_with_rel(id=tour_id)
        if len(existing_tours) == 0:
            raise HTTPException(status_code=404, detail="Тур не найден")
        
        existing_tour = existing_tours[0]
        # Проверяем права доступа через inspect, чтобы избежать lazy loading
        from sqlalchemy import inspect
        insp = inspect(existing_tour)
        org_attr = insp.attrs.get('organization')
        if org_attr and hasattr(org_attr, 'loaded_value') and org_attr.loaded_value:
            if org_attr.loaded_value.id != org_id:
                raise HTTPException(status_code=403, detail="Нет доступа к удалению этого тура")
        
        # Удаляем связи с точками
        from model.db.point import TourPointOrm
        delete_points_stmt = delete(TourPointOrm).where(TourPointOrm.tour_id == tour_id)
        await self.db._async_session.execute(delete_points_stmt)
        
        # Удаляем тур
        delete_tour_stmt = delete(TourOrm).where(TourOrm.id == tour_id)
        await self.db._async_session.execute(delete_tour_stmt)
