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
                             data-[state=open]:bg-sidebar-accent 
                             data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="grid flex-1 text-left text-sm leading-tight justify-center items-center">
                                {/* <span className="truncate font-medium">{user.first_name}</span> */}
                                <span className="
                                truncate text-md 
                                text-muted-foreground 
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

                        {/* <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">

                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-red-100 hover:text-red-700">
                            {/* <IconLogout /> */}
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
