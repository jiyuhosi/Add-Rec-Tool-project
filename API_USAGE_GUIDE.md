# 회사 관리 API 사용법

## 개요

이 API는 FastAPI와 MongoDB를 사용하여 회사 데이터를 관리하는 RESTful API입니다. `api.json`에 정의된 `addCompanies` 오퍼레이션을 기반으로 구현되었습니다.

## 시작하기

### 1. 환경 설정

```bash
# 프로젝트 디렉토리로 이동
cd /Users/kimri/project/real\ osaka/Add-Rec-Tool

# Docker Compose를 사용하여 서비스 시작
docker-compose up -d

# 또는 개발 모드로 시작 (로그 확인 가능)
docker-compose up
```

### 2. 서비스 확인

-   **FastAPI 서버**: http://localhost:8000
-   **API 문서**: http://localhost:8000/docs (Swagger UI)
-   **MongoDB**: localhost:27017
-   **Keycloak**: http://localhost:8083

## API 엔드포인트

### 1. 회사 추가

**`POST /companies`**

여러 회사를 한 번에 추가합니다. `api.json`의 `addCompanies` 오퍼레이션과 동일한 구조입니다.

```json
{
    "companyInputs": [
        {
            "code": "COMPANY_001",
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
                    "isPrimary": true
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
```

### 2. 단일 회사 추가

**`POST /companies/single`**

단일 회사를 추가합니다.

```json
{
  "code": "COMPANY_001",
  "location": [...],
  "telephoneNo": [...],
  // ... 기타 필드
}
```

### 3. 회사 목록 조회

**`GET /companies`**

모든 회사를 조회합니다.

### 4. 특정 회사 조회

**`GET /companies/{code}`**

회사 코드로 특정 회사를 조회합니다.

### 5. 회사 정보 업데이트

**`PUT /companies/{code}`**

특정 회사의 정보를 업데이트합니다.

### 6. 회사 삭제

**`DELETE /companies/{code}`**

특정 회사를 삭제합니다.

## 데이터 구조

### CompanyInput 모델

```typescript
interface CompanyInput {
    code: string; // 회사 코드 (필수)
    location: Location[]; // 회사 위치 (필수)
    telephoneNo: TelephoneNo[]; // 전화번호 목록 (필수)
    contactPersonFamilyName: string; // 담당자 성 (필수)
    contactPersonMail: string; // 담당자 이메일 (필수)
    mainHrAdmin: string; // 메인 HR 관리자 (필수)
    medicalCheckupStartDate: string; // 건강검진 시작일 (필수)
    medicalCheckupEndDate: string; // 건강검진 종료일 (필수)
    offices: string[]; // 사무소 목록 (선택, 기본값: [])
    departments: string[]; // 부서 목록 (선택, 기본값: [])
    displayNameMap: DisplayNameMap; // 회사명 다국어 (필수)
    designations: string[]; // 직책 목록 (선택, 기본값: [])
    status: 'ACTIVE' | 'INACTIVE'; // 상태 (선택, 기본값: "ACTIVE")
}
```

### Location 모델

```typescript
interface Location {
    postalCode: string; // 우편번호
    prefecture: string; // 도도부현
    address: string; // 주소
    roomLocation: RoomLocation; // 방 위치
}

interface RoomLocation {
    building: string; // 건물명
    roomNo: string; // 방 번호
}
```

### TelephoneNo 모델

```typescript
interface TelephoneNo {
    number: string; // 전화번호
    type: 'MOBILE' | 'HOME' | 'WORK'; // 전화 타입
    isPrimary: boolean; // 기본 전화번호 여부
}
```

## 테스트

### 1. Python 스크립트로 테스트

```bash
# Python 컨테이너 내에서 실행
docker-compose exec python python test_api.py
```

### 2. curl로 테스트

```bash
# 회사 추가
curl -X POST "http://localhost:8000/companies" \
  -H "Content-Type: application/json" \
  -d '{
    "companyInputs": [
      {
        "code": "TEST_001",
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
            "isPrimary": true
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
  }'

# 회사 목록 조회
curl -X GET "http://localhost:8000/companies"
```

### 3. Swagger UI로 테스트

브라우저에서 http://localhost:8000/docs 접속하여 대화형 API 문서를 통해 테스트할 수 있습니다.

## 프론트엔드 연동

### React/TypeScript 예제

```typescript
import { companyApiClient, CompanyInput } from './frontend-api-example';

// 회사 추가
const addCompany = async (companyData: CompanyInput) => {
    try {
        const result = await companyApiClient.addSingleCompany(companyData);
        console.log('회사 추가 성공:', result);
    } catch (error) {
        console.error('회사 추가 실패:', error);
    }
};

// 회사 목록 조회
const getCompanies = async () => {
    try {
        const companies = await companyApiClient.getCompanies();
        console.log('회사 목록:', companies);
    } catch (error) {
        console.error('회사 목록 조회 실패:', error);
    }
};
```

## 에러 처리

API는 적절한 HTTP 상태 코드와 에러 메시지를 반환합니다:

-   **200**: 성공
-   **400**: 잘못된 요청 (중복 회사 코드, 유효성 검사 실패 등)
-   **404**: 리소스를 찾을 수 없음
-   **500**: 서버 내부 오류

## 보안 고려사항

-   프로덕션 환경에서는 MongoDB 인증을 활성화하세요
-   API 키나 JWT 토큰을 사용한 인증을 구현하세요
-   CORS 설정을 프로덕션 환경에 맞게 조정하세요
-   입력 데이터 검증을 강화하세요

## 확장 가능성

이 구조는 다음과 같이 확장할 수 있습니다:

1. **Office, Department, Division API** 추가
2. **사용자 인증 및 권한 관리** 구현
3. **데이터 검증 로직** 강화
4. **로깅 및 모니터링** 추가
5. **캐싱 레이어** 구현
6. **백업 및 복구** 전략 수립
