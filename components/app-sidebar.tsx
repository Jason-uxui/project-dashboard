"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProgressCircle } from "@/components/progress-circle"
import {
  MagnifyingGlass,
  Tray,
  CheckSquare,
  Folder,
  Users,
  ChartBar,
  Gear,
  Layout,
  Question,
  SignOut,
  CaretRight,
  CaretUpDown,
} from "@phosphor-icons/react/dist/ssr"
import { activeProjects, footerItems, navItems, type NavItemId, type SidebarFooterItemId } from "@/lib/data/sidebar"
import { SettingsDialog } from "@/components/settings/SettingsDialog"
import { AuthDialog, type AuthMode } from "@/components/auth/AuthDialog"

const navItemIcons: Record<NavItemId, React.ComponentType<{ className?: string }>> = {
  inbox: Tray,
  "my-tasks": CheckSquare,
  projects: Folder,
  clients: Users,
  performance: ChartBar,
}

const footerItemIcons: Record<SidebarFooterItemId, React.ComponentType<{ className?: string }>> = {
  settings: Gear,
  templates: Layout,
  help: Question,
}

export function AppSidebar() {
  const pathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in")

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode)
    setIsAuthOpen(true)
  }

  const getHrefForNavItem = (id: NavItemId): string => {
    if (id === "my-tasks") return "/tasks"
    if (id === "projects") return "/"
    if (id === "inbox") return "/inbox"
    if (id === "clients") return "/clients"
    if (id === "performance") return "/performance"
    return "#"
  }

  const isItemActive = (id: NavItemId): boolean => {
    if (id === "projects") {
      return pathname === "/" || pathname.startsWith("/projects")
    }
    if (id === "my-tasks") {
      return pathname.startsWith("/tasks")
    }
    if (id === "inbox") {
      return pathname.startsWith("/inbox")
    }
    if (id === "clients") {
      return pathname.startsWith("/clients")
    }
    if (id === "performance") {
      return pathname.startsWith("/performance")
    }
    return false
  }

  return (
    <Sidebar className="border-border/40 border-r-0 shadow-none border-none">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-800 text-primary-foreground shadow-[inset_0_-5px_6.6px_0_rgba(0,0,0,0.25)]">
              <img src="/logo-wrapper.png" alt="Logo" className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Workspace</span>
              <span className="text-xs text-muted-foreground">Pro plan</span>
            </div>
          </div>
          <button className="rounded-md p-1 hover:bg-accent">
            <CaretUpDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-0 gap-0">
        <SidebarGroup>
          <div className="relative px-0 py-0">
            <MagnifyingGlass className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="h-9 rounded-lg bg-muted/50 pl-8 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/20 border-border border shadow-none"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const href = getHrefForNavItem(item.id)
                const active = isItemActive(item.id)

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="h-9 rounded-lg px-3 font-normal text-muted-foreground"
                    >
                      <Link href={href}>
                        {(() => {
                          const Icon = navItemIcons[item.id]
                          return Icon ? <Icon className="h-[18px] w-[18px]" /> : null
                        })()}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge className="bg-muted text-muted-foreground rounded-full px-2">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground">
            Active Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeProjects.map((project) => (
                <SidebarMenuItem key={project.name}>
                  <SidebarMenuButton className="h-9 rounded-lg px-3 group">
                    <ProgressCircle progress={project.progress} color={project.color} size={18} />
                    <span className="flex-1 truncate text-sm">{project.name}</span>
                    <span className="opacity-0 group-hover:opacity-100 rounded p-0.5 hover:bg-accent">
                      <span className="text-muted-foreground text-lg">···</span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                className="h-9 rounded-lg px-3 text-muted-foreground"
                onClick={() => {
                  if (item.id === "settings") {
                    setIsSettingsOpen(true)
                  }
                }}
              >
                {(() => {
                  const Icon = footerItemIcons[item.id]
                  return Icon ? <Icon className="h-[18px] w-[18px]" /> : null
                })()}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              id="sidebar-user-menu-trigger"
              className="mt-2 flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-accent cursor-pointer"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar-profile.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">Jason D</span>
                <span className="text-xs text-muted-foreground">jason.duong@mail.com</span>
              </div>
              <CaretRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-40">
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onSelect={() => openAuth("sign-in")}
            >
              <SignOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <AuthDialog
        open={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </Sidebar>
  )
}
