from sqlalchemy import String, ForeignKey, Numeric, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base
from model.db.base import Id, TourId


class PointOrm(Base, Id):
    __tablename__ = "Point"

    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(255))
    latitude: Mapped[float] = mapped_column(Numeric(9, 6))
    longitude: Mapped[float] = mapped_column(Numeric(9, 6))

    media: Mapped[list["MediaOrm"]] = relationship(
        back_populates="points",
        secondary="PointMedia"
    )

    tour: Mapped["TourOrm"] = relationship(back_populates="points", secondary="TourPoint")


class PointMediaOrm(Base):
    __tablename__ = 'PointMedia'

    point_id: Mapped[int] = mapped_column(
        ForeignKey('Point.id'),
        primary_key=True
    )
    media_id: Mapped[int] = mapped_column(
        ForeignKey('Media.id'),
        primary_key=True
    )


class TourPointOrm(Base, Id, TourId):
    __tablename__ = "TourPoint"

    point_id: Mapped[int] = mapped_column(ForeignKey("Point.id"))