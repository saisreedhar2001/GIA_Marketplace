from pydantic_settings import BaseSettings
import os
from typing import Optional


class Settings(BaseSettings):
    firebase_project_id: str = "fir-gia-95889"
    firebase_private_key: str = ""
    firebase_client_email: str = ""
    razorpay_key_id: str = "your_razorpay_key"
    razorpay_key_secret: str = "your_razorpay_secret"
    api_port: int = 8000
    environment: str = "development"
    cors_origins: list = ["http://localhost:3000", "http://localhost:3001", "http://localhost:8000"]

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields from .env


settings = Settings()
