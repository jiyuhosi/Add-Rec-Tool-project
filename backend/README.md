# Python 가상환경 설정 및 실행 가이드

## 1. 가상환경 생성

```bash
# Python 3.8 이상 필요
python -m venv venv

# 또는 conda 사용시
conda create -n add-rec-tool python=3.9
```

## 2. 가상환경 활성화

```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# conda 사용시
conda activate add-rec-tool
```

## 3. 의존성 설치

```bash
pip install -r requirements.txt
```

## 4. 환경변수 설정

`.env` 파일을 확인하고 필요에 따라 수정하세요.

## 5. MongoDB 실행

로컬 MongoDB가 실행되어 있는지 확인하세요.

```bash
# MongoDB 실행 (Docker 사용시)
docker run -d -p 27017:27017 --name mongodb mongo

# 또는 로컬 MongoDB 서비스 시작
brew services start mongodb/brew/mongodb-community  # macOS
sudo systemctl start mongod  # Linux
```

## 6. 서버 실행

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 7. API 문서 확인

-   Swagger UI: http://localhost:8000/docs
-   ReDoc: http://localhost:8000/redoc

## 트러블슈팅

### Swagger UI가 열리지 않는 경우

1. **서버 실행 상태 확인**

```bash
# 터미널에서 서버가 정상적으로 실행되었는지 확인
# 다음과 같은 메시지가 표시되어야 합니다:
# INFO:     Uvicorn running on http://127.0.0.1:8000
```

2. **포트 충돌 확인**

```bash
# 8000 포트를 사용하는 프로세스 확인
lsof -i :8000

# 다른 포트로 실행해보기
uvicorn app.main:app --reload --port 8001
```

3. **의존성 확인**

```bash
# 가상환경 활성화 확인
which python
# 결과: /Users/kimri/project/real osaka/real project/Add-Rec-Tool/backend/venv/bin/python

# 필수 패키지 설치 확인
pip list | grep fastapi
pip list | grep uvicorn
```

4. **단계별 디버깅**

```bash
# 1. 기본 파이썬 파일 실행 테스트
cd "/Users/kimri/project/real osaka/real project/Add-Rec-Tool/backend"
python -c "import fastapi; print('FastAPI 설치됨')"

# 2. 앱 모듈 import 테스트
python -c "from app.main import app; print('앱 로드 성공')"

# 3. 수동 서버 실행
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 자주 발생하는 오류

-   **ModuleNotFoundError**: 가상환경이 활성화되지 않았거나 의존성이 설치되지 않음
-   **Address already in use**: 8000 포트가 이미 사용 중
-   **ImportError**: 파일 경로나 모듈 구조 문제

## 개발 팁

-   가상환경이 활성화되어 있는지 확인: `which python`
-   설치된 패키지 확인: `pip list`
-   새로운 패키지 설치 후: `pip freeze > requirements.txt`
-   서버 로그 확인: 터미널에서 오류 메시지 자세히 읽기
