from fastapi import FastAPI, APIRouter, Depends
from attendance.services.attendanceService import (
    add_attendence,
    close_attendance,
    get_today_attendance,
    get_all_attendance
)
from utils.token import get_current_user
from attendance.schemas.attendanceSchemas import AttendanceSchema
from auth.schemas.authSchemas import userSchema
router = FastAPI()

router = APIRouter(
    prefix="/attendance", tags=["Attendance"]
)

@router.post("/check-in")
def check_in(current_user= Depends(get_current_user)):
    user_id = current_user["id"]
    return add_attendence(user_id)
   

@router.post("/check-out")
def employee_check_out(current_user = Depends(get_current_user)):
    user_id = current_user["id"]
    return close_attendance(user_id)


@router.get("/today")
def today_attendance(current_user= Depends(get_current_user)):
    user_id = current_user["id"]
    return get_today_attendance(user_id)

@router.get("/cumulative")
def everyday_attendance(current_user= Depends(get_current_user)):
    user_id = current_user["id"]
    print(user_id)
    return get_all_attendance(user_id)
