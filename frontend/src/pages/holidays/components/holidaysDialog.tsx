import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import HolidayForm from "./holidaysForm"
import type { holidaysDialogProps } from "../types/holidays.types"

const HolidaysDialog = ({ open, setPopupOpen }: holidaysDialogProps) => {
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
        </>
    )
}

export default HolidaysDialog;