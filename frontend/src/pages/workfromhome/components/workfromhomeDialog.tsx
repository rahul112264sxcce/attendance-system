import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import WorkFromHomeForm from "./workfromhomeForm"
import type { WorkFromHomeDialogProps } from "../types/wfh.types"

const WorkFromHomeDialog = ({ open, setPopupOpen }: WorkFromHomeDialogProps) => {
    return (
        <>
            <Dialog open={open} onOpenChange={setPopupOpen}>
                <DialogTrigger asChild >
                    <Button className="w-25 cursor-pointer">Add WFH</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm [&>button]:cursor-pointer [&>button]:mt-3" >
                    <DialogHeader>
                        <DialogTitle>Add Work Home</DialogTitle>
                    </DialogHeader>
                    <WorkFromHomeForm setPopupOpen={setPopupOpen} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default WorkFromHomeDialog;