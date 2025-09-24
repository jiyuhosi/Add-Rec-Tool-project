import strawberry
from typing import Optional, List
from strawberry.types import Info
from fastapi import Request
from app.graphql.types.company import Company as GQLCompany, CompanyCreateInput
from app.graphql.resolvers.company import list_companies, get_company, create_company


async def get_user_from_context(info: Info):
    request: Request = info.context["request"]
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = auth_header.replace("Bearer ", "")
    from app.services.keycloak_service import keycloak_service
    return await keycloak_service.verify_token(token)


@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "world"

    @strawberry.field
    async def companies(
        self,
        info: Info,
        limit: int = 20,
        offset: int = 0,
        search: Optional[str] = None
    ) -> List[GQLCompany]:
        await get_user_from_context(info)
        return await list_companies(limit=limit, offset=offset, search=search)

    @strawberry.field
    async def company(self, info: Info, id: str) -> Optional[GQLCompany]:
        await get_user_from_context(info)
        return await get_company(id)


@strawberry.type
class Mutation:
    @strawberry.mutation
    def ping(self) -> str:
        return "pong"

    @strawberry.mutation
    async def createCompany(self, info: Info, input: CompanyCreateInput) -> GQLCompany:
        await get_user_from_context(info)
        return await create_company(input)


schema = strawberry.Schema(query=Query, mutation=Mutation)
