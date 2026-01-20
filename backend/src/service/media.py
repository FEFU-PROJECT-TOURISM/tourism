import loguru

from connectors.s3 import s3_client
from model.schemas.media import MediaAdd, Media
from service.base import BaseService


class MediaService(BaseService):


    async def create_media_bulk(self, files: list | None) -> list[Media]:
        if not files or len(files) == 0:
            return []
        medias = []
        for file in files:
            url = await s3_client.upload_file(file)
            medias.append(MediaAdd(url=url))
            # created_media = await self.db.media.create(schema)
            # medias.append(created_media)
        medias = await self.db.media.create_bulk(medias)
        loguru.logger.debug(medias)
        return medias
        # return await self.db.media.create_bulk(medias)
