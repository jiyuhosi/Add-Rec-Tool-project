import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient

# MongoDB 연결 설정
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "company_db")

# 비동기 MongoDB 클라이언트 (FastAPI 권장)
async_client = AsyncIOMotorClient(MONGO_URL)
async_database = async_client[DATABASE_NAME]

# 동기 MongoDB 클라이언트 (필요시 사용)
sync_client = MongoClient(MONGO_URL)
sync_database = sync_client[DATABASE_NAME]

# 컬렉션 이름들
COMPANIES_COLLECTION = "companies"
OFFICES_COLLECTION = "offices"
DEPARTMENTS_COLLECTION = "departments"
DIVISIONS_COLLECTION = "divisions"

async def get_database():
    """비동기 데이터베이스 연결 반환"""
    return async_database

def get_sync_database():
    """동기 데이터베이스 연결 반환"""
    return sync_database
