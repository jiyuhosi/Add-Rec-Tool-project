from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.keycloak_service import keycloak_service
from app.schemas.auth import UserInfo

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> UserInfo:
    token = credentials.credentials
    user = await keycloak_service.verify_token(token)
    return user