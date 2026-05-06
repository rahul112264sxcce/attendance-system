from fastapi import HTTPException
from pydantic import BaseModel,Field,field_validator
from datetime import date
from utils.validators import validate_required_string

ALLOWED_LEAVE_TYPES = (
    "sick",
    "casual",
    "annual",
    "unpaid",
    "maternity",
    "paternity",
    "bereavement",
)

class UpdateLeaveRequest(BaseModel):
    status: str

class LeaveRequestSchema(BaseModel):
    leave_type:  str = Field(...)
    start_date: date
    end_date: date
    reason: str
    
    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, end_date, info):
        start_date = info.data.get("start_date")
        if start_date and end_date < start_date:
            raise HTTPException(422, "End date cannot be before start date")
        return end_date
    
    @field_validator("leave_type")
    @classmethod
    def validate_leave_type(cls, value: str):
        value = value.strip().lower()
        if value not in ALLOWED_LEAVE_TYPES:
            raise ValueError("Invalid leave type")
        return value
    
    @field_validator("reason")
    def validate_lastname(cls, value):
        return validate_required_string(value, "reason")