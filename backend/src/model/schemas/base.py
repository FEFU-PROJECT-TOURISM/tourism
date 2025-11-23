from pydantic import BaseModel


class Name(BaseModel):
    name: str


class Description(BaseModel):
    description: str


class Id(BaseModel):
    id: int