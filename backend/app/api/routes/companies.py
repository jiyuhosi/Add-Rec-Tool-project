from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.company import CompanyCreate, CompanyResponse

router = APIRouter()

# メモリに保存する一時的な企業データ
fake_companies_db = []


@router.get("/", response_model=List[CompanyResponse])
async def get_companies():
    """すべての企業を取得します。"""
    return fake_companies_db


@router.post("/", response_model=CompanyResponse)
async def create_company(company: CompanyCreate):
    """新しい企業を作成します。"""
    from datetime import datetime
    
    # 企業コード重複確認
    for existing_company in fake_companies_db:
        if existing_company["companyCode"] == company.companyCode:
            raise HTTPException(status_code=400, detail="Company code already exists")
    
    # メール重複確認
    for existing_company in fake_companies_db:
        if existing_company["ownerLoginEmail"] == company.ownerLoginEmail:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # 新しい企業作成
    new_company = {
        "id": str(len(fake_companies_db) + 1),
        "companyName": company.companyName,
        "companyNameKana": company.companyNameKana,
        "companyCode": company.companyCode,
        "contactName": company.contactName,
        "contactNameKana": company.contactNameKana,
        "phoneNumber": company.phoneNumber,
        "postalCode": company.postalCode,
        "location": {
            "prefecture": company.location.prefecture,
            "city": company.location.city,
            "streetAddress": company.location.streetAddress,
            "addressLine": company.location.addressLine
        },
        "fiscalYearEndMonth": company.fiscalYearEndMonth,
        "ownerLoginEmail": company.ownerLoginEmail,
        "ownerLoginPassword": company.ownerLoginPassword,  # 実際にはハッシュ化が必要
        "appIntegrationEnabled": company.appIntegrationEnabled,
        "safetyConfirmationEnabled": company.safetyConfirmationEnabled,
        "occupationalDoctorIntegrationEnabled": company.occupationalDoctorIntegrationEnabled,
        "employeeChatEnabled": company.employeeChatEnabled,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    fake_companies_db.append(new_company)
    return new_company


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(company_id: str):
    """特定の企業を取得します。"""
    for company in fake_companies_db:
        if company["id"] == company_id:
            return company
    
    raise HTTPException(status_code=404, detail="Company not found")