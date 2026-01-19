from repository.media import MediaRepository
from repository.point import PointRepository
from repository.point_media import PointMediaRepository
from repository.tour import TourRepository
from repository.tour_point import TourPointRepository
from repository.organization import OrganizationRepository, OrganizationPhoneRepository


class DBManager:

    def __init__(self, async_session_factory):
        self._async_session_factory = async_session_factory


    async def __aenter__(self):
        self._async_session = self._async_session_factory()
        self.tour = TourRepository(self._async_session)
        self.tour_point = TourPointRepository(self._async_session)
        self.point = PointRepository(self._async_session)
        self.media = MediaRepository(self._async_session)
        self.point_media = PointMediaRepository(self._async_session)
        self.organization = OrganizationRepository(self._async_session)
        self.organization_phone = OrganizationPhoneRepository(self._async_session)
        return self


    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self._async_session.rollback()
        await self._async_session.close()

    async def commit(self):
        await self._async_session.commit()