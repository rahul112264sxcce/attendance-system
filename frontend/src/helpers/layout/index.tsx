import { Outlet, useLocation } from "react-router-dom"
import useLanguageStore from "../stores/useLanguageStore"
import { AppSidebar } from "@/components/app-sidebar"
import NotificationSheet from "@/components/notification/notification-sheet"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Layout() {
    const lang = useLanguageStore((state: any) => state.lang);
    const changeLanguage = useLanguageStore((state: any) => state.changeLanguage);
    const location = useLocation()
    const newString = location?.pathname?.slice(1);

    


    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="z-50 sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4 bg-border/50" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">{newString.toUpperCase()}</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationSheet />
                        <Select
                            value={lang}
                            onValueChange={changeLanguage}
                        >
                            <SelectTrigger className="w-[100px] focus:border-primary focus:outline-none focus:ring-0">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ta">Tamil</SelectItem>
                                    <SelectItem value="hi">Hindi</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
