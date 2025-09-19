#!/usr/bin/env python3
"""
회사 API 테스트 스크립트
"""
import requests
import json

# API 베이스 URL
BASE_URL = "http://localhost:8000"

# 테스트 데이터
test_company_data = {
    "companyInputs": [
        {
            "code": "TEST_COMPANY_001",
            "location": [
                {
                    "postalCode": "123-4567",
                    "prefecture": "東京都",
                    "address": "渋谷区渋谷1-1-1",
                    "roomLocation": {
                        "building": "テストビル",
                        "roomNo": "101"
                    }
                }
            ],
            "telephoneNo": [
                {
                    "number": "03-1234-5678",
                    "type": "WORK",
                    "isPrimary": True
                }
            ],
            "contactPersonFamilyName": "田中",
            "contactPersonMail": "tanaka@example.com",
            "mainHrAdmin": "佐藤",
            "medicalCheckupStartDate": "2024-04-01",
            "medicalCheckupEndDate": "2024-09-30",
            "offices": [],
            "departments": [],
            "displayNameMap": {
                "en": "Test Company Ltd.",
                "ja": "テスト会社株式会社"
            },
            "designations": [],
            "status": "ACTIVE"
        }
    ]
}

def test_api():
    """API 테스트 실행"""
    print("=== 회사 API 테스트 시작 ===")
    
    # 1. 회사 추가 테스트
    print("\n1. 회사 추가 테스트")
    response = requests.post(
        f"{BASE_URL}/companies",
        json=test_company_data,
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code == 200:
        print("✅ 회사 추가 성공")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    else:
        print("❌ 회사 추가 실패")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return
    
    # 2. 회사 목록 조회 테스트
    print("\n2. 회사 목록 조회 테스트")
    response = requests.get(f"{BASE_URL}/companies")
    
    if response.status_code == 200:
        print("✅ 회사 목록 조회 성공")
        companies = response.json()
        print(f"총 {len(companies['companies'])}개의 회사")
    else:
        print("❌ 회사 목록 조회 실패")
        print(f"Status Code: {response.status_code}")
    
    # 3. 특정 회사 조회 테스트
    print("\n3. 특정 회사 조회 테스트")
    company_code = "TEST_COMPANY_001"
    response = requests.get(f"{BASE_URL}/companies/{company_code}")
    
    if response.status_code == 200:
        print("✅ 특정 회사 조회 성공")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    else:
        print("❌ 특정 회사 조회 실패")
        print(f"Status Code: {response.status_code}")
    
    # 4. 회사 정보 업데이트 테스트
    print("\n4. 회사 정보 업데이트 테스트")
    update_data = {
        "contactPersonFamilyName": "鈴木",
        "contactPersonMail": "suzuki@example.com"
    }
    
    response = requests.put(
        f"{BASE_URL}/companies/{company_code}",
        json=update_data,
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code == 200:
        print("✅ 회사 정보 업데이트 성공")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    else:
        print("❌ 회사 정보 업데이트 실패")
        print(f"Status Code: {response.status_code}")
    
    print("\n=== 테스트 완료 ===")

if __name__ == "__main__":
    test_api()
