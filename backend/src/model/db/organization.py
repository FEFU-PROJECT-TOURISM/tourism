from sqlalchemy import String, ForeignKey, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base
from model.db.base import Id


class OrganizationOrm(Base, Id):
    __tablename__ = "Organization"

    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255))

    phones: Mapped[list["OrganizationPhoneOrm"]] = relationship(
        back_populates="organization",
        cascade="all, delete-orphan"
    )
    tours: Mapped[list["TourOrm"]] = relationship(
        back_populates="organization"
    )


class OrganizationPhoneOrm(Base, Id):
    __tablename__ = "OrganizationPhone"

    org_id: Mapped[int] = mapped_column(ForeignKey("Organization.id"))
    phone: Mapped[int] = mapped_column(BigInteger)

    organization: Mapped["OrganizationOrm"] = relationship(back_populates="phones")
