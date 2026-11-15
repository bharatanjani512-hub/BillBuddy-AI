import os
from pathlib import Path

from dotenv import load_dotenv

# ==================================================
# Load environment variables from .env
# ==================================================

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH, override=True)


class Settings:
    # ==========================
    # App
    # ==========================
    APP_NAME = "BillBuddy AI"
    APP_VERSION = "1.0.0"

    # ==========================
    # MongoDB
    # ==========================
    MONGO_URI = os.getenv("MONGO_URI")
    DATABASE_NAME = os.getenv("DATABASE_NAME")

    # ==========================
    # JWT Authentication
    # ==========================
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)
    )

    # ==========================
    # Google Gemini
    # ==========================
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = os.getenv(
        "GEMINI_MODEL",
        "gemini-3.6-flash",
    )


settings = Settings()