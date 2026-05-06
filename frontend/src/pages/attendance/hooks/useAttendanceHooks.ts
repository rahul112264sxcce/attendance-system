
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as api from "@/pages/attendance/api/attendance.api"
import type { AxiosError } from "axios";
import { handleApiError } from "@/helpers/apierrors/handleApiError";
import { toast } from "sonner";
import type { AttendanceCheckInResponse, AttendanceCheckOutResponse } from "../types/attendance.types";

export const useCheckOutMutation = () => {
    const queryClient = useQueryClient()
    return useMutation<AttendanceCheckOutResponse, AxiosError>({
        mutationFn: () => api.checkoutApi(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['attendance_today'] })
            queryClient.invalidateQueries({ queryKey: ['attendance_all'] })
            toast.success(data?.message)
        },
        onError: (error: AxiosError<any>) => {
            handleApiError(error)
        }
    })
}

export const useCheckInMutation = () => {
    const queryClient = useQueryClient()
    return useMutation<AttendanceCheckInResponse, AxiosError>({
        mutationFn: () => api.checkinApi(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['attendance_today'] })
            queryClient.invalidateQueries({ queryKey: ['attendance_all'] })
            toast.success(data.message + "🎉")
        },
        onError: (error: AxiosError<any>) => {
            handleApiError(error)
        }
    })
}

export const useAttendanceAllQuery = () => {
    return useSuspenseQuery({
        queryKey: ["attendance_all"],
        queryFn: () => api.getAttendanceAll(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}

export const useAttendanceTodayQuery = () => {
    return useSuspenseQuery({
        queryKey: ["attendance_today"],
        queryFn: () => api.getAttendanceToday(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
