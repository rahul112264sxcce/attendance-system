import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
// import { checkinApi, checkoutApi } from "@/server/api/api";
import { handleApiError } from "@/helpers/apierrors/handleApiError";



// export const useCheckInMutation = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationFn: () => checkinApi(),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['attendance_today'] })
//             queryClient.invalidateQueries({ queryKey: ['attendance_all'] })
//             toast.success("CheckIn successful 🎉")
//         },
//         onError: (error: AxiosError<any>) => {
//             handleApiError(error)
//         }
//     })
// }
// export const useCheckOutMutation = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationFn: () => checkoutApi(),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['attendance_today'] })
//             queryClient.invalidateQueries({ queryKey: ['attendance_all'] })
//         },
//         onError: (error: AxiosError<any>) => {
//             handleApiError(error)
//         }
//     })
// }
// export const useLeaveReqMutation = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationFn: (value: any) => leavereqApi(value),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['leave_request'] })
//         },
//         onError: (error: AxiosError<any>) => {
//             handleApiError(error)
//         }
//     })
// }


// export const useLeaveStatusMutation = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationFn: (value: any) => leavestatusApi(value),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['leave_request'] })
//             queryClient.invalidateQueries({ queryKey: ['attendance_all'] })
//         },
//         onError: (error: AxiosError<any>) => {
//             handleApiError(error)
//         }
//     })
// }
