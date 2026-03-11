from fastapi import APIRouter
from holiday.models.holiday_model import HolidayCreate
from holiday.services.holiday_service import (
    create_holiday,
    get_all_holidays,
    delete_holiday
)

router = APIRouter(prefix="/holidays", tags=["Company Holidays"])


@router.post("/")
def add_holiday(data: HolidayCreate):
    return create_holiday(data)


@router.get("/")
def list_holidays():
    return get_all_holidays()


@router.delete("/{holiday_id}")
def remove_holiday(holiday_id: int):
    return delete_holiday(holiday_id)