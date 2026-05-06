from fastapi import APIRouter, Depends
from attendance.services.attendanceService import add_attendance ,close_attendance,get_today_attendance,get_all_attendance
from utils.token import get_current_user


router = APIRouter(
    prefix="/attendance", tags=["Attendance"]
)

@router.post("/check-in")
def check_in(current_user= Depends(get_current_user)):
    return add_attendance(current_user)

@router.post("/check-out")
def employee_check_out(current_user = Depends(get_current_user)):
    return close_attendance(current_user)

@router.get("/today")
def today_attendance(current_user= Depends(get_current_user)):
     return get_today_attendance(current_user)

@router.get("/cumulative")
def everyday_attendance(current_user= Depends(get_current_user)):
     return get_all_attendance(current_user)


@router.post("/run-absent-job")
def run_absent_job(current_user=Depends(get_current_user)):
    role_value = current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role)
    if role_value != "admin":
        raise HTTPException(status_code=403, detail="Only admin can run absent job")

    return mark_absent_for_missed_checkins()
