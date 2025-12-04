from pydantic import BaseModel


class Name(BaseModel):
    name: str


class Description(BaseModel):
    description: str


class Id(BaseModel):
    id: int


class TourId(BaseModel):
    tour_id: int