import React from "react"
import type { AxiosError } from "axios"
// import WorkFromHomeForm from "@/pages/workfromhome/components/workfromhomeForm"
import WorkFromHomeTable from "@/pages/workfromhome/components/workfromhomeTable"
import { useWorkFromHomeRequestQuery } from "@/pages/workfromhome/hooks/useWfhHooks"
import { handleApiError } from "@/helpers/apierrors/handleApiError"
import PageTitle from "@/helpers/pageTitles/pageTitles"
import WorkFromHomeDialog from "./components/workfromhomeDialog"

function WorkFromHome() {

    const [open, setPopupOpen] = React.useState<boolean>(false)

    const { data: workfromhomedata, error } = useWorkFromHomeRequestQuery()

    React.useEffect(() => {
        if (error) {
            handleApiError(error as AxiosError)
        }
    }, [error]);

    return (
        <>
            <PageTitle title={"Work From Home"} />
            <WorkFromHomeDialog  open={open} setPopupOpen={setPopupOpen}/>
            <WorkFromHomeTable tableData={workfromhomedata.data} />
        </>
    )
}
export default WorkFromHome