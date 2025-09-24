from pydantic import BaseModel
from typing import Optional

class TokenRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int
    refresh_expires_in: int

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserInfo(BaseModel):
    sub: str
    username: str
    email: Optional[str] = None
    name: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None