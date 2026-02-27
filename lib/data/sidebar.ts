export type NavItemId = "inbox" | "my-tasks" | "projects" | "clients" | "performance"

export type SidebarFooterItemId = "settings" | "templates" | "help"

export type NavItem = {
    id: NavItemId
    label: string
    badge?: number
    isActive?: boolean
}

export type ActiveProjectSummary = {
    id: string
    name: string
    color: string
    progress: number
}

export type SidebarFooterItem = {
    id: SidebarFooterItemId
    label: string
}

export const navItems: NavItem[] = [
    { id: "inbox", label: "Inbox" },
    { id: "my-tasks", label: "My task" },
    { id: "projects", label: "Projects", isActive: true },
    { id: "clients", label: "Clients" },
    { id: "performance", label: "Performance" },
]

export const activeProjects: ActiveProjectSummary[] = []

export const footerItems: SidebarFooterItem[] = [
    { id: "settings", label: "Settings" },
    { id: "templates", label: "Templates" },
    { id: "help", label: "Help" },
]
