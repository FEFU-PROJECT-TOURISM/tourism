from model.schemas.organization import Organization, OrganizationPhone
from repository.mapper.base import BaseMapper


class OrganizationMapper(BaseMapper):
    schema = Organization


class OrganizationPhoneMapper(BaseMapper):
    schema = OrganizationPhone
