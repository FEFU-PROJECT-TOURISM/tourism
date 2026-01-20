from model.schemas.organization import OrganizationCreate, OrganizationLogin, OrganizationUpdate
from service.organization import OrganizationService
from view.base import BaseView


class OrganizationView(BaseView):

    async def register(self, org_data: OrganizationCreate):
        result = await OrganizationService(db=self._db).register(org_data)
        await self._db.commit()
        return result

    async def login(self, login_data: OrganizationLogin):
        return await OrganizationService(db=self._db).login(login_data)

    async def get_organization(self, org_id: int):
        return await OrganizationService(db=self._db).get_organization(org_id=org_id)

    async def update_organization(self, org_id: int, org_data: OrganizationUpdate):
        result = await OrganizationService(db=self._db).update_organization(org_id=org_id, data=org_data)
        await self._db.commit()
        return result
