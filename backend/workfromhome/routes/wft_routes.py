from fastapi import APIRouter, Depends,HTTPException
from workfromhome.schemas.wft_schemas import WFHSchema
from utils.token import get_current_user
from utils.validators import validate_status
from workfromhome.services.wft_services import create_wfh_request,get_wfh_requests,update_wfh_status


router = APIRouter(
    prefix="/wfh",
    tags=["Work From Home"]
)

# Employee request WFH
@router.post("/request")
def request_wfh(data :WFHSchema, current_user=Depends(get_current_user)):
    user_id = current_user["id"]
    print(user_id ,data)
    return create_wfh_request(user_id, data)



@router.get("/requests")
def list_wfh_requests(current_user=Depends(get_current_user)):
    user_id = current_user["id"]
    role = current_user["role"]
    return get_wfh_requests(user_id, role)


@router.put("/status/{request_id}")
def update_wfh(request_id: int,status: str,current_user='employee'):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admin can access")
    validate_status(status)
    return update_wfh_status(request_id, status)