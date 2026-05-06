import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import LeavesForm from "@/pages/leaveRequest/components/LeavesForm"


// type LeaveDialogProps = {
//     open: boolean
//     setPopupOpen: (value: boolean) => void
// }

const LeaveDialog = ({ open, setPopupOpen }: any) => {
    return (
        <Dialog open={open} onOpenChange={setPopupOpen}>
            <DialogTrigger asChild>
                <Button className="w-25 cursor-pointer">
                    Request Leave
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm [&>button]:cursor-pointer [&>button]:mt-3">
                <DialogHeader>
                    <DialogTitle>Add your Leave Days</DialogTitle>
                </DialogHeader>
                <LeavesForm setPopupOpen={setPopupOpen} />
            </DialogContent>
        </Dialog>
    )
}

export default LeaveDialog