from sqlalchemy import Column, Integer, String, DateTime,Date
from sqlalchemy.sql import func
from utils.database import Base

class Holidays(Base):
    __tablename__ = "holidays"

    id = Column(Integer, primary_key=True)

    holiday_name = Column(String(100), nullable=False)
    
    holiday_date = Column(Date, nullable=False)

    created_at = Column(DateTime, server_default=func.now())