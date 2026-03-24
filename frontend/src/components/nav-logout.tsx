"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import useUserSession from "@/features/stores/usersStore";
import { useNavigate } from "react-router-dom";

export function NavLogout({
    user,
}: any) {
    const { isMobile } = useSidebar()
    const navigate = useNavigate()
    const { logout } = useUserSession((state) => state)
    const handleLogout = () => {
        logout()
        navigate("/signin")
    }
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="
                            cursor-pointer
                            bg-purple-200
                            hover:bg-primary
                            text-primary
                        hover:text-white
                             data-[state=open]:bg-sidebar-accent 
                             data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="grid flex-1 text-left text-sm leading-tight justify-center items-center">
                                <span className="
                                truncate text-md 
                                ">
                                    {user.email}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width)
                         min-w-56 rounded-lg "
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuItem variant="destructive" onClick={handleLogout} className="cursor-pointer">

                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
