from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey,Enum
from datetime import datetime, date
# from sqlalchemy.orm import relationship
import enum
from utils.database import Base


class AttendanceStatus(enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LEAVE = "leave"
    HALF_DAY = "half_day"
    
class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    attendance_date = Column(Date, default=date.today, nullable=False)

    in_time = Column(DateTime, nullable=True)
    out_time = Column(DateTime, nullable=True)

    work_hours = Column(Integer, nullable=True)  
    
    status = Column(
        Enum(AttendanceStatus),
        default=AttendanceStatus.PRESENT,
        nullable=False
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # user = relationship("User", back_populates="attendances")