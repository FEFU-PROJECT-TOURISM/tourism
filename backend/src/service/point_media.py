from model.schemas.media import Media
from model.schemas.point import Point
from model.schemas.point_media import PointMedia, PointMediaAdd
from service.base import BaseService


class PointMediaService(BaseService):

    async def create_point_media(self, point: Point, medias: list[Media]) -> list[PointMedia]:
        point_medias = [PointMediaAdd(point_id=point.id, media_id=media.id) for media in medias]
        result = await self.db.point_media.create_bulk(point_medias)
        return result