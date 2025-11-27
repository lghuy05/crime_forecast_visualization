from typing import Union
from fastapi import FastAPI, Depends, HTTPException, status
from database.database import supabase_cli
from schemas.model import Task
from schemas.schemas import Login

app = FastAPI()


# @app.get("/task/")
# async def get_tasks(user: Depends(get_current_user)):
#     data = supabase_cli.table("tasks").select("*").eq("user_id", user.user.id).execute()
#     return data.data
@app.get("/")
async def root():
    return {"success": "Welcome to CSAI Crime research"}


@app.post("/login")
async def login(credentials: Login):
    result = supabase_cli.auth.sign_in_with_password(
        {
            "email": credentials.email,
            "password": credentials.password,
        }
    )
    if result.user:
        return {"success": True, "user": result.user}
    else:
        return {"success": False, "error": "Invalid credentials"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
