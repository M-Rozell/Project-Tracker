import os
import sqlalchemy
from databases import Database
from dotenv import load_dotenv
from urllib.parse import quote_plus
from contextlib import asynccontextmanager

# Load environment variables from .env file
load_dotenv()

# Build the async DATABASE URL for use with `databases` and `aiomysql`
DB_USER = quote_plus(os.getenv("DB_USER", ""))
DB_PASSWORD = quote_plus(os.getenv("DB_PASSWORD", ""))
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "")

DATABASE_URL = f"mysql+aiomysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Async connection for use in routes and services
database = Database(DATABASE_URL)

# SQLAlchemy metadata used for model/table declarations
metadata = sqlalchemy.MetaData()

# Create synchronous SQLAlchemy engine (used for migrations and table creation)
try:
    engine = sqlalchemy.create_engine(
        DATABASE_URL.replace("aiomysql", "pymysql")
    )
except Exception as e:
    print("Failed to create SQLAlchemy engine:", e)
    engine = None

# Async context manager for DB session use
@asynccontextmanager
async def get_db():
    try:
        await database.connect()
        yield database
    finally:
        await database.disconnect()
