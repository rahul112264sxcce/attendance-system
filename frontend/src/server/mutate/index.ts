import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkinApi,  checkoutApi,  holidayApi, signInApi, signUpApi, type SigninResponse } from "@/features/api/auth";
import type { SignupPayload } from "@/components/forms/signupForm";
import type { SigninPayload } from "@/components/forms/signinForm";
import useUserSession from "@/features/stores/usersStore";
import { useNavigate } from "react-router-dom";



export const useSignUpMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (value: SignupPayload) => signUpApi(value),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },

        onError: (error, variables, context) => {
            console.error('Error:', error)
        }
    })
}
export const useSignInMutation = () => {
    const navigate = useNavigate()
    const { setUser } = useUserSession()
    const queryClient = useQueryClient()
    return useMutation<SigninResponse, Error, SigninPayload>({
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
            // queryClient.invalidateQueries({ queryKey: ['todos'] })
        },

        onError: (error, variables, context) => {
            console.error('Error:', error)
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
        },
        onError: (error, variables, context) => {
            console.error('Error:', error)
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
        onError: (error, variables, context) => {
            console.error('Error:', error)
        }
    })
}