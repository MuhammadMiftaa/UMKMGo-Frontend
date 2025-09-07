"use client"

import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  DollarSign,
  Settings,
  LogOut,
  Building2,
  FolderOpen,
  ChevronDown,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Programs",
    icon: FolderOpen,
    subItems: [
      {
        title: "Trainings",
        url: "/programs/trainings",
        icon: GraduationCap,
      },
      {
        title: "Certifications",
        url: "/programs/certifications",
        icon: Award,
      },
      {
        title: "Fundings",
        url: "/programs/fundings",
        icon: DollarSign,
      },
    ],
  },
  {
    title: "Pelatihan",
    url: "/training",
    icon: GraduationCap,
  },
  {
    title: "Sertifikasi",
    url: "/certification",
    icon: Award,
  },
  {
    title: "Pendanaan",
    url: "/funding",
    icon: DollarSign,
  },
  {
    title: "Pengaturan",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Building2 className="h-6 w-6 text-sidebar-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">SAPA UMKM</span>
            <span className="text-xs text-muted-foreground">Admin Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible defaultOpen={location.pathname.startsWith("/programs")}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={location.pathname === subItem.url}>
                                <Link to={subItem.url}>
                                  <subItem.icon />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          <div className="mb-2 text-xs text-muted-foreground">
            Masuk sebagai: <span className="font-medium">{user?.name}</span>
          </div>
          <div className="mb-2 text-xs text-muted-foreground">
            Role: <span className="font-medium capitalize">{user?.role?.replace("_", " ")}</span>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="w-full bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
