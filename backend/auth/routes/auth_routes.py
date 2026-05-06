from fastapi import APIRouter, Depends
from auth.schemas.auth_schemas import userSchema, signinSchema,userQuerySchema
from auth.services.auth_service import create_user, signin_user, get_users
from utils.token import get_current_user

router = APIRouter(tags=["Auth"])

@router.post("/login")
def Signin(data: signinSchema):
    return signin_user(data.email, data.password)

@router.post("/create-users")
def SignUp(data: userSchema):
    return create_user(data)

@router.get("/get-users")
def SignUpGet(
    query: userQuerySchema = Depends(),
    current_user=Depends(get_current_user)
    ):
    return get_users(query.page, query.limit, query.search, query.order, current_user)
