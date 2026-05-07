from fastapi import HTTPException
from utils.database import engine, Base, SessionLocal
from datetime import date
from sqlalchemy.orm import joinedload
from workfromhome.models.wft_models import WFHRequest, WFHStatus
from holiday.models.holiday_models import Holidays
from leaves.models.leaveReq_models import LeaveRequest,LeaveStatus
# from pydantic import BaseModel

Base.metadata.create_all(bind=engine)



def create_wfh_request(user_id: int, data):
    db = SessionLocal()

    try:
       
        if data.start_date > data.end_date:
            raise HTTPException(
                status_code=400, detail="Start date cannot be after end date"
            )

        if data.start_date < date.today():
            raise HTTPException(
                status_code=400, detail="WFH cannot be requested for past dates"
            )

        # Check if any date in the range falls on a holiday
        holiday = (
            db.query(Holidays)
            .filter(
                Holidays.holiday_date >= data.start_date,
                Holidays.holiday_date <= data.end_date,
            )
            .first()
        )

        if holiday:
            raise HTTPException(
                status_code=400,
                detail=f"{holiday.holiday_name} ({holiday.holiday_date})",
            )

        # Check if user has an approved leave overlapping with WFH dates
        leave = (
            db.query(LeaveRequest)
            .filter(
                LeaveRequest.user_id == user_id,
                LeaveRequest.status != LeaveStatus.rejected,
                LeaveRequest.start_date <= data.end_date,
                LeaveRequest.end_date >= data.start_date,
            )
            .first()
        )

        if leave:
            raise HTTPException(
                status_code=400,
                detail=f"Your leave request ({leave.start_date} to {leave.end_date}) is {leave.status.value}",
            )

        # Check for existing WFH request overlapping
        existing = (
            db.query(WFHRequest)
            .filter(
                WFHRequest.user_id == user_id,
                WFHRequest.status != WFHStatus.rejected,
                WFHRequest.start_date <= data.end_date,
                WFHRequest.end_date >= data.start_date,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400, detail="WFH already requested for this period"
            )

        
        new_request = WFHRequest(
            user_id=user_id,
            start_date=data.start_date,
            end_date=data.end_date,
            reason=data.reason,
            status=WFHStatus.pending,
        )

        db.add(new_request)
        db.commit()
        db.refresh(new_request)

        return {
            "message": "WFH request submitted",
            # "data": {
            #     "id": new_request.id,
            #     "status": new_request.status.value,
            #     "start_date": new_request.start_date,
            #     "end_date": new_request.end_date,
            # },
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()


def get_wfh_requests(current_user):
    db = SessionLocal()
    try:
        today = date.today()
        db.query(WFHRequest).filter(
            WFHRequest.status == WFHStatus.pending,
            WFHRequest.end_date < today
        ).update(
            {WFHRequest.status: WFHStatus.rejected},
            synchronize_session=False
        )
        db.commit()

        query = db.query(WFHRequest).options(joinedload(WFHRequest.user))

        if current_user.role.value != "admin":
            query = query.filter(WFHRequest.user_id == current_user.id)

        requests = query.order_by(WFHRequest.created_at.desc()).all()
        
        return {
            "data": [
                {
                    "id": r.id,
                    "start_date": r.start_date,
                    "end_date": r.end_date,
                    "reason": r.reason,
                    "status": r.status.value,
                    "employee_name": f"{r.user.first_name} {r.user.last_name}".strip(),
                    "employee_id": r.user.employee_id,
                    "created_at": r.created_at
                }
                for r in requests
            ]
        }
        
    except HTTPException:
        raise
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()




def update_wfh_status(request_id: int,status, current_user):
   
    db = SessionLocal()

    try:
        
        if current_user.role.value != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")

        try:
            status_enum = WFHStatus(status)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid status")

        request = db.query(WFHRequest).filter(WFHRequest.id == request_id).first()

        if not request:
            raise HTTPException(status_code=404, detail="WFH request not found")

        if request.status != WFHStatus.pending:
            raise HTTPException(status_code=400, detail="Request already processed")

        request.status = status_enum

        db.commit()
        db.refresh(request)
       
        return {
            "message": "Updated successfully",
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()


