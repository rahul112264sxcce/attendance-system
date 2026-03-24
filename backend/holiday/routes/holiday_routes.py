from fastapi import APIRouter, Depends
from utils.token import get_current_user
from holiday.schemas.holiday_schemas import HolidaySchema
from holiday.services.holiday_service import (
    create_holiday,
    get_all_holidays,
    delete_holiday
)

router = APIRouter(prefix="/holidays", tags=["Company Holidays"])


@router.post("/")
def add_holiday(data: HolidaySchema , current_user = Depends(get_current_user)):
    return create_holiday(data)


@router.get("/")
def list_holidays(current_user = Depends(get_current_user)):
    return get_all_holidays()


# @router.delete("/{holiday_id}")
# def remove_holiday(holiday_id: int):
#     return delete_holiday(holiday_id)