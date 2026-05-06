import * as React from "react"
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
import { useUser } from "@/helpers/stores/usersStore"
import { useTranslation } from "react-i18next"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const user = useUser()
  const { t } = useTranslation();
  

  const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
      ...(user?.role === "admin"
        ? [
          {
            title: t("Employees"),
            url: "/users",
          },
        ]
        : []),

      {
        title: t("Attendance"),
        url: "/attendance",
      },
      {
        title: t("Leave"),
        url: "/leave",
      },
      ...(user?.role === "admin"
        ? [
          {
            title: t("Holidays"),
            url: "/holidays",
          },
        ]
        : []),
      {
        title: t("WorkFromHome"),
        url: "/workfromhome",
      },
    ],
  }
  return (
    <Sidebar {...props}>
      <SidebarHeader className=" items-center">
        <span className="text-[8px]  bg-linear-to-r from-indigo-500 to-pink-600 p-0.5 text-white rounded">
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
