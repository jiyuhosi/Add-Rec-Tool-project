from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from passlib.hash import bcrypt
from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from app.schemas.company import CompanyCreate, CompanyResponse
from app.models.company_document import Company as CompanyDoc

router = APIRouter()


def _to_response_model(doc: CompanyDoc) -> CompanyResponse:
    return CompanyResponse(
        id=str(doc.id),
        companyName=doc.companyName,
        companyNameKana=doc.companyNameKana,
        companyCode=doc.companyCode,
        contactName=doc.contactName,
        contactNameKana=doc.contactNameKana,
        phoneNumber=doc.phoneNumber,
        postalCode=doc.postalCode,
        location=doc.location.model_dump(),
        months=doc.months,
        ownerLoginEmail=doc.ownerLoginEmail,
        appIntegrationEnabled=doc.appIntegrationEnabled,
        safetyConfirmationEnabled=doc.safetyConfirmationEnabled,
        occupationalDoctorIntegrationEnabled=doc.occupationalDoctorIntegrationEnabled,
        employeeChatEnabled=doc.employeeChatEnabled,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


@router.get("/", response_model=List[CompanyResponse])
async def get_companies():
    """すべての企業を取得します。"""
    docs = await CompanyDoc.find_all().to_list()
    return [_to_response_model(d) for d in docs]


@router.post("/", response_model=CompanyResponse)
async def create_company(company: CompanyCreate):
    """新しい企業を作成します。"""
    # 重複確認 (既存ドキュメントの不完全なスキーマによる検証エラーを避けるためcountで確認)
    if await CompanyDoc.find({"companyCode": company.companyCode}).count() > 0:
        raise HTTPException(status_code=400, detail="Company code already exists")

    # パスワードハッシュ
    # hashed = bcrypt.hash(company.ownerLoginPassword)

    doc = CompanyDoc(
        companyName=company.companyName,
        companyNameKana=company.companyNameKana,
        companyCode=company.companyCode,
        contactName=company.contactName,
        contactNameKana=company.contactNameKana,
        phoneNumber=company.phoneNumber,
        postalCode=company.postalCode,
        location=company.location.model_dump(),
        months=company.months,
        ownerLoginEmail=company.ownerLoginEmail,
        ownerLoginPassword=company.ownerLoginPassword,
        appIntegrationEnabled=company.appIntegrationEnabled,
        safetyConfirmationEnabled=company.safetyConfirmationEnabled,
        occupationalDoctorIntegrationEnabled=company.occupationalDoctorIntegrationEnabled,
        employeeChatEnabled=company.employeeChatEnabled,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    try:
        await doc.insert()
    except DuplicateKeyError as e:
        # Map DB unique index violations to 400 without pre-checks
        # Currently the only unique field is companyCode
        raise HTTPException(status_code=400, detail="Company code already exists") from e
    return _to_response_model(doc)


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(company_id: str):
    """特定の企業を取得します。"""
    try:
        doc = await CompanyDoc.get(PydanticObjectId(company_id))
    except Exception:
        doc = None
    if not doc:
        raise HTTPException(status_code=404, detail="Company not found")
    return _to_response_model(doc)