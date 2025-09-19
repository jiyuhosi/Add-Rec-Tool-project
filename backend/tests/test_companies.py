from fastapi.testclient import TestClient
from app.main import app
from uuid import uuid4


def sample_payload(code: str | None = None, email: str | None = None):
    if code is None:
        code = f"OSK-TEST-{uuid4().hex[:8].upper()}"
    if email is None:
        email = f"owner_{uuid4().hex[:6]}@example.com"
    return {
        "companyName": "大阪商事",
        "companyNameKana": "オオサカショウジ",
        "companyCode": code,
        "contactName": "山田太郎",
        "contactNameKana": "ヤマダタロウ",
        "phoneNumber": "0612345678",
        "postalCode": "5300001",
        "location": {
            "prefecture": "大阪府",
            "city": "大阪市北区",
            "streetAddress": "梅田1-1-1",
            "addressLine": "XXビル 10F",
        },
        "fiscalYearEndMonth": "02-03",
        "ownerLoginEmail": email,
        "ownerLoginPassword": "Abc123!",
        "appIntegrationEnabled": True,
        "safetyConfirmationEnabled": True,
        "occupationalDoctorIntegrationEnabled": False,
        "employeeChatEnabled": True,
    }


def test_create_and_get_company():
    with TestClient(app) as client:
        # Create
        payload = sample_payload()
        res = client.post("/api/v1/companies/", json=payload)
        assert res.status_code in (200, 201), res.text
        data = res.json()
        assert data["companyCode"] == payload["companyCode"]
        assert "id" in data

        # List
        res_list = client.get("/api/v1/companies/")
        assert res_list.status_code == 200
        assert any(c["companyCode"] == payload["companyCode"] for c in res_list.json())

        # Duplicate code/email should fail
        res_dup = client.post("/api/v1/companies/", json=payload)
        assert res_dup.status_code == 400
