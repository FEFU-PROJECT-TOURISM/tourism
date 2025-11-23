from model.db.media import MediaOrm
from repository.base import BaseRepository
from repository.mapper.media import MediaMapper


class MediaRepository(BaseRepository):
    model = MediaOrm
    mapper = MediaMapper