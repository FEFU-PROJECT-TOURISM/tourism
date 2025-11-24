from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from config.setting import settings


class Base(DeclarativeBase):
    pass


engine = create_async_engine(settings.DB_URL)
async_session_maker = async_sessionmaker(engine)
