from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

# ----------------- Project Schema -----------------
class ProjectBase(BaseModel):
    work_order: str
    project_name: str
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

    class Config:
        from_attributes = True


# ----------------- User Schemas -----------------
class UserCreate(BaseModel):
    username: str
    password: str
    email: EmailStr
    role: str = "user"

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    role: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    create_time: datetime
    update_time: datetime

    class Config:
        from_attributes = True

