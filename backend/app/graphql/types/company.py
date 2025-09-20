from __future__ import annotations

import strawberry
from datetime import datetime
from typing import Optional


@strawberry.type
class Location:
    prefecture: str
    city: str
    streetAddress: str
    addressLine: Optional[str] = None


@strawberry.type
class Company:
    id: str
    companyName: str
    companyNameKana: str
    companyCode: str
    contactName: str
    contactNameKana: str
    phoneNumber: Optional[str]
    postalCode: str
    location: Location
    fiscalYearEndMonth: str
    ownerLoginEmail: str
    appIntegrationEnabled: bool
    safetyConfirmationEnabled: bool
    occupationalDoctorIntegrationEnabled: bool
    employeeChatEnabled: bool
    created_at: datetime
    updated_at: datetime


@strawberry.input
class LocationInput:
    prefecture: str
    city: str
    streetAddress: str
    addressLine: Optional[str] = None


@strawberry.input
class CompanyCreateInput:
    companyName: str
    companyNameKana: str
    companyCode: str
    contactName: str
    contactNameKana: str
    phoneNumber: Optional[str] = None
    postalCode: str
    location: LocationInput
    fiscalYearEndMonth: str
    ownerLoginEmail: str
    ownerLoginPassword: str
    appIntegrationEnabled: bool
    safetyConfirmationEnabled: bool
    occupationalDoctorIntegrationEnabled: bool
    employeeChatEnabled: bool
