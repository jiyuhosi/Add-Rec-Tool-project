from pydantic import BaseModel, Field, EmailStr, validator, root_validator
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
    ownerLoginEmail: EmailStr = Field(..., max_length=255, description="ログインID")
    ownerLoginPassword: str = Field(..., min_length=6, max_length=12, description="パスワード")
    appIntegrationEnabled: bool = Field(..., description="アプリ連携")
    safetyConfirmationEnabled: bool = Field(..., description="安否確認")
    occupationalDoctorIntegrationEnabled: bool = Field(..., description="産業医連携")
    employeeChatEnabled: bool = Field(..., description="従業員とのチャット")

    @validator('companyName')
    def validate_company_name(cls, v: str):
        # 会社名: ひらがな・カタカナ・漢字のみ（スペースは不可）
        if not re.match(r'^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]+$', v):
            raise ValueError('企業名はカタカナ・漢字・ひらがなのみ使用可能です')
        return v

    @validator('companyNameKana')
    def validate_company_name_kana(cls, v: str):
        # 会社名（カナ）: 全角カタカナのみ
        if not re.match(r'^[\p{Script=Katakana}ー]+$', v):
            raise ValueError('企業名（カナ）はカタカナのみ使用可能です')
        return v

    @validator('companyCode')
    def validate_company_code(cls, v):
        if not re.match(r'^[A-Z0-9-]+$', v):
            raise ValueError('半角英大文字・数字・ハイフンのみ使用可能です')
        return v

    @validator('contactName')
    def validate_contact_name(cls, v: str):
        # 氏名: ひらがな・カタカナ・漢字・中黒・スペース(半角/全角)を許可
        if not re.match(r'^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー・ 　]+$', v):
            raise ValueError('担当者名はカタカナ・漢字・ひらがな・スペースのみ使用可能です')
        return v

    @validator('contactNameKana')
    def validate_katakana(cls, v):
        # セイ/メイ連結のためスペース(半角/全角)・中黒を許可
        if not re.match(r'^[\p{Script=Katakana}ー・ 　]+$', v):
            raise ValueError('担当者名（カナ）はカタカナのみ使用可能です')
        return v

    @validator('phoneNumber')
    def validate_phone_number(cls, v):
        if v is None:
            return v
        v = v.strip()
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
        # 月は 01-12 の範囲、かつ 終了月 > 開始月
        if not (1 <= start_month <= 12 and 1 <= end_month <= 12):
            raise ValueError('月は01-12の範囲で入力してください')
        if start_month >= end_month:
            raise ValueError('終了月は開始月より後である必要があります')
        return v

    @validator('ownerLoginPassword')
    def validate_password(cls, v):
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[!-~]{6,12}$'
        if not re.match(pattern, v):
            raise ValueError('6-12文字で英大小文字・数字を各1種以上含む必要があります')
        return v

    @validator('ownerLoginEmail')
    def validate_owner_login_email_length(cls, v: EmailStr):
        if len(str(v)) > 255:
            raise ValueError('メールアドレスは最大255文字までです')
        return v

    @validator('location')
    def validate_location(cls, v: 'Location'):
        # streetAddress は 現実的な住所表記を許容: 和文(かな/カナ/漢字)・数字・スペース・ハイフン（半角/全角）
        street = v.streetAddress
        if not re.match(r'^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}0-9\-ー―－ 　]+$', street):
            raise ValueError('番地は日本語・数字・ハイフン（半角/全角）・スペースのみ使用可能です')
        # addressLine は 任意: カタカナ・漢字・ひらがな・英大文字・数字・ハイフン（半角/全角）、スペースを許容（例: "XXビル 10F"）
        if v.addressLine is not None:
            if not re.match(r'^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}A-Z0-9\-ー―－ 　]+$', v.addressLine):
                raise ValueError('建物部屋番号はカタカナ・漢字・ひらがな・英大文字・数字・ハイフン（半角/全角）・スペースのみ使用可能です')
        return v

    @root_validator(skip_on_failure=True)
    def validate_feature_flags(cls, values):
        # appIntegrationEnabled が false の場合、従属フラグは false を強制
        app_enabled = values.get('appIntegrationEnabled')
        if app_enabled is False:
            values['safetyConfirmationEnabled'] = False
            values['employeeChatEnabled'] = False
        return values


class CompanyCreate(CompanyBase):
    pass


class CompanyResponse(CompanyBase):
    # 応答ではパスワードを返さない
    ownerLoginPassword: Optional[str] = Field(None, exclude=True)
    id: str
    created_at: datetime
    updated_at: datetime