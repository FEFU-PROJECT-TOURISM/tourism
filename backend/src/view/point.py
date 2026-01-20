import loguru

from model.schemas.point import PointWithMedia
from service.media import MediaService
from service.point_media import PointMediaService
from view.base import BaseView

from service.point import PointService


class PointView(BaseView):

    async def get_points(self):
        return await PointService(db=self._db).get_points()


    async def create_point(self, data, photos: list | None = None):
        # Если фото не переданы, создаем пустой список медиа
        if photos and len(photos) > 0:
            media_db = await MediaService(db=self._db).create_media_bulk(photos)
            loguru.logger.debug(media_db)
        else:
            media_db = []

        point = await PointService(db=self._db).create_point(data)
        loguru.logger.debug(point)
        
        # Создаем связи с медиа только если они есть
        if media_db:
            point_medias = await PointMediaService(db=self._db).create_point_media(point, media_db)
        else:
            point_medias = []
        
        await self._db.commit()
        return PointWithMedia(**point.model_dump(), media=point_medias)

