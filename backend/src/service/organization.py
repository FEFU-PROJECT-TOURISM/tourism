from fastapi import HTTPException, status

from model.schemas.organization import OrganizationCreate, OrganizationLogin, Organization
from repository.mapper.organization import OrganizationMapper
from service.base import BaseService
from service.auth import AuthService


class OrganizationService(BaseService):

    async def register(self, org_data: OrganizationCreate) -> dict:
        # Проверяем, существует ли организация с таким email
        existing_org = await self.db.organization.get_by_email(org_data.email)
        if existing_org:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization with this email already exists"
            )

        # Создаем организацию
        hashed_password = AuthService.hash_password(org_data.password)
        
        from pydantic import BaseModel
        class OrganizationAdd(BaseModel):
            name: str
            email: str
            hashed_password: str
        
        org_add = OrganizationAdd(
            name=org_data.name,
            email=org_data.email,
            hashed_password=hashed_password
        )
        
        # Создаем организацию через репозиторий, но без маппера для схемы
        # Используем прямой доступ к сессии для создания
        from model.db.organization import OrganizationOrm
        
        org_orm = OrganizationOrm(
            name=org_data.name,
            email=org_data.email,
            hashed_password=hashed_password
        )
        self.db.organization._session.add(org_orm)
        await self.db.organization._session.flush()

        # Создаем телефоны
        if org_data.phones:
            await self.db.organization_phone.create_by_org_id(
                org_orm.id, org_data.phones
            )
        
        await self.db.organization._session.flush()

        # Получаем организацию с телефонами для токена
        org_with_phones = await self.db.organization.get_with_phones(id=org_orm.id)
        if not org_with_phones:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create organization"
            )

        org_schema = OrganizationMapper.to_schema(org_with_phones[0])
        token = AuthService.create_access_token(org_schema)

        return {"access_token": token, "token_type": "bearer", "organization": org_schema}

    async def login(self, login_data: OrganizationLogin) -> dict:
        org = await self.db.organization.get_by_email(login_data.email)
        if not org:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not AuthService.verify_password(login_data.password, org.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Получаем организацию с телефонами
        org_with_phones = await self.db.organization.get_with_phones(id=org.id)
        if not org_with_phones:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get organization"
            )

        org_schema = OrganizationMapper.to_schema(org_with_phones[0])
        token = AuthService.create_access_token(org_schema)

        return {"access_token": token, "token_type": "bearer", "organization": org_schema}
