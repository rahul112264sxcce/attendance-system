
import { instance } from "@/helpers/axios";
import type { holidaysPayload, holidaysResponse, holidays } from "../types/holidays.types";
import type { AxiosError } from "axios";

const holidayApi = (data: holidaysPayload): Promise<holidaysResponse> => {
    return instance.post(`/holidays`, data)
}

const getHolidays = async (): Promise<holidays[]> => {
    try {
        const res = await instance.get<holidaysResponse>("/holidays")
        return res.data.data
    }
    catch (error) {
        throw error as AxiosError;
    }
}

export {
    holidayApi,
    getHolidays
}
