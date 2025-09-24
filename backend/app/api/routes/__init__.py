from fastapi import APIRouter
from app.api.routes import companies
from app.api.routes import auth

api_router = APIRouter()

# 企業ルーター登録
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])