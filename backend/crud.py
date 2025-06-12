from models import users
from db import database  # your async Database instance
from schemas import UserCreate, UserUpdate

async def get_users():
    query = users.select()
    return await database.fetch_all(query)


async def create_user(user: UserCreate):
    query = users.insert().values(
        username=user.username,
        password=user.password,
        email=user.email,
        role=user.role
    )
    last_record_id = await database.execute(query)
    return last_record_id


async def update_user(user_id: int, updated_data: UserUpdate):
    # Build dict of fields to update, ignoring None values
    update_dict = {k: v for k, v in updated_data.model_dump().items() if v is not None}
    if update_dict:
        query = users.update().where(users.c.id == user_id).values(**update_dict)
        await database.execute(query)
        # Optionally, fetch updated user after update:
        query = users.select().where(users.c.id == user_id)
        return await database.fetch_one(query)
    return None


async def delete_user(user_id: int):
    query = users.delete().where(users.c.id == user_id)
    await database.execute(query)
    return {"deleted_user_id": user_id}

