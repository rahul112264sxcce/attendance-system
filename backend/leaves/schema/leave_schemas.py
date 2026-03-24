from pydantic import BaseModel,Field,field_validator
from datetime import date

ALLOWED_LEAVE_TYPES = (
    "sick leave",
    "casual leave",
    "annual leave",
    "unpaid leave",
    "maternity leave",
    "paternity leave",
    "bereavement leave",
)
class LeaveRequest(BaseModel):
    leave_type:  str = Field(...)
    start_date: date
    end_date: date
    reason: str
    
    @field_validator("leave_type")
    @classmethod
    def validate_leave_type(cls, value: str):
        value = value.strip().lower()
        if value not in ALLOWED_LEAVE_TYPES:
            raise ValueError("Invalid leave type")
        return value