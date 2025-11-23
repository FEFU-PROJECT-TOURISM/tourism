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
        media_db = await MediaService(db=self._db).create_media_bulk(photos)
        loguru.logger.debug(media_db)

        point = await PointService(db=self._db).create_point(data)
        loguru.logger.debug(point)
        point_medias = await PointMediaService(db=self._db).create_point_media(point, media_db)
        await self._db.commit()
        return PointWithMedia(**point.model_dump(), media=point_medias)

