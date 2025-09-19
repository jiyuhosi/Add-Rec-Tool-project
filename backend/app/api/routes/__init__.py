from fastapi import APIRouter
from app.api.routes import companies

api_router = APIRouter()

# 企業ルーター登録
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])