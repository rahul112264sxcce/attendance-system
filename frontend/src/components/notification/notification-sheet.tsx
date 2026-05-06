import React from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { Bell } from "lucide-react"

const NotificationSheet = () => {
    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="relative">
                    <Bell className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                        1
                    </span>
                </button>
            </SheetTrigger>

            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>

                <div className="mt-5 space-y-3 px-3">
                    <div className="p-3 border rounded-lg">
                        New attendance request
                    </div>

                    <div className="p-3 border rounded-lg">
                      New Leave Request
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default NotificationSheet