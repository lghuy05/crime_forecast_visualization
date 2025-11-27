from logging import raiseExceptions
from fastapi import HTTPException, status
# from database.database import supabase_cli
#
#
# async def get_current_user():
#     user = supabase_cli.auth.get_user()
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid authentication credentials",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     return user
