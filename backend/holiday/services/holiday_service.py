from utils.database import SessionLocal
from holiday.models.holiday_models import Holidays
from fastapi import HTTPException
from utils.database import engine, Base

Base.metadata.create_all(bind=engine)


def create_holiday(data):
    db = SessionLocal()

    try:
       
        existing = (
            db.query(Holidays)
            .filter(Holidays.holiday_date == data.holiday_date)
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400, detail="Holiday already exists for this date"
            )

       
        new_holiday = Holidays(holiday_name=data.title, holiday_date=data.holiday_date)

        db.add(new_holiday)
        db.commit()
        db.refresh(new_holiday)  

        return {
            "message": "Holiday created",
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()


def get_all_holidays():
    db = SessionLocal()

    try:
        holidays = db.query(Holidays).order_by(Holidays.holiday_date.asc()).all()
        
        if not holidays:
            raise HTTPException(404, "No holidays found")
        
        return {"data": holidays}

    except HTTPException:
        raise
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()


