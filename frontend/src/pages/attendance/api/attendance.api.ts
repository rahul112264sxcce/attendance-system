import { instance } from "@/helpers/axios";
import type { AllAttendanceResponse, AttendanceCheckInResponse, AttendanceCheckOutResponse, AttendanceTodayResponse } from "../types/attendance.types";
import type { AxiosError } from "axios";

const checkinApi = async (): Promise<AttendanceCheckInResponse> => {
    const response = await instance.post<AttendanceCheckInResponse>(`/attendance/check-in`)
    return response.data
}

const checkoutApi = async (): Promise<AttendanceCheckOutResponse> => {
    const response = await instance.post<AttendanceCheckOutResponse>(`/attendance/check-out`)
    return response.data
}

const getAttendanceAll = async (): Promise<AllAttendanceResponse[]> => {
    try {
        const res = await instance.get<AllAttendanceResponse[]>("/attendance/cumulative")
        return res.data
    }
    catch (error) {
        throw error as AxiosError;
    }
}

const getAttendanceToday = async (): Promise<AttendanceTodayResponse> => {
    try {
        const res = await instance.get<AttendanceTodayResponse>("/attendance/today")
        return res.data
    }
    catch (error) {
        throw error as AxiosError;
    }
}

export {
    getAttendanceToday,
    getAttendanceAll,
    checkinApi,
    checkoutApi
}