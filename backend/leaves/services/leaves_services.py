from datetime import date
from fastapi import HTTPException
from leaves.models.leaveReq_models import LeaveRequest ,LeaveStatus
from utils.database import engine, Base, SessionLocal
from auth.models.models import Users
from holiday.models.holiday_models import Holidays
from attendance.models.attendance_models import Attendance, AttendanceStatus
from workfromhome.models.wft_models import WFHRequest, WFHStatus
from datetime import timedelta

Base.metadata.create_all(bind=engine)


def create_leave_request(current_user, data):

    db = SessionLocal()

    try:
        user_id = current_user.id

        # ✅ Past date check
        if data.start_date < date.today():
            raise HTTPException(
                status_code=400,
                detail="Leave cannot be requested for past dates"
            )
            
        if data.start_date > data.end_date:
            raise HTTPException(
                status_code=400, detail="Start date cannot be after end date"
            )
        # ✅ Ove
        # lapping leave check
        existing_leave = (
            db.query(LeaveRequest)
            .filter(
                LeaveRequest.user_id == user_id,
                LeaveRequest.status != LeaveStatus.rejected,
                LeaveRequest.start_date <= data.end_date,
                LeaveRequest.end_date >= data.start_date,
            )
            .first()
        )

        if existing_leave:
            raise HTTPException(
                status_code=400,
                detail="You already have a leave request",
            )

        # ✅ Holiday check (NEW 🔥)
        current_date = data.start_date

        while current_date <= data.end_date:

            holiday = (
                db.query(Holidays)
                .filter(Holidays.holiday_date == current_date)
                .first()
            )

            if holiday:
                raise HTTPException(
                    status_code=400,
                    detail=f"{holiday.holiday_name} ({current_date})"
                )

            current_date += timedelta(days=1)

        # ✅ Create leave request
        new_leave = LeaveRequest(
            user_id=user_id,
            leave_type=data.leave_type,
            start_date=data.start_date,
            end_date=data.end_date,
            reason=data.reason,
            status=LeaveStatus.pending
        )

        db.add(new_leave)
        db.commit()
        db.refresh(new_leave)

        return {
            "message": "Leave request submitted",
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()

def get_leave_requests(current_user):
      
    db = SessionLocal()

    try:
        user_id = current_user.id
        role = current_user.role.value   

        if role == "admin":
            records = (
                db.query(
                    LeaveRequest.id,
                    Users.employee_id,
                    Users.first_name,
                    Users.last_name,
                    LeaveRequest.leave_type,
                    LeaveRequest.start_date,
                    LeaveRequest.end_date,
                    LeaveRequest.reason,
                    LeaveRequest.status,
                    LeaveRequest.created_at,
                )
                .join(Users, LeaveRequest.user_id == Users.id)
                .order_by(LeaveRequest.created_at.desc())
                .all()
            )

        else:
            records = (
                db.query(
                    LeaveRequest.id,
                    LeaveRequest.leave_type,
                    LeaveRequest.start_date,
                    LeaveRequest.end_date,
                    LeaveRequest.reason,
                    LeaveRequest.status,
                    LeaveRequest.created_at,
                )
                .filter(LeaveRequest.user_id == user_id)
                .order_by(LeaveRequest.created_at.desc())
                .all()
            )

        result = []

        for row in records:
            item = dict(row._mapping)

            if "leave_type" in item and item["leave_type"]:
                item["leave_type"] = item["leave_type"].value

            if "status" in item and item["status"]:
                item["status"] = item["status"].value

            result.append(item)

        return result

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()


def update_leave_status(leave_id: int, admin_id: int, status: str):
    db = SessionLocal()

    try:
        leave = (
            db.query(LeaveRequest)
            .filter(LeaveRequest.id == leave_id)
            .first()
        )

        if not leave:
            raise HTTPException(404, "Leave request not found")

        if leave.status != LeaveStatus.pending:
            raise HTTPException(400, "Leave request already processed")

        user_id = leave.user_id
        leave_type = leave.leave_type
        start_date = leave.start_date
        end_date = leave.end_date

        try:
            status_enum = LeaveStatus(status)
        except ValueError:
            raise HTTPException(400, "Invalid status")

        leave.status = status_enum
        leave.approved_by = admin_id

        # ✅ ONLY when leave is approved
        if status_enum == LeaveStatus.approved:

            current_date = start_date

            while current_date <= end_date:

                # 🔍 Skip holidays
                holiday = (
                    db.query(Holidays)
                    .filter(Holidays.holiday_date == current_date)
                    .first()
                )

                if not holiday:

                    # 🔍 Check if attendance already exists
                    existing_attendance = (
                        db.query(Attendance)
                        .filter(
                            Attendance.user_id == user_id,
                            Attendance.attendance_date == current_date,
                        )
                        .first()
                    )

                    # ✅ Create attendance only if not exists
                    if not existing_attendance:
                        attendance = Attendance(
                            user_id=user_id,
                            attendance_date=current_date,
                            status=AttendanceStatus.LEAVE   # ✅ FIXED
                        )
                        db.add(attendance)

                # ✅ VERY IMPORTANT (fix infinite loop)
                current_date += timedelta(days=1)

            # ✅ Auto-reject overlapping WFH requests
            overlapping_wfh = (
                db.query(WFHRequest)
                .filter(
                    WFHRequest.user_id == user_id,
                    WFHRequest.status != WFHStatus.rejected,
                    WFHRequest.start_date <= end_date,
                    WFHRequest.end_date >= start_date,
                )
                .all()
            )

            for wfh in overlapping_wfh:
                wfh.status = WFHStatus.rejected

        db.commit()

        return {"message": f"Leave {status} successfully"}

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()        
        
# def update_leave_status(leave_id: int, admin_id: int, status: str):
#     db = SessionLocal()

#     try:
#         leave = (
#             db.query(LeaveRequest)
#             .filter(LeaveRequest.id == leave_id)
#             .first()
#         )

#         if not leave:
#             raise HTTPException(404, "Leave request not found")

#         user_id = leave.user_id
#         leave_type = leave.leave_type
#         start_date = leave.start_date
#         end_date = leave.end_date

#         try:
#             status_enum = LeaveStatus(status)
#         except ValueError:
#             raise HTTPException(400, "Invalid status")

#         leave.status = status_enum
#         leave.approved_by = admin_id

#         # ✅ ONLY when leave is approved
#         if status_enum == LeaveStatus.approved:

#             current_date = start_date

#             while current_date <= end_date:

#                 # 🔍 Skip holidays
#                 holiday = (
#                     db.query(Holidays)
#                     .filter(Holidays.holiday_date == current_date)
#                     .first()
#                 )

#                 if not holiday:

#                     # 🔍 Check if attendance already exists
#                     existing_attendance = (
#                         db.query(Attendance)
#                         .filter(
#                             Attendance.user_id == user_id,
#                             Attendance.attendance_date == current_date,
#                         )
#                         .first()
#                     )

#                     # ✅ Create attendance only if not exists
#                     if not existing_attendance:
#                         attendance = Attendance(
#                             user_id=user_id,
#                             attendance_date=current_date,
#                             status=leave_type  # ⚠️ ensure this matches AttendanceStatus
#                         )
#                         db.add(attendance)

#                 # ✅ VERY IMPORTANT (fix infinite loop)
#                 current_date += timedelta(days=1)

#         db.commit()

#         return {"message": f"Leave {status} successfully"}

#     except HTTPException:
#         raise

#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=500, detail=str(e))

#     finally:
#         db.close() 
 
        
        
# def update_leave_status(leave_id: int, admin_id: int, status: str):
#     db = SessionLocal()

#     try:
        
#         leave = (
#             db.query(LeaveRequest)
#             .filter(LeaveRequest.id == leave_id)
#             .first()
#         )

#         if not leave:
#             raise HTTPException(404, "Leave request not found")

#         user_id = leave.user_id
#         leave_type = leave.leave_type
#         start_date = leave.start_date
#         end_date = leave.end_date

#         try:
#             status_enum = LeaveStatus(status)
#         except ValueError:
#             raise HTTPException(400, "Invalid status")

        
#         leave.status = status_enum
#         leave.approved_by = admin_id

       
#         if status_enum == LeaveStatus.approved:

#             current_date = start_date

#             while current_date <= end_date:

                
#                 holiday = (
#                     db.query(Holidays)
#                     .filter(Holidays.holiday_date == current_date)
#                     .first()
#                 )

#                 # if not holiday:
#                 #     # 🔍 Check if already exists (simulate ON CONFLICT DO NOTHING)
#                 #     existing_attendance = (
#                 #         db.query(Attendance)
#                 #         .filter(
#                 #             Attendance.user_id == user_id,
#                 #             Attendance.attendance_date == current_date,
#                 #         )
#                 #         .first()
#                 #     )

#                 #     if not existing_attendance:
#                 #         attendance = Attendance(
#                 #             user_id=user_id,
#                 #             attendance_date=current_date,
#                 #             status=leave_type.value  # enum → string
#                 #         )
#                 #         db.add(attendance)

#                 # current_date += timedelta(days=1)

#         db.commit()

#         return {"message": f"Leave {status} successfully"}

#     except HTTPException:
#         raise

#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=500, detail=str(e))

#     finally:
#         db.close()        
        
        

        
        
