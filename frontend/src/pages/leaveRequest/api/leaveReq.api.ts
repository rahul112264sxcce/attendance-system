import { instance } from "@/helpers/axios";
import type { AxiosError } from "axios";
import type { LeaveReqResponse } from "../types/leaveRequest.types";

const getLeaveRequest = async () => {
    try {
        const res = await instance.get<LeaveReqResponse>("/leave-requests")
        return res.data
    }
    catch (error) {
        throw error as AxiosError;
    }
}

const leavereqApi = (data: any) => {
    return instance.post(`/leave-request`, data)
}

const leavestatusApi = (data: any) => {
    return instance.put(`/leave/${data.id}`, {
        status: data.status
    })
}


export {
    getLeaveRequest,
    leavestatusApi,
    leavereqApi
}