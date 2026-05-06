from fastapi import HTTPException
from pydantic import BaseModel, field_validator
from datetime import date, datetime
from utils.validators import validate_required_string
from typing import List
from workfromhome.models.wft_models import WFHStatus

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

    @field_validator("reason")
    def validate_lastname(cls, value):
        return validate_required_string(value, "reason")

class WFHResponse(BaseModel):
    id: int
    start_date: date
    end_date: date
    reason: str | None
    status: str
    created_at: datetime
    employee_name: str | None
    employee_id: str | None
    class Config:
        from_attributes = True

class WFHListResponse(BaseModel):
    data: List[WFHResponse]

class UpdateWFHStatusSchema(BaseModel):
    status: WFHStatus