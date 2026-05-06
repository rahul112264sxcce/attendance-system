
import { instance } from "@/helpers/axios";
import type { LoginPayload, LoginResponse } from "@/auth/login/types/login.types";
import type { registerPayload, registerResponse } from "@/auth/register/types/register.types";
import type { AxiosError } from "axios";
import type { GetUsersParams, UsersResponse } from "../users/types/users.types";

const registerApi = async (data: registerPayload): Promise<registerResponse> => {
    const response = await instance.post<registerResponse>(`/create-users`, data)
    return response.data
}

//“This function will return a Promise containing LoginResponse” Promise<LoginResponse>
const loginApi = async (data: LoginPayload): Promise<LoginResponse> => {
    // .post<LoginResponse>() → POST request with expected response type
    const response = await instance.post<LoginResponse>("/login", data)
    return response.data
}

const getUsers = async (params: GetUsersParams): Promise<UsersResponse> => {
    try {
        const res = await instance.get<UsersResponse>("/get-users", { params })
        return res.data
    }
    catch (error) {
        throw error as AxiosError;
    }
}

export {
    registerApi,
    loginApi,
    getUsers
}