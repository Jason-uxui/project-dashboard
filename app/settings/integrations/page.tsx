"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
    Selection,
    MagnifyingGlass,
    CheckCircle,
    WarningCircle,
    ArrowSquareOut,
    Plus,
    ArrowClockwise,
} from "@phosphor-icons/react/dist/ssr"

type IntegrationStatus = "Connected" | "Error" | "Disconnected" | "Syncing"
type Integration = {
    id: string
    name: string
    category: "Messaging" | "Storage" | "Finance" | "Marketing" | "Development"
    status: IntegrationStatus
    description: string
    lastSync?: string
    connectedBrands: string[]
}

const STATUS_CONFIG: Record<IntegrationStatus, { color: string; bg: string; icon: any }> = {
    Connected: { color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle },
    Error: { color: "text-red-400", bg: "bg-red-500/10", icon: WarningCircle },
    Syncing: { color: "text-blue-400", bg: "bg-blue-500/10", icon: ArrowClockwise },
    Disconnected: { color: "text-muted-foreground", bg: "bg-muted/40", icon: WarningCircle },
}

const MOCK_INTEGRATIONS: Integration[] = [
    { id: "INT-001", name: "Slack", category: "Messaging", status: "Connected", description: "Automated project notifications and team communication.", lastSync: "12 mins ago", connectedBrands: ["tirat", "debo", "berhan", "ethio-influencers", "ethiobot"] },
    { id: "INT-002", name: "Google Drive", category: "Storage", status: "Connected", description: "Shared asset storage and document management.", lastSync: "1 hour ago", connectedBrands: ["tirat", "debo", "berhan"] },
    { id: "INT-003", name: "Stripe", category: "Finance", status: "Syncing", description: "Payment processing and invoice synchronization.", lastSync: "Syncing now...", connectedBrands: ["berhan", "ethio-influencers"] },
    { id: "INT-004", name: "ManyChat", category: "Marketing", status: "Connected", description: "Interactive chat flows and AI bot management.", lastSync: "5 mins ago", connectedBrands: ["ethiobot"] },
    { id: "INT-005", name: "WhatsApp API", category: "Messaging", status: "Error", description: "Direct customer messaging via official Business API.", lastSync: "Failed 6h ago", connectedBrands: ["ethio-influencers"] },
    { id: "INT-006", name: "GitHub", category: "Development", status: "Connected", description: "Source control integration for code-bases.", lastSync: "32 mins ago", connectedBrands: ["debo"] },
    { id: "INT-007", name: "QuickBooks", category: "Finance", status: "Disconnected", description: "Financial reporting and tax automation.", connectedBrands: [] },
]

export default function IntegrationsSettingsPage() {
    const [search, setSearch] = useState("")

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1200px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Connected Integrations</h1>
                            <p className="text-sm text-muted-foreground mt-1">Connect and manage external tools for messaging, storage, and finance.</p>
                        </div>
                        <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 font-bold">
                            <Plus weight="bold" className="h-3.5 w-3.5" />Browse App Directory
                        </Button>
                    </div>

                    {/* Filter Bar */}
                    <div className="relative max-w-sm">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search integrations..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-bold">
                        {MOCK_INTEGRATIONS.map(int => {
                            const config = STATUS_CONFIG[int.status]
                            return (
                                <div key={int.id} className="group p-5 rounded-2xl border border-border/50 hover:bg-accent/30 transition-all flex flex-col h-full bg-muted/10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="h-12 w-12 rounded-xl bg-background border flex items-center justify-center font-bold text-lg shadow-sm">
                                            {int.name[0]}
                                        </div>
                                        <div className={`p-1 px-2.5 rounded-full ${config.bg} flex items-center gap-1.5 border border-white/5`}>
                                            <config.icon className={`h-3 w-3 ${config.color} ${int.status === "Syncing" ? "animate-spin" : ""}`} weight="fill" />
                                            <span className={`text-[10px] uppercase tracking-wider font-bold ${config.color}`}>{int.status}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold tracking-tight group-hover:text-blue-400 transition-colors uppercase">{int.name}</h3>
                                        <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed font-medium italic">"{int.description}"</p>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-border/40 flex flex-col gap-3 font-bold">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Connected Brands</span>
                                            <span className="text-[10px] font-bold text-foreground">{int.connectedBrands.length || "None"}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Daily Sync</span>
                                            <Switch defaultChecked={int.status !== "Disconnected"} />
                                        </div>

                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[9px] text-muted-foreground font-medium uppercase font-mono italic opacity-60">Last sync: {int.lastSync || "Never"}</span>
                                            <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase tracking-tighter hover:text-blue-400">Settings</Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {/* Empty State / Add Card */}
                        <button className="p-5 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center hover:bg-accent/20 transition-all min-h-[220px]">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                                <Plus className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Add New Integration</p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1 italic">Connect custom webhooks or APIs</p>
                        </button>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
