from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class PhoneType(str, Enum):
    MOBILE = "MOBILE"
    HOME = "HOME"
    WORK = "WORK"

class Status(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"

class RoomLocation(BaseModel):
    building: str = Field(..., description="건물명")
    roomNo: str = Field(..., description="방 번호")

class Location(BaseModel):
    postalCode: str = Field(..., description="우편번호")
    prefecture: str = Field(..., description="도도부현")
    address: str = Field(..., description="주소")
    roomLocation: RoomLocation = Field(..., description="방 위치")

class TelephoneNo(BaseModel):
    number: str = Field(..., description="전화번호")
    type: PhoneType = Field(..., description="전화 타입")
    isPrimary: bool = Field(..., description="기본 전화번호 여부")

class DisplayNameMap(BaseModel):
    en: str = Field(..., description="영어명")
    ja: str = Field(..., description="일본어명")

class CompanyInput(BaseModel):
    code: str = Field(..., description="회사 코드")
    location: List[Location] = Field(..., description="회사 위치")
    telephoneNo: List[TelephoneNo] = Field(..., description="전화번호 목록")
    contactPersonFamilyName: str = Field(..., description="담당자 성")
    contactPersonMail: str = Field(..., description="담당자 이메일")
    mainHrAdmin: str = Field(..., description="메인 HR 관리자")
    medicalCheckupStartDate: str = Field(..., description="건강검진 시작일")
    medicalCheckupEndDate: str = Field(..., description="건강검진 종료일")
    offices: List[str] = Field(default=[], description="사무소 목록")
    departments: List[str] = Field(default=[], description="부서 목록")
    displayNameMap: DisplayNameMap = Field(..., description="회사명 다국어")
    designations: List[str] = Field(default=[], description="직책 목록")
    status: Status = Field(default=Status.ACTIVE, description="상태")

class CompanyRequest(BaseModel):
    companyInputs: List[CompanyInput] = Field(..., description="회사 입력 데이터 목록")

class CompanyResponse(BaseModel):
    id: str = Field(..., description="생성된 회사 ID")
    code: str = Field(..., description="회사 코드")
    status: str = Field(..., description="처리 상태")
    message: str = Field(..., description="처리 메시지")
