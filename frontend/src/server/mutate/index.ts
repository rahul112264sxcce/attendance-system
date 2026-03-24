import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { checkinApi, checkoutApi, holidayApi, leavereqApi, signInApi, signUpApi, wftstatusApi, workfromhomeApi, leavestatusApi, type SigninResponse } from "@/features/api/auth";
import type { SignupPayload } from "@/components/forms/signupForm";
import type { SigninPayload } from "@/components/forms/signinForm";
import useUserSession from "@/features/stores/usersStore";
import { handleApiError } from "@/server/handleApiError";

export const useSignUpMutation = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (value: SignupPayload) => signUpApi(value),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            navigate('/signin')
            toast.success("Signup successful")
        },
        onError: (error: AxiosError<any>, variables, context) => {
            handleApiError(error)
        }
    })
}
export const useSignInMutation = () => {
    const navigate = useNavigate()
    const { setUser } = useUserSession()
    const queryClient = useQueryClient()
    // return useMutation<SigninResponse, Error, SigninPayload>({
    return useMutation({
        mutationFn: async (value: SigninPayload) => {
            const res = await signInApi(value)
            return res.data
        },
        onSuccess: (data, variables, context) => {
            const { user_id, email, role, access_token } = data
            setUser({
                user_id,
                email,
                role,
                access_token
            })
            navigate('/attendance')
            toast.success("Signin successful 🎉")
        },
        onError: (error: AxiosError<any>, variables, context) => {
            handleApiError(error)
        }
    })
}
export const useholidayMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (value: any) => holidayApi(value),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['holidays'] })
        },
        onError: (error, variables, context) => {
            console.error('Error:', error)
        }
    })
}
export const useCheckInMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => checkinApi(),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['attendance_today'] })
            queryClient.invalidateQueries({ queryKey: ['attendance_all'] })
            toast.success("CheckIn successful 🎉")
        },
        onError: (error: AxiosError<any>, variables, context) => {
            handleApiError(error)
        }
    })
}
export const useCheckOutMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => checkoutApi(),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['attendance_today'] })
            queryClient.invalidateQueries({ queryKey: ['attendance_all'] })
        },
        onError: (error: AxiosError<any>, variables, context) => {
            handleApiError(error)
        }
    })
}
export const useLeaveReqMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (value: any) => leavereqApi(value),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['leave_request'] })
        },
        onError: (error, variables, context) => {
            console.error('Error:', error)
        }
    })
}
export const useWorkFromHomeMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (value: any) => workfromhomeApi(value),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['workfromhome'] })
        },
        onError: (error, variables, context) => {
            console.error('Error:', error)
        }
    })
}
export const useWftStatusMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (value: any) => wftstatusApi(value),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['workfromhome'] })
        },
        onError: (error, variables, context) => {
            console.error('Error:', error)
        }
    })
}
export const useLeaveStatusMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (value: any) => leavestatusApi(value),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['leave_request'] })
            queryClient.invalidateQueries({ queryKey: ['attendance_all'] })

        },
        onError: (error, variables, context) => {
            console.error('Error:', error)
        }
    })
}
