import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "../ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Header } from "./Header"

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-sky-50">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
