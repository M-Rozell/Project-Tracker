from fastapi import FastAPI
from contextlib import asynccontextmanager
from db import database, metadata, engine
from routes.projects import router as projects_router
from routes.users import router as users_router
from fastapi.middleware.cors import CORSMiddleware

# Create tables
metadata.create_all(engine)

# Lifespan: connect/disconnect database
@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()

# Create app
app = FastAPI(lifespan=lifespan)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  #["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(projects_router)
app.include_router(users_router)











