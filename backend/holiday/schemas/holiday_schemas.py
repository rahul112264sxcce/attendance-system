from pydantic import BaseModel,field_validator
from utils.validators import validate_required_string
from datetime import date

class HolidaySchema(BaseModel):
    title: str
    holiday_date: date
    
    @field_validator("title")
    def validate_title(cls, value):
        return validate_required_string(value, "Title")

class HolidayResponse(BaseModel):
    id: int
    title: str
    holiday_date: date