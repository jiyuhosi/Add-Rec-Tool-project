from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from .config import MONGODB_URI, MONGODB_DB
from .models.company_document import Company

_client: Optional[AsyncIOMotorClient] = None


async def init_db() -> None:
    global _client
    if _client is not None:
        return
    # Debug: log DB target without leaking credentials
    try:
        from urllib.parse import urlparse

        parsed = urlparse(MONGODB_URI)
        safe_netloc = parsed.hostname or "localhost"
        safe_uri = f"{parsed.scheme}://{safe_netloc}:{parsed.port or 27017}"
        print(f"[DB] Connecting to {safe_uri}, DB={MONGODB_DB}")
    except Exception:
        pass

    _client = AsyncIOMotorClient(MONGODB_URI)
    db = _client[MONGODB_DB]
    await init_beanie(database=db, document_models=[Company])


async def close_db() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
