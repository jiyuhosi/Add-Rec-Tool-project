from dotenv import load_dotenv
import os

# Ensure .env is loaded for local development
load_dotenv()

# MongoDB settings (used by Beanie/Motor)
# Prefer new env names and support legacy fallbacks
MONGODB_URI = (
	os.getenv("MONGODB_URI")
	or os.getenv("MONGODB_URL")
	or "mongodb://localhost:27017"
)
MONGODB_DB = (
	os.getenv("MONGODB_DB")
	or os.getenv("DATABASE_NAME")
	or "add_rec_tool"
)

# Keycloak settings
KEYCLOAK_URL = os.getenv("KEYCLOAK_URL", "http://localhost:8083")
KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM", "add-rec-tool")
KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "admin-cli")
KEYCLOAK_CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET", "")