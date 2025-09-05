import { SidebarTrigger } from "../ui/sidebar"
import { Button } from "../ui/button"
import { Bell, Search } from "lucide-react"

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="h-4 w-px bg-sidebar-border" />
        <h1 className="text-lg font-semibold">Dashboard UMKM</h1>
      </div>

      <div className="ml-auto flex items-center gap-2 px-4">
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
