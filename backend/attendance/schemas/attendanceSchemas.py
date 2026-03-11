from pydantic import BaseModel, field_validator


class AttendanceSchema(BaseModel):
    user_id: int