import * as React from "react"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { NavLogout } from "@/components/nav-logout"
import useUserSession from "@/features/stores/usersStore"




export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { user } = useUserSession((state) => state)

  const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
      ...(user?.role === "admin"
        ? [
          {
            title: "Employees",
            url: "/users",
          },
        ]
        : []),

      {
        title: "Attendance",
        url: "/attendance",
      },
      {
        title: "Leave Request",
        url: "/leave",
      },
      ...(user?.role === "admin"
        ? [
          {
            title: "Holidays",
            url: "/holidays",
          },
        ]
        : []),
        {
        title: "Work  home ",
        url: "/workfromhome",
      },
    ],
  }
  return (
    <Sidebar {...props}>
      <SidebarHeader className=" items-center">
         <span className="text-[8px]  bg-gradient-to-r from-indigo-500 to-pink-600 p-0.5 text-white rounded">
            Attendance
          </span>
        <div className="text-3xl font-semibold tracking-[0.5rem]">         
          Software
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

              {data?.navMain?.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link to={item?.url}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavLogout user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
