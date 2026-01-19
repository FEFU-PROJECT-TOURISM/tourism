import loguru
from pydantic import BaseModel
from sqlalchemy import select, insert

class BaseRepository:
    model = None
    mapper = None


    def __init__(self, session):
        self._session = session


    async def read_filtered(self, *filter, **filter_by):
        stmt = select(self.model).filter(*filter).filter_by(**filter_by)
        result = await self._session.execute(stmt)
        return [self.mapper.to_schema(res) for res in result.scalars().all()]


    async def create(self, data):
        stmt = insert(self.model).values(**data.model_dump()).returning(self.model)
        result = await self._session.execute(stmt)
        model_instance = result.scalars().one()
        # Используем базовый маппер для создания, чтобы избежать проблем с lazy loading
        return self.mapper.to_schema(model_instance)


    async def create_bulk(self, data: list[BaseModel]):
        stmt = insert(self.model).values([d.model_dump() for d in data]).returning(self.model)
        result = await self._session.execute(stmt)
        # loguru.logger.debug(result.scalars().all())
        return [self.mapper.to_schema(res) for res in result.scalars().all()]