from fastapi import APIRouter, Depends
from auth.schemas.authSchemas import userSchema, signinSchema
from auth.services.authService import create_user, get_users, signin_user
from database import get_db_connection

# from database import get_db

router = APIRouter()


@router.get("/test-db")
def test_db():
    conn = get_db_connection()
    return {"message": "Database connected"}


@router.post("/signin")
def Signin(data: signinSchema):
    return signin_user(data.email, data.password)


@router.post("/create-users")
def SignUp(data: userSchema):
    return create_user(data)


@router.get("/get-users")
def SignUpGet(user_id: int, role: str):
    return get_users(user_id, role)


# @app.patch("/update-users/{user_id}")
# def SignUp():
#     return ""
