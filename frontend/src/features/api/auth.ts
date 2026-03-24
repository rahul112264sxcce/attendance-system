import type { SigninPayload } from "@/components/forms/signinForm";
import { instance } from "@/server/queries";

export type SigninResponse = {
    user_id: string
    email: string
    role: string
    access_token: string
}

export const signUpApi = (data: any) => {
    return instance.post(`/create-users`, data)
}
export const signInApi = (data: SigninPayload) => {
    return instance.post<SigninResponse>(`/signin`, data)
}
export const holidayApi = (data: any) => {
    return instance.post(`/holidays`, data)
}
export const checkinApi = () => {
    return instance.post(`/attendance/check-in`)
}
export const checkoutApi = () => {
    return instance.post(`/attendance/check-out`)
}
export const leavereqApi = (data: any) => {
    return instance.post(`/leave-request`, data)
}
export const workfromhomeApi = (data: any) => {
    return instance.post(`/wfh/request`, data)
}
export const wftstatusApi = (data: any) => {
  return instance.put(`/wfh/status/${data.id}?status=${data.status}`)
}
export const leavestatusApi = (data: any) => {
  return instance.put(`/leave/${data.id}?status=${data.status}`)
}