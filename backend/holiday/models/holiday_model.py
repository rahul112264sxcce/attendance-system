from pydantic import BaseModel
from datetime import date

class HolidayCreate(BaseModel):
    title: str
    holiday_date: date


class HolidayResponse(BaseModel):
    id: int
    title: str
    holiday_date: date