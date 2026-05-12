import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as api from "@/auth/api/auth.api"
import type { LoginResponse, LoginPayload } from "@/auth/login/types/login.types";
import { handleApiError } from "@/helpers/apierrors/handleApiError";
import { AxiosError } from "axios";

import { toast } from "sonner";
import type { registerPayload, registerResponse, } from "../register/types/register.types";
import { useSetUser } from "@/helpers/stores/usersStore";
import type { GetUsersParams } from "../users/types/users.types";
export const useGetTranslations = () => {
    return useQuery({
        queryKey: ["translations"],
        queryFn: () => api.getTranslations(),
        placeholderData: (prev: any) => prev,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}


export const useLoginMutation = () => {
    const navigate = useNavigate();
    const setUser = useSetUser();

    const queryClient = useQueryClient()
    return useMutation<LoginResponse, Error, LoginPayload>({

        mutationFn: api.loginApi,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["translations"] })
            const { user_id, email, role, access_token, message } = data
            setUser({
                user_id,
                email,
                role,
                access_token
            })
            if (role == "admin") {
                navigate('/users')
            } else {
                navigate('/attendance')
            }
            toast.success(message + "🎉")
        },
        onError: (error) => {
            handleApiError(error as AxiosError)
        }
    })
}

export const useRegisterMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    return useMutation<registerResponse, Error, registerPayload>({
        mutationFn: api.registerApi,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            navigate('/login')
            toast.success(data.message + "🎉")
        },
        onError: (error) => {
            handleApiError(error as AxiosError)
        }
    })
}

export const useUsersQuery = (params: GetUsersParams) => {
    return useQuery({
        queryKey: ["users",
            params.page,
            params.limit,
            params.search,
            params.order],
        queryFn: () => api.getUsers(params),
        placeholderData: (prev: any) => prev,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
