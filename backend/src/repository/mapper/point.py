from repository.mapper.base import BaseMapper
from repository.mapper.media import MediaMapper

from model.schemas.point import Point, PointWithMedia


class PointMapper(BaseMapper):
    schema = Point

    @staticmethod
    def to_schema_with_media(orm_instance):
        """Преобразует ORM объект точки с медиа в схему PointWithMedia"""
        point_data = PointMapper.to_schema(orm_instance).model_dump()
        media_list = []
        if hasattr(orm_instance, 'media') and orm_instance.media:
            media_list = [MediaMapper.to_schema(media) for media in orm_instance.media]
        return PointWithMedia(**point_data, media=media_list)