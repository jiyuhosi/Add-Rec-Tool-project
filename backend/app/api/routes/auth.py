from fastapi import APIRouter, Depends
from app.schemas.auth import TokenRequest, TokenResponse, RefreshTokenRequest, UserInfo
from app.services.keycloak_service import keycloak_service
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.post("/token", response_model=TokenResponse)
async def login(request: TokenRequest):
    return await keycloak_service.get_token(
        username=request.username,
        password=request.password
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: RefreshTokenRequest):
    return await keycloak_service.refresh_token(request.refresh_token)

@router.get("/me", response_model=UserInfo)
async def get_me(current_user: UserInfo = Depends(get_current_user)):
    return current_user