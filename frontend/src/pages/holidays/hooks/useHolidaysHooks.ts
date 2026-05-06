import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as api from "@/pages/holidays/api/holidays.api"
import type { holidays, holidaysResponse, holidaysPayload } from "@/pages/holidays/types/holidays.types";
import { handleApiError } from "@/helpers/apierrors/handleApiError";

export const useholidayMutation = () => {
    const queryClient = useQueryClient()
    return useMutation<holidaysResponse, Error, holidaysPayload>({
        mutationFn: api.holidayApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['holidays'] })
        },
        onError: (error) => {
            handleApiError(error as AxiosError)
        }
    })
}

export const useHolidaysQuery = () => {
    return useSuspenseQuery<holidays[]>({
        queryKey: ["holidays"],
        queryFn: () => api.getHolidays(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}