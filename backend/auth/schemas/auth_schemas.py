from fastapi import HTTPException
from pydantic import BaseModel, field_validator
from utils.validators import validate_email, validate_password, validate_required_string
from typing import Optional

    
class UserQuery(BaseModel):
    user_id: int
    role: str
    
    @field_validator("role")
    def validate_role(cls, value):
        if value != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only admin can access"
            )
        return value
    
class signinSchema(BaseModel):
    email: str
    password: str
    @field_validator("email")
    def email_validation(cls, value):
        return validate_email(value)
    @field_validator("password")
    def password_validator(cls, value):
        return validate_password(value)
    
class userSchema(BaseModel):
    firstname: str
    lastname: str
    email: str
    password: str
    role: str = "employee"
    status: str = "active"

    @field_validator("firstname")
    def validate_firstname(cls, value):
        return validate_required_string(value, "First name")

    @field_validator("lastname")
    def validate_lastname(cls, value):
        return validate_required_string(value, "Last name")

    @field_validator("email")
    def email_validation(cls, value):
        return validate_email(value)

    @field_validator("password")
    def password_validator(cls, value):
        return validate_password(value)
    
# user get validation schema   
class userQuerySchema(BaseModel):
    page: int
    limit: int
    search: Optional[str] = None
    order: str = "asc"