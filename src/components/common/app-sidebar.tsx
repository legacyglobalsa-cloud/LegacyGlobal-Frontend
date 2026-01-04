import * as React from "react"
import { Link } from "react-router-dom"

import { NavMain } from "@/components/common/nav-main"
import { NavSecondary } from "@/components/common/nav-secondary"
import { NavUser } from "@/components/common/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getSidebarConfig, mockUsers, type UserRole } from "@/constants/sidebarConfig"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: UserRole
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const config = getSidebarConfig(role)
  const user = mockUsers[role]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={`/${role}`}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <img 
                    src={config.branding.logo || "/Logos/legacy-logo.png"} 
                    alt="Logo" 
                    className="size-6 object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{config.branding.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{config.branding.subtitle}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={config.navMain} />
        <NavSecondary items={config.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
