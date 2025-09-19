from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import api_router
from .database import init_db, close_db
from strawberry.fastapi import GraphQLRouter
from app.graphql.schema import schema

app = FastAPI(
    title="Add-Rec-Tool API",
    version="1.0.0",
    description="Add-Rec-Tool バックエンドAPI - 企業管理"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# APIルーター登録（企業のみ含む）
app.include_router(api_router, prefix="/api/v1")

# GraphQL Router
graphql_app = GraphQLRouter(schema, graphiql=True)
app.include_router(graphql_app, prefix="/graphql")


@app.on_event("startup")
async def on_startup():
    # Allow skipping DB init for local dev or CI when MongoDB isn't available
    skip_db = os.getenv("SKIP_DB_INIT", "false").lower() in {"1", "true", "yes"}
    if skip_db:
        print("[Startup] SKIP_DB_INIT is true -> skipping MongoDB initialization")
        return
    try:
        await init_db()
    except Exception as e:
        # Don't crash the whole app if DB is down in dev; GraphQL hello and non-DB routes can still work
        print(f"[Startup][DB] Initialization failed: {e}")
        # Re-raise in production-like environments if desired via STRICT_DB_INIT
        if os.getenv("STRICT_DB_INIT", "false").lower() in {"1", "true", "yes"}:
            raise


@app.on_event("shutdown")
async def on_shutdown():
    await close_db()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )