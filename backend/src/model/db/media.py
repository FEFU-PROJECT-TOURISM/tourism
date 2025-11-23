from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base
from model.db.base import Id


class MediaOrm(Base, Id):
    __tablename__ = 'Media'

    url: Mapped[str] = mapped_column()

    points: Mapped[list["PointOrm"]] = relationship(
        back_populates="media",
        secondary="PointMedia"
    )