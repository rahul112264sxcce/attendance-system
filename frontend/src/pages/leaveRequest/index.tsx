import React from "react"
import LeaveRequestTable from "@/pages/leaveRequest/components/LeaveRequestTable"
import LeaveDialog from "@/pages/leaveRequest/components/LeaveDialog"
import PageTitle from "@/helpers/pageTitles/pageTitles"

function LeaveRequest() {

    const [open, setPopupOpen] = React.useState<boolean>(false)

    return (
        <>
            <PageTitle title={"Leave Request"} />
            <LeaveDialog open={open} setPopupOpen={setPopupOpen} />
            <LeaveRequestTable />
        </>
    )
}

export default LeaveRequest