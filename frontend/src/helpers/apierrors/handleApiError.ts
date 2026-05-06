import { AxiosError } from "axios"
import { toast } from "sonner"

export const handleApiError = (error: AxiosError<any>) => {
    const message =
        error?.response?.data?.detail || "Something went wrong"

    toast.error(message)

    return message
}