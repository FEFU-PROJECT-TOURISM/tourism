from config.setting import settings as base_settings


class Settings:
    DB_NAME: str = base_settings.DB_NAME
    DB_PORT: int = base_settings.DB_PORT
    DB_USER: str = base_settings.DB_USER
    DB_PASS: str = base_settings.DB_PASS
    DB_HOSTNAME: str = base_settings.DB_HOSTNAME

    S3_ACCESS_KEY: str = base_settings.S3_ACCESS_KEY
    S3_SECRET_KEY: str = base_settings.S3_SECRET_KEY
    S3_ENDPOINT_URL: str = base_settings.S3_ENDPOINT_URL
    S3_BUCKET_NAME: str = base_settings.S3_BUCKET_NAME

    JWT_SECRET_KEY: str = base_settings.JWT_SECRET_KEY
    JWT_ALGORITHM: str = base_settings.JWT_ALGORITHM
    JWT_MIN: int = base_settings.JWT_MIN
    JWT_HOUR: int = base_settings.JWT_HOUR
    JWT_DAY: int = base_settings.JWT_DAY


settings = Settings()
