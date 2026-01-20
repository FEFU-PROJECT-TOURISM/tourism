from pydantic import BaseModel, EmailStr
from model.schemas.base import Id


class OrganizationPhoneBase(BaseModel):
    phone: int


class OrganizationPhone(OrganizationPhoneBase, Id):
    org_id: int


class OrganizationPhoneAdd(OrganizationPhoneBase):
    org_id: int


class OrganizationBase(BaseModel):
    name: str
    email: EmailStr
    address: str | None = None


class OrganizationCreate(OrganizationBase):
    password: str
    phones: list[int] = []


class OrganizationUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    phones: list[int] | None = None


class OrganizationLogin(BaseModel):
    email: EmailStr
    password: str


class Organization(OrganizationBase, Id):
    phones: list[OrganizationPhone] = []


class OrganizationTokenData(BaseModel):
    id: int
    email: str
    name: str
