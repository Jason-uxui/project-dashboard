export type NavItemId =
    | "dashboard"
    | "inbox"
    | "calendar"
    | "pipeline"
    | "clients"
    | "campaigns"
    | "projects"
    | "content"
    | "my-tasks"
    | "talent"
    | "performance"
    | "payouts"
    | "invoices"
    | "expenses"
    | "reports"
    | "tax"
    | "brand-assets"
    | "playbook"
    | "templates"
    | "credentials"
    | "domains"
    | "contracts"
    | "policies"
    | "settings-brands"
    | "settings-team"
    | "integrations"
    | "automations"

export type NavItem = {
    id: NavItemId
    label: string
    badge?: number
}

export type NavGroup = {
    label: string
    items: NavItem[]
}

export type SidebarFooterItemId = "settings" | "help"

export type SidebarFooterItem = {
    id: SidebarFooterItemId
    label: string
}

export const navGroups: NavGroup[] = [
    {
        label: "Command",
        items: [
            { id: "dashboard", label: "Dashboard" },
            { id: "inbox", label: "Inbox", badge: 5 },
            { id: "calendar", label: "Calendar" },
        ],
    },
    {
        label: "Growth",
        items: [
            { id: "pipeline", label: "Pipeline" },
            { id: "clients", label: "Clients" },
            { id: "campaigns", label: "Campaigns" },
        ],
    },
    {
        label: "Production",
        items: [
            { id: "projects", label: "Projects" },
            { id: "content", label: "Content" },
            { id: "my-tasks", label: "My Tasks" },
        ],
    },
    {
        label: "Network",
        items: [
            { id: "talent", label: "Talent" },
            { id: "performance", label: "Performance" },
            { id: "payouts", label: "Payouts" },
        ],
    },
    {
        label: "Finance",
        items: [
            { id: "invoices", label: "Invoices" },
            { id: "expenses", label: "Expenses" },
            { id: "reports", label: "Reports" },
            { id: "tax", label: "Tax & Compliance" },
        ],
    },
    {
        label: "Library",
        items: [
            { id: "brand-assets", label: "Brand Assets" },
            { id: "playbook", label: "Playbook" },
            { id: "templates", label: "Templates" },
            { id: "credentials", label: "Credentials" },
            { id: "domains", label: "Domains & Hosting" },
            { id: "contracts", label: "Contracts" },
            { id: "policies", label: "Policies" },
        ],
    },
    {
        label: "Settings",
        items: [
            { id: "settings-brands", label: "Brands" },
            { id: "settings-team", label: "Team" },
            { id: "integrations", label: "Integrations" },
            { id: "automations", label: "Automations" },
        ],
    },
]

export const footerItems: SidebarFooterItem[] = [
    { id: "settings", label: "Settings" },
    { id: "help", label: "Help" },
]
