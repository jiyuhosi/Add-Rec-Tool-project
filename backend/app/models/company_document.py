from datetime import datetime
from typing import Optional

from beanie import Document
from pydantic import BaseModel, Field, EmailStr
from pymongo import IndexModel


class LocationModel(BaseModel):
    prefecture: str = Field(..., description="都道府県")
    city: str = Field(..., description="市区町村")
    streetAddress: str = Field(..., description="番地")
    addressLine: Optional[str] = Field(None, description="建物部屋番号")


class Company(Document):
    # Core info
    companyName: str = Field(..., description="企業名")
    companyNameKana: str = Field(..., description="企業名（カナ）")
    companyCode: str = Field(..., description="企業コード")

    # Contact
    contactName: str = Field(..., description="担当者名")
    contactNameKana: str = Field(..., description="担当者名（カナ）")
    phoneNumber: Optional[str] = Field(None, description="電話番号")
    ownerLoginEmail: EmailStr = Field(..., description="ログインID")
    ownerLoginPassword: str = Field(..., description="ハッシュ済みパスワード")

    # Address
    postalCode: str = Field(..., description="郵便番号")
    location: LocationModel = Field(..., description="住所情報")

    # Settings
    months: str = Field(..., description="年度設定 (例: 02-03)")
    appIntegrationEnabled: bool = Field(..., description="アプリ連携")
    safetyConfirmationEnabled: bool = Field(..., description="安否確認")
    occupationalDoctorIntegrationEnabled: bool = Field(..., description="産業医連携")
    employeeChatEnabled: bool = Field(..., description="従業員とのチャット")

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "companies"
        indexes = [
            IndexModel([("companyCode", 1)], name="idx_company_code", unique=True),
        ]
