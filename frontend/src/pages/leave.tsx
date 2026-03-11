import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import LeavesForm from "@/components/forms/leaveForm"

function LeaveRequest(){
    return(
        <>
         <Dialog>
                <DialogTrigger asChild >
                    <Button className="w-25 cursor-pointer">Request Leave</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm [&>button]:cursor-pointer [&>button]:mt-3" >
                    <DialogHeader>
                        <DialogTitle>Add your Leave Days</DialogTitle>
                    </DialogHeader>
                    <LeavesForm />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default LeaveRequest