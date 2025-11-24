from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base
from model.db.base import Id


class TourOrm(Base, Id):
    __tablename__ = 'Tour'

    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(255))


    points: Mapped[list['PointOrm']] = relationship(back_populates='tour', secondary='TourPoint')