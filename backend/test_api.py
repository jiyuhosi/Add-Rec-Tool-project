#!/usr/bin/env python3
"""
会社 API テストスクリプト
"""
import requests
import json

# API ベース URL
BASE_URL = "http://localhost:8000"

# テストデータ
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
    """API テスト実行"""
    print("=== 회사 API 테스트 시작 ===")
    
    # 1. 会社追加テスト
    print("\n1. 会社追加テスト")
    response = requests.post(
        f"{BASE_URL}/companies",
        json=test_company_data,
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code == 200:
        print("✅ 会社追加成功")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    else:
        print("❌ 会社追加失敗")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return
    
    # 2. 会社一覧取得テスト
    print("\n2. 会社一覧取得テスト")
    response = requests.get(f"{BASE_URL}/companies")
    
    if response.status_code == 200:
        print("✅ 会社一覧取得成功")
        companies = response.json()
        print(f"총 {len(companies['companies'])}개의 회사")
    else:
        print("❌ 会社一覧取得失敗")
        print(f"Status Code: {response.status_code}")
    
    # 3. 特定会社取得テスト
    print("\n3. 特定会社取得テスト")
    company_code = "TEST_COMPANY_001"
    response = requests.get(f"{BASE_URL}/companies/{company_code}")
    
    if response.status_code == 200:
        print("✅ 特定会社取得成功")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    else:
        print("❌ 特定会社取得失敗")
        print(f"Status Code: {response.status_code}")
    
    # 4. 会社情報更新テスト
    print("\n4. 会社情報更新テスト")
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
        print("✅ 会社情報更新成功")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    else:
        print("❌ 会社情報更新失敗")
        print(f"Status Code: {response.status_code}")
    
    print("\n=== 테스트 완료 ===")

if __name__ == "__main__":
    test_api()
