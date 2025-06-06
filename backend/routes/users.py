from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select, update
from sqlalchemy.engine import Result
from models import users
from schemas import UserCreate, UserOut, UserUpdate
from auth import create_access_token, create_refresh_token, verify_password, hash_password, get_current_user, oauth2_scheme, SECRET_KEY, ALGORITHM, JWTError, jwt
from datetime import datetime, timezone
from typing import List
from db import database

router = APIRouter()


@router.post("/register", response_model=UserOut)
async def register(user: UserCreate):
    # Check if username exists
    query = select(users).where(users.c.username == user.username)
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
    user_query = select(users).where(users.c.username == user.username)
    created_user = await database.fetch_one(user_query)

    return UserOut(**created_user)




# Login route
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    query = select(users).where(users.c.username == form_data.username.strip())
    user = await database.fetch_one(query)
    print(f"Received login for: {form_data.username}")

    if not user or not verify_password(form_data.password, user["password"]):
        print("User not found.")
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = create_access_token(data={"sub": user["username"],  "role": user["role"]})
    refresh_token = create_refresh_token({"sub": user["username"]})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}




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
async def update_user_role(
    username: str,
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    # Check if user exists
    query = select(users).where(users.c.username == username)
    existing_user = await database.fetch_one(query)

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update user
    stmt = (
        update(users)
        .where(users.c.username == username)
        .values(
            role=update_data.role,
            update_time=datetime.now(timezone.utc)
        )
    )
    await database.execute(stmt)

    updated_user = {**existing_user._mapping, "role": update_data.role}
    return UserOut(**updated_user)







@router.get("/users", response_model=List[UserOut])
async def list_users(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    query = select(users)
    user_rows = await database.fetch_all(query)

    user_list = [
        UserOut(**{key: value for key, value in row._mapping.items() if key != "password"})
        for row in user_rows
    ]
    return user_list