import React from "react"
import { AxiosError } from "axios";
import { useHolidaysQuery } from "@/pages/holidays/hooks/useHolidaysHooks"
import HolidaysTable from "@/pages/holidays/components/holidaysTable"
import { handleApiError } from "@/helpers/apierrors/handleApiError";
import PageTitle from "@/helpers/pageTitles/pageTitles";
import HolidaysDialog from "./components/holidaysDialog";

function Holidays() {
    const { data, error } = useHolidaysQuery()
    const holidays = Array.isArray(data) ? data : data ? [data] : []

    const [open, setPopupOpen] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (error) {
            handleApiError(error as AxiosError)
        }
    }, [error])

    return (
        <>
            <PageTitle title={"Holidays"} />
            <HolidaysDialog  open={open} setPopupOpen={setPopupOpen}/>
            <HolidaysTable data={holidays} />
        </>
    )
}

export default Holidays