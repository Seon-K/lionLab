from pathlib import Path
import os
import dj_database_url  # 추가: 배포 환경(PostgreSQL) DB 연결을 위해 필요
from dotenv import load_dotenv  # 수정: python-dotenv 추가

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")  # 수정: .env 파일 자동 로드

# 수정: SECRET_KEY 하드코딩 제거, .env 에서 읽도록 변경
SECRET_KEY = os.environ.get("SECRET_KEY", "replace-me")
DEBUG = os.environ.get("DEBUG", "True") == "True"
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'corsheaders',
    'rest_framework',  # 수정: djangorestframework 추가
    'books',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "mysite.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# 수정: 로컬은 SQLite, 배포 환경은 DATABASE_URL 환경변수로 PostgreSQL 자동 연결
DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}"
    )
}

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"  # 추가: collectstatic 결과물 저장 경로 (배포용)

# 수정: 하드코딩 대신 환경변수에서 읽도록 변경 (배포 시 Render 대시보드에서 프론트 주소 입력)
CORS_ALLOWED_ORIGINS = [
    origin for origin in os.environ.get(
        "CORS_ALLOWED_ORIGINS", "http://localhost:5173"
    ).split(",") if origin
]