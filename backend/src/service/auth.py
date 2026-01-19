import jwt
import loguru

from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

from config.manager import settings
from model.schemas.organization import Organization, OrganizationTokenData


class InvalidToken(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


class TokenExpired(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )


class AuthService:

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @classmethod
    def get_dict(cls, organization: Organization) -> dict:
        return OrganizationTokenData(
            id=organization.id,
            email=organization.email,
            name=organization.name
        ).model_dump()

    @classmethod
    def create_access_token(cls, organization: Organization):
        data = cls.get_dict(organization)
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.JWT_MIN,
            hours=settings.JWT_HOUR,
            days=settings.JWT_DAY
        )
        to_encode |= {"exp": expire}
        encoded_jwt = jwt.encode(
            to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
        )
        return encoded_jwt

    @classmethod
    def hash_password(cls, password: str) -> str:
        return cls.pwd_context.hash(password)

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str):
        return cls.pwd_context.verify(plain_password, hashed_password)

    @classmethod
    def decode_token(cls, token: str):
        try:
            return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        except jwt.exceptions.DecodeError as e:
            raise InvalidToken
        except jwt.exceptions.ExpiredSignatureError as e:
            raise TokenExpired

