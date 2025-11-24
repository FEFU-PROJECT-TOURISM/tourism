from model.schemas.media import Media
from repository.mapper.base import BaseMapper


class MediaMapper(BaseMapper):
    schema = Media