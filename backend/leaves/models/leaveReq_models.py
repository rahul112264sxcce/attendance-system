from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from utils.database import Base
import enum

class LeaveType(enum.Enum):
    sick = "sick"
    casual = "casual"
    annual = "annual"
    unpaid = "unpaid"
    maternity = "maternity"
    paternity = "paternity"
    bereavement = "bereavement"

class LeaveStatus(enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    leave_type = Column(
        Enum(LeaveType),
        nullable=False
    )

    start_date = Column(Date, nullable=False)
    
    end_date = Column(Date, nullable=False)

    reason = Column(String(255), nullable=True)

    status = Column(
        Enum(LeaveStatus),
        nullable=False
    )

    created_at = Column(DateTime, server_default=func.now())
    
    updated_at = Column(DateTime, onupdate=func.now())

    user = relationship("Users", backref="leave_requests")