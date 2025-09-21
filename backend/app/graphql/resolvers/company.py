from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from passlib.hash import bcrypt
from beanie import PydanticObjectId
from pydantic import ValidationError
from pymongo.errors import DuplicateKeyError

from app.models.company_document import Company as CompanyDoc
from app.schemas.company import (
    CompanyCreate as CompanyCreateSchema,
    Location as LocationSchema,
)
from app.graphql.types.company import Company as GQLCompany, CompanyCreateInput, Location


def _to_gql_company(doc: CompanyDoc) -> GQLCompany:
    return GQLCompany(
        id=str(doc.id),
        companyName=doc.companyName,
        companyNameKana=doc.companyNameKana,
        companyCode=doc.companyCode,
        contactName=doc.contactName,
        contactNameKana=doc.contactNameKana,
        phoneNumber=doc.phoneNumber,
        postalCode=doc.postalCode,
        location=Location(**doc.location.model_dump()),
        months=doc.months,
        ownerLoginEmail=doc.ownerLoginEmail,
        appIntegrationEnabled=doc.appIntegrationEnabled,
        safetyConfirmationEnabled=doc.safetyConfirmationEnabled,
        occupationalDoctorIntegrationEnabled=doc.occupationalDoctorIntegrationEnabled,
        employeeChatEnabled=doc.employeeChatEnabled,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


async def list_companies(limit: int = 20, offset: int = 0, search: Optional[str] = None) -> List[GQLCompany]:
    query = {}
    if search:
        # naive contains filter on name/code/email
        query = {
            "$or": [
                {"companyName": {"$regex": search, "$options": "i"}},
                {"companyCode": {"$regex": search, "$options": "i"}},
            ]
        }
    docs = await CompanyDoc.find(query).skip(offset).limit(limit).to_list()
    return [_to_gql_company(d) for d in docs]


async def get_company(company_id: str) -> Optional[GQLCompany]:
    try:
        doc = await CompanyDoc.get(PydanticObjectId(company_id))
    except Exception:
        doc = None
    return _to_gql_company(doc) if doc else None


async def create_company(input: CompanyCreateInput) -> GQLCompany:
    # Validate input using Pydantic schema to align with REST rules
    try:
        _ = CompanyCreateSchema(
            companyName=input.companyName,
            companyNameKana=input.companyNameKana,
            companyCode=input.companyCode,
            contactName=input.contactName,
            contactNameKana=input.contactNameKana,
            phoneNumber=input.phoneNumber,
            postalCode=input.postalCode,
            location=LocationSchema(
                prefecture=input.location.prefecture,
                city=input.location.city,
                streetAddress=input.location.streetAddress,
                addressLine=input.location.addressLine,
            ),
            months=input.months,
            ownerLoginEmail=input.ownerLoginEmail,
            ownerLoginPassword=input.ownerLoginPassword,
            appIntegrationEnabled=input.appIntegrationEnabled,
            safetyConfirmationEnabled=input.safetyConfirmationEnabled,
            occupationalDoctorIntegrationEnabled=input.occupationalDoctorIntegrationEnabled,
            employeeChatEnabled=input.employeeChatEnabled,
        )
    except ValidationError as e:
        # Surface a concise, user-friendly message to GraphQL clients
        errs = "; ".join(
            [
                f"{'.'.join([str(p) for p in err.get('loc', [])])}: {err.get('msg', 'invalid')}"
                for err in e.errors()
            ]
        )
        raise ValueError(errs) from e

    # uniqueness checks (use count to avoid parsing old docs missing fields)
    if await CompanyDoc.find({"companyCode": input.companyCode}).count() > 0:
        raise ValueError("Company code already exists")

    # hashed = bcrypt.hash(input.ownerLoginPassword)
    doc = CompanyDoc(
        companyName=input.companyName,
        companyNameKana=input.companyNameKana,
        companyCode=input.companyCode,
        contactName=input.contactName,
        contactNameKana=input.contactNameKana,
        phoneNumber=input.phoneNumber,
        postalCode=input.postalCode,
        location={
            "prefecture": input.location.prefecture,
            "city": input.location.city,
            "streetAddress": input.location.streetAddress,
            "addressLine": input.location.addressLine,
        },
        months=input.months,
        ownerLoginEmail=input.ownerLoginEmail,
        ownerLoginPassword=input.ownerLoginPassword,
        appIntegrationEnabled=input.appIntegrationEnabled,
        safetyConfirmationEnabled=input.safetyConfirmationEnabled,
        occupationalDoctorIntegrationEnabled=input.occupationalDoctorIntegrationEnabled,
        employeeChatEnabled=input.employeeChatEnabled,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    try:
        await doc.insert()
    except DuplicateKeyError as e:
        # In case of race conditions, map DB unique violations to a friendly message
        raise ValueError("Company code already exists") from e
    return _to_gql_company(doc)
