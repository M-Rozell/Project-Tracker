from sqlalchemy import Table, Column, Integer, String, Text, Date, DateTime, Float
from sqlalchemy.sql import func
from db import metadata

projects = Table(
    "projects",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("work_order", String(50), nullable=False),
    Column("project_name", String(100), nullable=False),
    Column("completion", Float, default=0.0),
    Column("owner", String(100), nullable=False),
    Column("customer", String(100), nullable=False),
    Column("description", Text),
    Column("location", String(255)),
    Column("total_estimate", Float),
    Column("status", String(50), nullable=False),
    Column("start_date", Date),
    Column("end_date", Date),
    Column("updated_by", String(50)),
    Column("update_time", DateTime, server_default=func.now(), onupdate=func.now()),
    Column("notes", Text),
    Column("create_time", DateTime, server_default=func.now()),
    Column("created_by", String(50)),    
)

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("username", String(50), unique=True, nullable=False),
    Column("password", String(255), nullable=False),
    Column("email", String(100), unique=True, nullable=False),
    Column("role", String(20), nullable=False, default="user"),
    Column("create_time", DateTime, server_default=func.now()),
    Column("update_time", DateTime, server_default=func.now(), onupdate=func.now()),
)

role = Column(String, default="user")  # e.g. "admin", "manager", "user"



