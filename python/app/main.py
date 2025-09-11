from fastapi import FastAPI, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import requests

# 로컬 모듈 임포트
from models import CompanyRequest, CompanyResponse, CompanyInput
from services import company_service

app = FastAPI(
    title="Company Management API",
    description="회사 관리 API - MongoDB와 FastAPI를 사용한 회사 데이터 관리",
    version="1.0.0"
)

# CORS설정 (React의 localhost:3000 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 기존 토큰 관련 코드
class TokenRequest(BaseModel):
    username: str
    password: str

@app.post("/token")
def get_token(req: TokenRequest):
    KEYCLOAK_URL = "http://keycloak:8080/realms/master/protocol/openid-connect/token"
    CLIENT_ID = "my-app"
    # adminクライアントがconfidentialの場合のみclient_secretをセット
    CLIENT_SECRET = "adminpassword" 

    data = {
        "grant_type": "password",
        "client_id": CLIENT_ID,
        # "client_secret": CLIENT_SECRET,  # 必要に応じてコメントイン
        "username": req.username,
        "password": req.password,
    }
    try:
        resp = requests.post(KEYCLOAK_URL, data=data)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        # 失敗時にrespが存在すればその内容を返す
        resp_text = ""
        if 'resp' in locals() and hasattr(resp, "text"):
            resp_text = resp.text
        return {
            "error": str(e),
            "details": resp_text
        }

# 회사 관련 API 엔드포인트

@app.post("/companies", response_model=List[CompanyResponse])
async def add_companies(company_request: CompanyRequest):
    """
    회사 추가 API
    - api.json의 addCompanies 오퍼레이션과 동일한 구조
    - 여러 회사를 한 번에 추가 가능
    """
    try:
        results = await company_service.create_multiple_companies(
            company_request.companyInputs
        )
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"회사 추가 중 오류가 발생했습니다: {str(e)}"
        )

@app.post("/companies/single", response_model=CompanyResponse)
async def add_single_company(company_input: CompanyInput):
    """
    단일 회사 추가 API
    """
    try:
        result = await company_service.create_company(company_input)
        if result.status == "error":
            raise HTTPException(status_code=400, detail=result.message)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"회사 추가 중 오류가 발생했습니다: {str(e)}"
        )

@app.get("/companies")
async def get_companies():
    """
    모든 회사 조회 API
    """
    try:
        companies = await company_service.get_all_companies()
        return {"companies": companies}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"회사 조회 중 오류가 발생했습니다: {str(e)}"
        )

@app.get("/companies/{code}")
async def get_company_by_code(code: str):
    """
    회사 코드로 특정 회사 조회 API
    """
    try:
        company = await company_service.get_company_by_code(code)
        if not company:
            raise HTTPException(
                status_code=404,
                detail=f"회사 코드 '{code}'를 찾을 수 없습니다."
            )
        return company
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"회사 조회 중 오류가 발생했습니다: {str(e)}"
        )

@app.put("/companies/{code}", response_model=CompanyResponse)
async def update_company(code: str, company_input: CompanyInput):
    """
    회사 정보 업데이트 API
    """
    try:
        update_data = company_input.dict(exclude_unset=True)
        result = await company_service.update_company(code, update_data)
        if result.status == "error":
            if "찾을 수 없습니다" in result.message:
                raise HTTPException(status_code=404, detail=result.message)
            else:
                raise HTTPException(status_code=400, detail=result.message)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"회사 업데이트 중 오류가 발생했습니다: {str(e)}"
        )

@app.delete("/companies/{code}", response_model=CompanyResponse)
async def delete_company(code: str):
    """
    회사 삭제 API
    """
    try:
        result = await company_service.delete_company(code)
        if result.status == "error":
            if "찾을 수 없습니다" in result.message:
                raise HTTPException(status_code=404, detail=result.message)
            else:
                raise HTTPException(status_code=400, detail=result.message)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"회사 삭제 중 오류가 발생했습니다: {str(e)}"
        )

@app.get("/")
async def root():
    """
    API 루트 엔드포인트
    """
    return {
        "message": "Company Management API",
        "version": "1.0.0",
        "endpoints": {
            "companies": "/companies",
            "single_company": "/companies/single",
            "get_company": "/companies/{code}",
            "update_company": "/companies/{code}",
            "delete_company": "/companies/{code}",
            "docs": "/docs"
        }
    }

