import httpx
from jose import jwt, JWTError
from fastapi import HTTPException
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from app.config import KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID
from app.schemas.auth import TokenResponse, UserInfo

class KeycloakService:
    def __init__(self):
        self.base_url = KEYCLOAK_URL
        self.realm = KEYCLOAK_REALM
        self.client_id = KEYCLOAK_CLIENT_ID
        self.token_url = f"{self.base_url}/realms/{self.realm}/protocol/openid-connect/token"
        self.certs_url = f"{self.base_url}/realms/{self.realm}/protocol/openid-connect/certs"
        self.public_key_cache: Optional[str] = None
        self.public_key_cache_time: Optional[datetime] = None

    async def get_token(self, username: str, password: str) -> TokenResponse:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.token_url,
                data={
                    "grant_type": "password",
                    "client_id": self.client_id,
                    "username": username,
                    "password": password,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid username or password"
                )
            
            data = response.json()
            return TokenResponse(**data)

    async def refresh_token(self, refresh_token: str) -> TokenResponse:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.token_url,
                data={
                    "grant_type": "refresh_token",
                    "client_id": self.client_id,
                    "refresh_token": refresh_token,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid refresh token"
                )
            
            data = response.json()
            return TokenResponse(**data)

    async def get_public_key(self) -> str:
        if self.public_key_cache and self.public_key_cache_time:
            if datetime.utcnow() - self.public_key_cache_time < timedelta(hours=1):
                return self.public_key_cache
        
        async with httpx.AsyncClient() as client:
            response = await client.get(self.certs_url)
            keys = response.json()["keys"]
            
            for key in keys:
                if key.get("alg") == "RS256":
                    from jose.backends import RSAKey
                    rsa_key = RSAKey(key, algorithm="RS256")
                    self.public_key_cache = rsa_key.to_pem().decode()
                    self.public_key_cache_time = datetime.utcnow()
                    return self.public_key_cache
        
        raise HTTPException(status_code=500, detail="Unable to get Keycloak public key")

    async def verify_token(self, token: str) -> UserInfo:
        try:
            public_key = await self.get_public_key()
            
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience=None,
                options={"verify_aud": False}
            )
            
            return UserInfo(
                sub=payload.get("sub", ""),
                username=payload.get("preferred_username", ""),
                email=payload.get("email"),
                name=payload.get("name"),
                given_name=payload.get("given_name"),
                family_name=payload.get("family_name")
            )
        except JWTError as e:
            raise HTTPException(
                status_code=401,
                detail=f"Invalid authentication token: {str(e)}"
            )

keycloak_service = KeycloakService()