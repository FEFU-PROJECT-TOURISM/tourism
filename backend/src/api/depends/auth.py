from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from api.depends.db import db_dep
from service.auth import AuthService, InvalidToken, TokenExpired
from model.schemas.organization import OrganizationTokenData

security = HTTPBearer()


async def get_current_organization(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: db_dep
) -> OrganizationTokenData:
    token = credentials.credentials
    
    try:
        payload = AuthService.decode_token(token)
        org_id = payload.get("id")
        if org_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
    except (InvalidToken, TokenExpired) as e:
        raise e
    
    # Проверяем, что организация существует
    org = await db.organization.get_by_email(payload.get("email"))
    if org is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Organization not found"
        )
    
    return OrganizationTokenData(**payload)


current_org_dep = Annotated[OrganizationTokenData, Depends(get_current_organization)]
