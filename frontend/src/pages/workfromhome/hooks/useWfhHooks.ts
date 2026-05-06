import { AxiosError } from "axios";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import * as api from "@/pages/workfromhome/api/wfh.api"
import type { UpdateStatusPayload, UpdateStatusResponse, workFromHomePayload, workFromHomeResponse } from "../types/wfh.types";
import { handleApiError } from "@/helpers/apierrors/handleApiError";
import { toast } from "sonner";

export const useWorkFromHomeMutation = () => {
    const queryClient = useQueryClient()
    return useMutation<workFromHomeResponse, Error, workFromHomePayload>({
        mutationFn: (data) => api.workfromhomeApi(data),
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ['workfromhome'] })
        },
        onError: (error) => {
            handleApiError(error as AxiosError)
        }
    })
}

export const useWorkFromHomeRequestQuery = () => {
    return useSuspenseQuery({
        queryFn: () => api.getWorkFromHome(),
        queryKey: ["workfromhome"],
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}

export const useWftStatusMutation = () => {
    const queryClient = useQueryClient()
    return useMutation<UpdateStatusResponse, Error, UpdateStatusPayload>({
        mutationFn: (value) => api.wftstatusApi(value),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workfromhome'] })
        },
        onError: (error) => {
              handleApiError(error as AxiosError)
        }
    })
}