from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    google_cloud_project: str
    google_cloud_storage_bucket: str
    google_application_credentials: Optional[str] = None

    gemini_api_key: str

    paypal_client_id: Optional[str] = None
    paypal_client_secret: Optional[str] = None
    paypal_base_url: str = "https://api.sandbox.paypal.com"

    bizum_api_key: Optional[str] = None
    bizum_api_secret: Optional[str] = None
    bizum_base_url: str = "https://api.bizum.es"

    class Config:
        env_file = ".env"

settings = Settings()