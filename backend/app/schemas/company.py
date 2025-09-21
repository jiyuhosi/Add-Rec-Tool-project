from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional
from datetime import datetime
import regex as re


class Location(BaseModel):
    prefecture: str = Field(..., description="都道府県")
    city: str = Field(..., description="市区町村")
    streetAddress: str = Field(..., description="番地")
    addressLine: Optional[str] = Field(None, description="建物部屋番号")


class CompanyBase(BaseModel):
    companyName: str = Field(..., max_length=255, description="企業名")
    companyNameKana: str = Field(..., max_length=255, description="企業名（カナ）")
    companyCode: str = Field(..., max_length=255, description="企業コード")
    contactName: str = Field(..., max_length=255, description="担当者名")
    contactNameKana: str = Field(..., max_length=255, description="担当者名（カナ）")
    phoneNumber: Optional[str] = Field(None, max_length=255, description="電話番号")
    postalCode: str = Field(..., max_length=255, description="郵便番号")
    location: Location = Field(..., description="住所情報")
    months: str = Field(..., description="年度設定 (例: 02-03)")
    ownerLoginEmail: EmailStr = Field(..., description="ログインID")
    ownerLoginPassword: str = Field(..., min_length=6, max_length=12, description="パスワード")
    appIntegrationEnabled: bool = Field(..., description="アプリ連携")
    safetyConfirmationEnabled: bool = Field(..., description="安否確認")
    occupationalDoctorIntegrationEnabled: bool = Field(..., description="産業医連携")
    employeeChatEnabled: bool = Field(..., description="従業員とのチャット")

    @validator('companyName', 'companyNameKana')
    def validate_japanese_text(cls, v):
        if not re.match(r'^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]+$', v):
            raise ValueError('カタカナ・漢字・ひらがなのみ使用可能です')
        return v

    @validator('companyCode')
    def validate_company_code(cls, v):
        if not re.match(r'^[A-Z0-9-]+$', v):
            raise ValueError('半角英大文字・数字・ハイフンのみ使用可能です')
        return v

    @validator('contactNameKana')
    def validate_katakana(cls, v):
        if not re.match(r'^[\p{Script=Katakana}ー]+$', v):
            raise ValueError('カタカナのみ使用可能です')
        return v

    @validator('phoneNumber')
    def validate_phone_number(cls, v):
        if v and not re.match(r'^[0-9]+$', v):
            raise ValueError('数字のみ使用可能です')
        return v

    @validator('postalCode')
    def validate_postal_code(cls, v):
        if not re.match(r'^[0-9]+$', v):
            raise ValueError('数字のみ使用可能です')
        return v

    @validator('months')
    def validate_fiscal_year(cls, v):
        if not re.match(r'^[0-9]{2}-[0-9]{2}$', v):
            raise ValueError('MM-MM形式で入力してください (例: 02-03)')
        start_month, end_month = map(int, v.split('-'))
        if start_month >= end_month:
            raise ValueError('終了月は開始月より後である必要があります')
        return v

    @validator('ownerLoginPassword')
    def validate_password(cls, v):
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[!-~]{6,12}$'
        if not re.match(pattern, v):
            raise ValueError('6-12文字で英大小文字・数字を各1種以上含む必要があります')
        return v


class CompanyCreate(CompanyBase):
    pass


class CompanyResponse(CompanyBase):
    # 応答ではパスワードを返さない
    ownerLoginPassword: Optional[str] = Field(None, exclude=True)
    id: str
    created_at: datetime
    updated_at: datetime