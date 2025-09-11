from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from models import CompanyInput, CompanyResponse
from database import get_database, COMPANIES_COLLECTION

class CompanyService:
    def __init__(self):
        self.db = None
    
    async def init_db(self):
        """데이터베이스 초기화"""
        if self.db is None:
            self.db = await get_database()
    
    async def create_company(self, company_input: CompanyInput) -> CompanyResponse:
        """회사 생성"""
        await self.init_db()
        
        # 회사 데이터 변환 및 추가 필드 설정
        company_data = company_input.dict()
        company_data["createdAt"] = datetime.utcnow()
        company_data["updatedAt"] = datetime.utcnow()
        
        # 회사 코드 중복 체크
        existing_company = await self.db[COMPANIES_COLLECTION].find_one(
            {"code": company_input.code}
        )
        
        if existing_company:
            return CompanyResponse(
                id="",
                code=company_input.code,
                status="error",
                message=f"회사 코드 '{company_input.code}'가 이미 존재합니다."
            )
        
        try:
            # MongoDB에 회사 데이터 삽입
            result = await self.db[COMPANIES_COLLECTION].insert_one(company_data)
            
            return CompanyResponse(
                id=str(result.inserted_id),
                code=company_input.code,
                status="success",
                message="회사가 성공적으로 생성되었습니다."
            )
        
        except Exception as e:
            return CompanyResponse(
                id="",
                code=company_input.code,
                status="error",
                message=f"회사 생성 중 오류가 발생했습니다: {str(e)}"
            )
    
    async def create_multiple_companies(self, company_inputs: List[CompanyInput]) -> List[CompanyResponse]:
        """여러 회사 일괄 생성"""
        results = []
        
        for company_input in company_inputs:
            result = await self.create_company(company_input)
            results.append(result)
        
        return results
    
    async def get_company_by_code(self, code: str) -> Optional[dict]:
        """회사 코드로 회사 조회"""
        await self.init_db()
        
        company = await self.db[COMPANIES_COLLECTION].find_one({"code": code})
        
        if company:
            # ObjectId를 문자열로 변환
            company["_id"] = str(company["_id"])
            return company
        
        return None
    
    async def get_all_companies(self) -> List[dict]:
        """모든 회사 조회"""
        await self.init_db()
        
        companies = []
        async for company in self.db[COMPANIES_COLLECTION].find():
            company["_id"] = str(company["_id"])
            companies.append(company)
        
        return companies
    
    async def update_company(self, code: str, update_data: dict) -> CompanyResponse:
        """회사 정보 업데이트"""
        await self.init_db()
        
        update_data["updatedAt"] = datetime.utcnow()
        
        try:
            result = await self.db[COMPANIES_COLLECTION].update_one(
                {"code": code},
                {"$set": update_data}
            )
            
            if result.matched_count == 0:
                return CompanyResponse(
                    id="",
                    code=code,
                    status="error",
                    message=f"회사 코드 '{code}'를 찾을 수 없습니다."
                )
            
            return CompanyResponse(
                id="",
                code=code,
                status="success",
                message="회사 정보가 성공적으로 업데이트되었습니다."
            )
        
        except Exception as e:
            return CompanyResponse(
                id="",
                code=code,
                status="error",
                message=f"회사 업데이트 중 오류가 발생했습니다: {str(e)}"
            )
    
    async def delete_company(self, code: str) -> CompanyResponse:
        """회사 삭제"""
        await self.init_db()
        
        try:
            result = await self.db[COMPANIES_COLLECTION].delete_one({"code": code})
            
            if result.deleted_count == 0:
                return CompanyResponse(
                    id="",
                    code=code,
                    status="error",
                    message=f"회사 코드 '{code}'를 찾을 수 없습니다."
                )
            
            return CompanyResponse(
                id="",
                code=code,
                status="success",
                message="회사가 성공적으로 삭제되었습니다."
            )
        
        except Exception as e:
            return CompanyResponse(
                id="",
                code=code,
                status="error",
                message=f"회사 삭제 중 오류가 발생했습니다: {str(e)}"
            )

# 전역 서비스 인스턴스
company_service = CompanyService()
