from model.schemas.organization import OrganizationCreate, OrganizationLogin
from service.organization import OrganizationService
from view.base import BaseView


class OrganizationView(BaseView):

    async def register(self, org_data: OrganizationCreate):
        result = await OrganizationService(db=self._db).register(org_data)
        await self._db.commit()
        return result

    async def login(self, login_data: OrganizationLogin):
        return await OrganizationService(db=self._db).login(login_data)
