import strawberry
from typing import Optional, List
from app.graphql.types.company import Company as GQLCompany, CompanyCreateInput
from app.graphql.resolvers.company import list_companies, get_company, create_company


@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "world"

    @strawberry.field
    async def companies(self, limit: int = 20, offset: int = 0, search: Optional[str] = None) -> List[GQLCompany]:
        return await list_companies(limit=limit, offset=offset, search=search)

    @strawberry.field
    async def company(self, id: str) -> Optional[GQLCompany]:
        return await get_company(id)


@strawberry.type
class Mutation:
    @strawberry.mutation
    def ping(self) -> str:
        return "pong"

    @strawberry.mutation
    async def createCompany(self, input: CompanyCreateInput) -> GQLCompany:
        return await create_company(input)


schema = strawberry.Schema(query=Query, mutation=Mutation)
