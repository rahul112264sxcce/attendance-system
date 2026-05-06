import { instance } from "@/helpers/axios";
import type { AxiosError } from "axios";
import type {
    UpdateStatusPayload,
    UpdateStatusResponse,
    WorkFromHomeDataResponse,
    workFromHomePayload,
    workFromHomeResponse
}
from "../types/wfh.types";

const workfromhomeApi = async (
    data: workFromHomePayload
): Promise<workFromHomeResponse> => {
    const res = await instance.post("/wfh/request", data)
    return res.data
}

const getWorkFromHome = async (): Promise<WorkFromHomeDataResponse> => {
    try {
        const res = await instance.get<WorkFromHomeDataResponse>("/wfh/requests")
        return res.data
    }
    catch (error) {
        throw error as AxiosError;
    }
}

const wftstatusApi = async ({ id, status }: UpdateStatusPayload): Promise<UpdateStatusResponse> => {
    
    const res = await instance.put<UpdateStatusResponse>(
        `/wfh/status/${id}`,
        { status }
    )
    return res.data
}

export {
    workfromhomeApi,
    getWorkFromHome,
    wftstatusApi
}
