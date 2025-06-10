from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional
from enum import Enum

# ----------------- Project Schema -----------------
class ProjectBase(BaseModel):
    work_order: str
    project_name: str
    completion: Optional[float] = 0.0
    owner: str
    customer: str
    description: Optional[str] = None
    location: Optional[str] = None
    total_estimate: Optional[float] = None
    status: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    create_time: datetime
    update_time: datetime
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

    class Config:
        orm_mode = True


# ----------------- User Schemas -----------------

class UserRole(str, Enum):
    admin = "admin"
    manager = "manager"
    user = "user"


class UserCreate(BaseModel):
    username: str
    password: str
    email: EmailStr
    role: UserRole = UserRole.user

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: UserRole = UserRole.user
    create_time: datetime
    update_time: datetime

    class Config:
        orm_mode = True

