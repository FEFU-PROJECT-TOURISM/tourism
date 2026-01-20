from fastapi import HTTPException, status

from model.schemas.organization import OrganizationCreate, OrganizationLogin, Organization, OrganizationUpdate
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
        
        # Обрабатываем address: если не указан или пустая строка, сохраняем None
        address_value = None
        if org_data.address and org_data.address.strip():
            address_value = org_data.address.strip()
        
        org_orm = OrganizationOrm(
            name=org_data.name,
            email=org_data.email,
            hashed_password=hashed_password,
            address=address_value
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

    async def get_organization(self, org_id: int) -> Organization:
        orgs = await self.db.organization.get_with_phones(id=org_id)
        if len(orgs) == 0:
            raise HTTPException(status_code=404, detail="Организация не найдена")
        return OrganizationMapper.to_schema(orgs[0])

    async def update_organization(self, org_id: int, data: OrganizationUpdate) -> Organization:
        # Получаем организацию
        orgs = await self.db.organization.get_with_phones(id=org_id)
        if len(orgs) == 0:
            raise HTTPException(status_code=404, detail="Организация не найдена")
        
        # Обновляем поля
        update_data = {}
        if data.name is not None:
            update_data['name'] = data.name
        if data.address is not None:
            # Если передана пустая строка, сохраняем None
            update_data['address'] = data.address.strip() if data.address.strip() else None
        
        # Обновляем основную информацию
        if update_data:
            from sqlalchemy import update
            stmt = update(self.db.organization.model).where(
                self.db.organization.model.id == org_id
            ).values(**update_data)
            await self.db._async_session.execute(stmt)
        
        # Обновляем телефоны, если они переданы
        if data.phones is not None:
            # Удаляем старые телефоны
            from sqlalchemy import delete
            from model.db.organization import OrganizationPhoneOrm
            delete_stmt = delete(OrganizationPhoneOrm).where(OrganizationPhoneOrm.org_id == org_id)
            await self.db._async_session.execute(delete_stmt)
            
            # Добавляем новые телефоны
            if len(data.phones) > 0:
                from repository.organization import OrganizationPhoneRepository
                phone_repo = OrganizationPhoneRepository(self.db._async_session)
                from model.schemas.organization import OrganizationPhoneAdd
                phone_adds = [OrganizationPhoneAdd(phone=phone, org_id=org_id) for phone in data.phones]
                await phone_repo.create_bulk(phone_adds)
        
        # Получаем обновленную организацию
        return await self.get_organization(org_id)
