from fastapi import HTTPException
from pydantic import BaseModel ,field_validator
from datetime import date

class WFHSchema(BaseModel):
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