from fastapi import APIRouter, HTTPException
from db import database
from models import projects
from schemas import Project
from sqlalchemy import select

router = APIRouter()


@router.get("/projects", response_model=list[Project])
async def get_projects():
    query = select(projects)
    return await database.fetch_all(query)




@router.post("/projects", response_model=Project)
async def create_project(project: Project):
    values = project.model_dump(exclude_unset=True)
    query = projects.insert().values(**values)
    project_id = await database.execute(query)
    return {**values, "id": project_id}




@router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: int, project: Project):
    # Check if project exists
    select_query = select(projects).where(projects.c.id == project_id)
    existing_project = await database.fetch_one(select_query)

    if not existing_project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Update the project data
    update_query = (
        projects.update()
        .where(projects.c.id == project_id)
        .values(**project.model_dump(exclude_unset=True))
    )
    await database.execute(update_query)

    return {**project.model_dump(exclude_unset=True), "id": project_id}




@router.delete("/projects/{project_id}", response_model=Project)
async def delete_project(project_id: int):
    # Check if the project exists
    select_query = select(projects).where(projects.c.id == project_id)
    existing_project = await database.fetch_one(select_query)

    if not existing_project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Delete the project
    delete_query = projects.delete().where(projects.c.id == project_id)
    await database.execute(delete_query)

    return existing_project

