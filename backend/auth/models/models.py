import enum
from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.sql import func
from utils.database import Base


class RoleEnum(enum.Enum):
    admin = "admin"
    employee = "employee"


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    
    employee_id = Column(String(20), unique=True, nullable=False)
    
    first_name = Column(String(50), nullable=False)
    
    last_name = Column(String(50))
    
    email = Column(String(100), unique=True, nullable=False)
    
    password_hash = Column(String(255), nullable=False)
    
    role = Column(Enum(RoleEnum), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    
