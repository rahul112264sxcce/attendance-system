import useUserSession from "@/features/stores/usersStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
    return useQuery({
        queryKey: ["attendance_all"],
        queryFn: () => getAttendanceAll(),
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
    return useQuery({
        queryKey: ["attendance_today"],
        queryFn: () => getAttendanceToday(),
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
    return useQuery({
        queryKey: ["holidays"],
        queryFn: () => getHolidays(),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}

const getUsers = async (todoId: any, role: any) => {
    try {
        const res = await instance.get("/get-users", {
            params: {
                user_id: todoId,
                role: role
            }
        })
        return res.data.users
    }
    catch (e) {
        console.error("get user", e);
    }
}


export const useUsersQuery = (userId: any, role: any) => {
    return useQuery({
        queryKey: ["users", userId, role],
        queryFn: () => getUsers(userId, role),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: !!userId
    })
}


