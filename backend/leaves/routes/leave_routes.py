from fastapi import APIRouter, Depends
from leaves.schema.leave_schemas import LeaveRequestSchema,UpdateLeaveRequest
from utils.validators import validate_status
from leaves.services.leaves_services import (
    create_leave_request,
    get_leave_requests,
    update_leave_status,
)
from utils.token import get_current_user

router = APIRouter(tags=["Leave Request"])

@router.post("/leave-request")
def create_leave(data: LeaveRequestSchema, current_user=Depends(get_current_user)):
   print(data, "data")
   return create_leave_request(current_user, data)

@router.get("/leave-requests")
def get_leave(current_user=Depends(get_current_user)):
    
    return get_leave_requests(current_user)


@router.put("/leave/{leave_id}")
def update_leave(
    leave_id: int,
    request: UpdateLeaveRequest,
    current_user=Depends(get_current_user)
):
    validate_status(request.status)


    return update_leave_status(leave_id, current_user.id, request.status,)

# @router.put("/leave/{leave_id}")
# def update_leave(leave_id: int, status: str, current_user=Depends(get_current_user)):
#     validate_status(status)
#     user_id = current_user["id"]
#     return update_leave_status(leave_id, user_id, status)
