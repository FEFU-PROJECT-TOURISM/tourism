from typing import Annotated

from database import async_session_maker
from fastapi import Depends
from utils.db_manager import DBManager


async def get_db_manager():
    async with DBManager(async_session_maker) as db:
        yield db


db_dep = Annotated[DBManager, Depends(get_db_manager)]