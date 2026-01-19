from sqlalchemy import select
from sqlalchemy.orm import selectinload

from model.db.organization import OrganizationOrm, OrganizationPhoneOrm
from repository.base import BaseRepository
from repository.mapper.organization import OrganizationMapper, OrganizationPhoneMapper


class OrganizationRepository(BaseRepository):
    model = OrganizationOrm
    mapper = OrganizationMapper

    async def get_by_email(self, email: str):
        stmt = select(self.model).filter_by(email=email)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_with_phones(self, *filter, **filter_by):
        stmt = (
            select(self.model)
            .filter(*filter)
            .filter_by(**filter_by)
            .options(selectinload(self.model.phones))
        )
        result = await self._session.execute(stmt)
        return result.scalars().all()


class OrganizationPhoneRepository(BaseRepository):
    model = OrganizationPhoneOrm
    mapper = OrganizationPhoneMapper

    async def create_by_org_id(self, org_id: int, phones: list[int]):
        if not phones:
            return []
        phone_models = [
            OrganizationPhoneOrm(org_id=org_id, phone=phone) for phone in phones
        ]
        self._session.add_all(phone_models)
        await self._session.flush()
        return [OrganizationPhoneMapper.to_schema(phone) for phone in phone_models]
