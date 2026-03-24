from fastapi import APIRouter, Depends
from auth.schemas.auth_schemas import userSchema, signinSchema
from auth.services.auth_service import create_user, get_users, signin_user
from utils.token import get_current_user


# from database import get_db

router = APIRouter()



@router.post("/signin")
def Signin(data: signinSchema):
    return signin_user(data.email, data.password)


@router.post("/create-users")
def SignUp(data: userSchema):
    return create_user(data)


@router.get("/get-users")
def SignUpGet(current_user = Depends(get_current_user)):
    return get_users(current_user)



# @router.get("/test-db")
# def test_db():
#     conn = get_db_connection()
#     return {"message": "Database connected"}