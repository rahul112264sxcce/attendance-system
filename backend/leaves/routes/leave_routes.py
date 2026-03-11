from fastapi import APIRouter, Depends
from leaves.schema.leave_schemas import LeaveRequest
from leaves.services.leaves_services import create_leave_request,get_leave_requests
from utils.token import get_current_user

router = APIRouter(tags=["Leave Request"])


@router.post("/leave-request")
def create_leave(data: LeaveRequest, current_user=Depends(get_current_user)):
    user_id = current_user
    return create_leave_request(user_id, data)


@router.get("/leave-requests")
def get_leave(current_user=Depends(get_current_user)):
    user_id = current_user["id"]
    role = current_user["role"]
    return get_leave_requests(user_id,role)