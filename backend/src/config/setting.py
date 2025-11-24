from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DB_NAME: str
    DB_PORT: int
    DB_USER: str
    DB_PASS: str
    DB_HOSTNAME: str

    S3_ACCESS_KEY: str
    S3_SECRET_KEY: str
    S3_ENDPOINT_URL: str
    S3_BUCKET_NAME: str
    # S3_REGION: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


    @property
    def DB_URL(self):
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOSTNAME}:{self.DB_PORT}/{self.DB_NAME}"


settings = Settings()