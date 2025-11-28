from fastapi import APIRouter, HTTPException, Header
from jwt.algorithms import Algorithm
from database.database import supabase_cli
from schemas.schemas import Login

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.get("/verify")
async def verify_token(authorization: str = Header(...)):
    # Handle token properly
    if authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    else:
        raise HTTPException(401, "Invalid token")

    # check for token
    try:
        user = supabase_cli.auth.get_user(token)
        if user:
            return user
        else:
            raise HTTPException(401, "Invalid token")

    except Exception as e:
        raise HTTPException(401, "Token verification failed")


@router.post("/login")
async def login(credentials: Login):
    result = supabase_cli.auth.sign_in_with_password(
        {
            "email": credentials.email,
            "password": credentials.password,
        }
    )
    if result.user:
        return {
            "success": True,
            "user": result.user,
            "token": result.session.access_token,
        }
    else:
        return {"success": False, "error": "Invalid credentials", "token": None}
