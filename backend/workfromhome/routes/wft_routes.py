from fastapi import APIRouter, Depends
from workfromhome.schemas.wft_schemas import WFHSchema, WFHListResponse
from utils.token import get_current_user
from utils.validators import validate_status
# from workfromhome.services.wft_services import create_wfh_request,get_wfh_requests,update_wfh_status

from workfromhome.services.wft_services import (
    create_wfh_request,
    get_wfh_requests,
    update_wfh_status,
)
from workfromhome.schemas.wft_schemas import UpdateWFHStatusSchema

router = APIRouter(prefix="/wfh", tags=["Work From Home"])

@router.post("/request")
def request_wfh(data: WFHSchema, current_user=Depends(get_current_user)):
    user_id = current_user.id
    print(user_id, data, "data wft request")
    return create_wfh_request(user_id, data)

@router.get("/requests", response_model=WFHListResponse)
def list_wfh_requests(current_user=Depends(get_current_user)):
    return get_wfh_requests(current_user)

@router.put("/status/{request_id}")
def update_wfh(
    request_id: int, data: UpdateWFHStatusSchema, current_user=Depends(get_current_user)
):
    return update_wfh_status(request_id, data.status, current_user)
