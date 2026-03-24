import useUserSession from "@/features/stores/usersStore";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";


export const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    timeout: 1000,
});

instance.interceptors.request.use((config) => {
    const user = useUserSession.getState().user
    if (user?.access_token) {
        config.headers.Authorization = `Bearer ${user.access_token}`
    }
    return config
})
const getWorkFromHome = async () => {
    try {
        const res = await instance.get("/wfh/requests")
        return res.data
    }
    catch (e) {
        console.error("get user", e);
    }
}
export const useWorkFromHomeRequestQuery = () => {
    return useSuspenseQuery({
        queryKey: ["workfromhome"],
        queryFn: () => getWorkFromHome(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
const getLeaveRequest = async () => {
    try {
        const res = await instance.get("/leave-requests")
        return res.data
    }
    catch (e) {
        console.error("get user", e);
    }
}
export const useLeaveRequestQuery = () => {
    return useSuspenseQuery({
        queryKey: ["leave_request"],
        queryFn: () => getLeaveRequest(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
const getAttendanceAll = async () => {
    try {
        const res = await instance.get("/attendance/cumulative")
        return res.data
    }
    catch (e) {
        console.error("get user", e);
    }
}
export const useAttendanceAllQuery = () => {
    return useSuspenseQuery({
        queryKey: ["attendance_all"],
        queryFn: () => getAttendanceAll(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
const getAttendanceToday = async () => {
    try {
        const res = await instance.get("/attendance/today")
        return res.data
    }
    catch (e) {
        console.error("get user", e);
    }
}
export const useAttendanceTodayQuery = () => {
    return useSuspenseQuery({
        queryKey: ["attendance_today"],
        queryFn: () => getAttendanceToday(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
const getHolidays = async () => {
    try {
        const res = await instance.get("/holidays")
        return res.data
    }
    catch (e) {
        console.error("get user", e);
    }
}
export const useHolidaysQuery = () => {
    return useSuspenseQuery({
        queryKey: ["holidays"],
        queryFn: () => getHolidays(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
const getUsers = async () => {
    try {
        const res = await instance.get("/get-users")
        return res.data.users
    }
    catch (error) {
        throw error as AxiosError;
    }
}
export const useUsersQuery = () => {
    return useSuspenseQuery({
        queryKey: ["users"],
        queryFn: () => getUsers(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        // enabled: !!userId
    })
}


// , {
//             params: {
//                 user_id: todoId,
//                 role: 'employee'
//             }
//         })