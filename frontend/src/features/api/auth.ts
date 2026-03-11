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