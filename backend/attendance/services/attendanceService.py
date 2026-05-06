from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import date, datetime,timedelta
from utils.database import engine, Base, SessionLocal
from attendance.models.attendance_models import Attendance
from leaves.models.leaveReq_models import LeaveRequest
from holiday.models.holiday_models import Holidays
from attendance.models.attendance_models import AttendanceStatus

Base.metadata.create_all(bind=engine)

def add_attendance(current_user):
    db: Session = SessionLocal()
    
    try:
        user_id = current_user.id  
        today = date.today()
        
        holiday = db.query(Holidays).filter(
        Holidays.holiday_date == today
        ).first()

        if holiday:
            raise HTTPException(
                status_code=400,
                detail=f"Today is a holiday: {holiday.holiday_name}"
            )


        leave = db.query(LeaveRequest).filter(
            LeaveRequest.user_id == user_id,
            LeaveRequest.status == "approved",
            LeaveRequest.start_date <= today,
            LeaveRequest.end_date >= today
        ).first()

        if leave:
         raise HTTPException(400, "User is on approved leave")

        existing = db.query(Attendance).filter(
            Attendance.user_id == user_id,
            Attendance.attendance_date == today
        ).first()

        if existing:
            raise HTTPException(status_code=400, detail="User already checked in today")


        attendance = Attendance(
            user_id=user_id,
            attendance_date=today,
            in_time=datetime.now()
        )

        db.add(attendance)
        db.commit()
        db.refresh(attendance)

        return {
            "message": "Check-in successful",
            # "attendance_id": attendance.id
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close() 


def close_attendance(current_user):
    db: Session = SessionLocal()

    try:
        user_id = current_user.id

     
        attendance = db.query(Attendance).filter(
            Attendance.user_id == user_id,
            Attendance.attendance_date == date.today()
        ).first()

        if not attendance:
            raise HTTPException(
                status_code=404,
                detail="Check-in not found for today"
            )

     
        if attendance.out_time is not None:
            raise HTTPException(
                status_code=400,
                detail="User already checked out today"
            )

 
        current_time = datetime.now()

        if not attendance.in_time:
            raise HTTPException(
                status_code=400,
                detail="Invalid check-in time"
            )

        work_hours = (current_time - attendance.in_time).total_seconds() / 3600

        if work_hours >= 8:
          status = AttendanceStatus.PRESENT
        elif work_hours >= 4:
           status = AttendanceStatus.HALF_DAY
        else:
         status = AttendanceStatus.ABSENT

        
        attendance.out_time = current_time
        attendance.work_hours = round(work_hours, 2)
        attendance.status = status

        db.commit()
        db.refresh(attendance)

        return {
            "message": "Check-out successful",
            "work_hours": attendance.work_hours,
            "status": attendance.status,
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close() 
           
        
def get_today_attendance(current_user):
    db: Session = SessionLocal()

    try:
        user_id = current_user.id
        today = date.today()

        
        holiday = db.query(Holidays).filter(
            Holidays.holiday_date == today
        ).first()

        if holiday:
            return {
                "date": str(today),
                "message": holiday.holiday_name   
            }

       
        approved_leave = db.query(LeaveRequest).filter(
            LeaveRequest.user_id == user_id,
            LeaveRequest.status == "approved",
            LeaveRequest.start_date <= today,
            LeaveRequest.end_date >= today
        ).first()

        if approved_leave:
            return {
                "date": str(today),
                "message": approved_leave.leave_type
            }

       
        attendance = db.query(Attendance).filter(
            Attendance.user_id == user_id,
            Attendance.attendance_date == today
        ).first()

        
        if not attendance:
            return {
                "date": str(today),
                "message": "absent"
            }

        
        if attendance.in_time and not attendance.out_time:
            return {
                "date": str(attendance.attendance_date),
                "in_time": attendance.in_time,
                "out_time": None,
                "work_hours": None,
                "message": "Checked In"
            }

        
        return {
            "date": str(attendance.attendance_date),
            "in_time": attendance.in_time,
            "out_time": attendance.out_time,
            "work_hours": attendance.work_hours,
            "message": attendance.status
        }

    except HTTPException:
        raise 

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()
        
        
def get_all_attendance(current_user):

    db: Session = SessionLocal()

    try:
        user_id = current_user.id
        start_date = current_user.created_at.date() if hasattr(current_user.created_at, "date") else current_user.created_at
        end_date = date.today()

        records = db.query(Attendance).filter(
            Attendance.user_id == user_id,
            Attendance.attendance_date.between(start_date, end_date)
        ).all()

        holidays = db.query(Holidays).filter(
            Holidays.holiday_date.between(start_date, end_date)
        ).all()

        leaves = db.query(LeaveRequest).filter(
            LeaveRequest.user_id == user_id,
            LeaveRequest.status == "approved",
            LeaveRequest.start_date <= end_date,
            LeaveRequest.end_date >= start_date
        ).all()

        attendance_map = {}
        for a in records:
            att_date = a.attendance_date.date() if hasattr(a.attendance_date, "date") else a.attendance_date

            attendance_map[att_date] = {
                "date": str(att_date),
                "in_time": a.in_time,
                "out_time": a.out_time,
                "work_hours": a.work_hours,
                "status": a.status  
            }


        holiday_map = {}
        for h in holidays:
            holiday_map[h.holiday_date] = {
                "date": str(h.holiday_date),
                "in_time": None,
                "out_time": None,
                "work_hours": 0,
                "status": "holiday",
                "holiday_name": h.holiday_name
            }

      
        leave_map = {}

        for leave in leaves:
            current = leave.start_date.date() if hasattr(leave.start_date, "date") else leave.start_date
            end = leave.end_date.date() if hasattr(leave.end_date, "date") else leave.end_date

            while current <= end:
                leave_map[current] = {
                    "date": str(current),
                    "in_time": None,
                    "out_time": None,
                    "work_hours": 0,
                    "status": "leave", 
                    "leave_type": leave.leave_type
                }
                current += timedelta(days=1)

        result = []
        current = start_date
        while current <= end_date:
            if current in leave_map:
                result.append(leave_map[current])
            elif current in holiday_map:
                result.append(holiday_map[current])
            elif current in attendance_map:
                result.append(attendance_map[current])
            else:
                result.append({
                    "date": str(current),
                    "in_time": None,
                    "out_time": None,
                    "work_hours": 0,
                    "status": "absent",
                })
            current += timedelta(days=1)

        return result

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()        
        
        
        
        
        
