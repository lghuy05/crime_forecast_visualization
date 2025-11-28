from typing import Union
from fastapi import FastAPI, Depends, HTTPException, status, Request
from database.database import supabase_cli
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


# @app.get("/task/")
# async def get_tasks(user: Depends(get_current_user)):
#     data = supabase_cli.table("tasks").select("*").eq("user_id", user.user.id).execute()
#     return data.data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(">>>", request.method, request.url.path)
    try:
        response = await call_next(request)
        print("<<<", request.url.path)
        return response
    except Exception as e:
        print("!!!", request.url.path, str(e))
        raise


from routes.auth import router as auth_router

app.include_router(auth_router)


@app.get("/")
async def root():
    return {"success": "Welcome to CSAI Crime research"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
