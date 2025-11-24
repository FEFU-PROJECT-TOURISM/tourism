from pydantic import BaseModel

from model.schemas.base import Id


class MediaAdd(BaseModel):
    url: str

class Media(MediaAdd, Id):
    pass