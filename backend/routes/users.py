from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select, update, delete
from sqlalchemy.engine import Result
from models import users
from schemas import UserCreate, UserOut, UserUpdate, UserLogin
from auth import create_access_token, create_refresh_token, verify_password, hash_password, get_current_user, oauth2_scheme, SECRET_KEY, ALGORITHM, JWTError, jwt
from datetime import datetime, timezone
from typing import List
from db import database

router = APIRouter()


@router.post("/register", response_model=UserOut)
async def register(user: UserCreate):
    # Check if username exists
    query = select(users).where(users.c.username == user.username.strip())
    existing_user = await database.fetch_one(query)

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    # Hash password
    hashed_pw = hash_password(user.password)

    # Insert new user
    insert_stmt = users.insert().values(
        username=user.username,
        password=hashed_pw,
        email=user.email,
        role=user.role,
        create_time=datetime.now(timezone.utc),
        update_time=datetime.now(timezone.utc)
    )

    await database.execute(insert_stmt)

    # Optionally, fetch the newly created user to return with ID and timestamps
    user_query = select(users).where(users.c.username == user.username.strip())
    created_user = await database.fetch_one(user_query)

    return UserOut(**created_user)




# Login route
@router.post("/login")
async def login(login_data: UserLogin):
    query = select(users).where(users.c.username == login_data.username.strip())
    user = await database.fetch_one(query)
    

    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = create_access_token(data={"sub": user["username"], "role": user["role"]})
    refresh_token = create_refresh_token({"sub": user["username"]})

    # Log the access token for debugging (optional)
    

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
    



@router.post("/refresh")
async def refresh_token(refresh_token: str = Form(...)):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        # You could verify if the refresh token is in a whitelist (recommended)
        new_access_token = create_access_token({"sub": username})
        return {"access_token": new_access_token, "token_type": "bearer"}

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    



@router.get("/me", response_model=UserOut)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    query = users.select().where(users.c.username == username)
    user = await database.fetch_one(query)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user




@router.put("/users/{username}", response_model=UserOut)
async def update_user(
    username: str,
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    query = select(users).where(users.c.username == username)
    existing_user = await database.fetch_one(query)

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_values = {
        "update_time": datetime.now(timezone.utc)
    }

    if update_data.username:
        update_values["username"] = update_data.username
    if update_data.email:
        update_values["email"] = update_data.email
    if update_data.role:
        update_values["role"] = update_data.role
    if update_data.password:
        update_values["password"] = hash_password(update_data.password)

    stmt = update(users).where(users.c.username == username).values(**update_values)
    await database.execute(stmt)

    updated_username = update_data.username if update_data.username else username
    updated_query = select(users).where(users.c.username == updated_username)
    updated_user = await database.fetch_one(updated_query)

    return UserOut(**updated_user)








@router.get("/users", response_model=List[UserOut])
async def list_users(current_user: dict = Depends(get_current_user)):
    try:
        if current_user["role"] != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")

        query = select(users)
        user_rows = await database.fetch_all(query)

        user_list = [
            UserOut(**{k: v for k, v in dict(row).items() if k != "password"})
                for row in user_rows
        ]
        return user_list
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")



@router.get("/users/{username}", response_model=UserOut)
async def get_user(username: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    query = select(users).where(users.c.username == username)
    user_row = await database.fetch_one(query)

    if user_row is None:
        raise HTTPException(status_code=404, detail="User not found")

    return UserOut(**{key: value for key, value in user_row._mapping.items() if key != "password"})






@router.delete("/users/{username}")
async def delete_user(username: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    # Check if user exists
    query = select(users).where(users.c.username == username)
    existing_user = await database.fetch_one(query)

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent self-deletion
    if username == current_user["username"]:
        raise HTTPException(status_code=400, detail="You cannot delete yourself.")

    delete_stmt = users.delete().where(users.c.username == username)
    await database.execute(delete_stmt)

    return {"detail": f"User '{username}' deleted successfully"}

