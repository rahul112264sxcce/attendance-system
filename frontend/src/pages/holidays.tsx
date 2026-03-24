import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import HolidayForm from "@/components/forms/holidaysForm"
import { useHolidaysQuery } from "@/server/queries"
import HolidaysTable from "@/components/tables/holidaysTable"
import React from "react"

function Holidays() {
    const { data } = useHolidaysQuery()
    const holidays = Array.isArray(data) ? data : data ? [data] : []
    const [open, setPopupOpen] = React.useState<boolean>(false)

    return (
        <>
            <Dialog open={open} onOpenChange={setPopupOpen}>
                <DialogTrigger asChild >
                    <Button className="w-25 cursor-pointer">Add Holiday</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm [&>button]:cursor-pointer [&>button]:mt-3" >
                    <DialogHeader>
                        <DialogTitle>Add Company Holiday</DialogTitle>
                    </DialogHeader>
                    <HolidayForm setPopupOpen={setPopupOpen} />
                </DialogContent>
            </Dialog>
            <HolidaysTable data={holidays} />
        </>
    )
}

export default Holidays