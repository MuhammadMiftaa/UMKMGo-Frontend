"use client";

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  DollarSign,
  Settings,
  LogOut,
  FolderOpen,
  ChevronDown,
  Newspaper,
} from "lucide-react";
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
} from "../ui/sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Permissions } from "../../lib/const";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    permission: [],
  },
  {
    title: "Program",
    icon: FolderOpen,
    permission: [
      Permissions.MANAGE_TRAINING_PROGRAMS,
      Permissions.MANAGE_CERTIFICATION_PROGRAMS,
      Permissions.MANAGE_FUNDING_PROGRAMS,
    ],
    subItems: [
      {
        title: "Pelatihan",
        url: "/programs/training",
        icon: GraduationCap,
        permission: [Permissions.MANAGE_TRAINING_PROGRAMS],
      },
      {
        title: "Sertifikasi",
        url: "/programs/certification",
        icon: Award,
        permission: [Permissions.MANAGE_CERTIFICATION_PROGRAMS],
      },
      {
        title: "Pendanaan",
        url: "/programs/funding",
        icon: DollarSign,
        permission: [Permissions.MANAGE_FUNDING_PROGRAMS],
      },
    ],
  },
  {
    title: "Artikel",
    url: "/news",
    icon: Newspaper,
    permission: [
      Permissions.MANAGE_NEWS,
      Permissions.VIEW_NEWS,
      Permissions.CREATE_NEWS,
      Permissions.EDIT_NEWS,
      Permissions.DELETE_NEWS,
    ],
  },
  {
    title: "Pelatihan",
    url: "/training",
    icon: GraduationCap,
    permission: [Permissions.VIEW_TRAINING],
  },
  {
    title: "Sertifikasi",
    url: "/certification",
    icon: Award,
    permission: [Permissions.VIEW_CERTIFICATION],
  },
  {
    title: "Pendanaan",
    url: "/funding",
    icon: DollarSign,
    permission: [Permissions.VIEW_FUNDING],
  },
  {
    title: "Pengaturan",
    url: "/settings",
    icon: Settings,
    permission: [
      Permissions.USER_MANAGEMENT,
      Permissions.ROLE_PERMISSIONS_MANAGEMENT,
      Permissions.GENERATE_REPORT,
      Permissions.SLA_CONFIGURATION,
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <img
            src="https://res.cloudinary.com/dblibr1t2/image/upload/v1762742634/umkmgo_logo.png"
            alt="UMKMGo Logo"
            className="h-12 w-12"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">UMKMGo</span>
            <span className="text-xs text-muted-foreground">
              Admin Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(
                (item) =>
                  (item.permission.some((p: string) =>
                    user?.permissions.includes(p)
                  ) ||
                    item.permission.length === 0) && (
                    <SidebarMenuItem key={item.title}>
                      {item.subItems ? (
                        <Collapsible
                          defaultOpen={location.pathname.startsWith(
                            "/programs"
                          )}
                        >
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
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={location.pathname === subItem.url}
                                  >
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
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === item.url}
                        >
                          <Link to={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  )
              )}
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
            Role:{" "}
            <span className="font-medium capitalize">
              {user?.role_name?.replace("_", " ")}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
