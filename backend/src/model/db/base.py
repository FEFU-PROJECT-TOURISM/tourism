from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column


class Id:
    id: Mapped[int] = mapped_column(primary_key=True)

class TourId:
    tour_id: Mapped[int] = mapped_column(ForeignKey("Tour.id"))
