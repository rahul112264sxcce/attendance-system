import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import * as api from "@/pages/leaveRequest/api/leaveReq.api"
import { handleApiError } from "@/helpers/apierrors/handleApiError";
import type { AxiosError } from "axios";

export const useLeaveRequestQuery = () => {
    return useSuspenseQuery({
        queryKey: ["leave_request"],
        queryFn: () => api.getLeaveRequest(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}

export const useLeaveReqMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (value: any) => api.leavereqApi(value),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leave_request'] })
        },
        onError: (error: AxiosError<any>) => {
            handleApiError(error)
        }
    })
}


export const useLeaveStatusMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (value: any) => api.leavestatusApi(value),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leave_request'] })
            queryClient.invalidateQueries({ queryKey: ['attendance_all'] })
        },
        onError: (error) => {
            handleApiError(error as AxiosError)
        }
    })
}
