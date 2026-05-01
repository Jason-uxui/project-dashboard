"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Robot,
    Plus,
    ArrowClockwise,
    Lightning,
    Clock,
    WarningCircle,
    Play,
    Square,
    DotsThreeVertical,
    ChartBar,
    CheckCircle,
} from "@phosphor-icons/react/dist/ssr"

type AutomationStatus = "Idle" | "Running" | "Failed" | "Paused"
type Automation = {
    id: string
    name: string
    trigger: string
    action: string
    status: AutomationStatus
    lastRun: string
    runsToday: number
    successRate: number
}

const MOCK_AUTOMATIONS: Automation[] = [
    { id: "AUT-001", name: "Client Onboarding Flow", trigger: "New Client Added", action: "Create Folders & Slack Channel", status: "Idle", lastRun: "24 mins ago", runsToday: 3, successRate: 100 },
    { id: "AUT-002", name: "Payout Notifications", trigger: "Payout Marked Paid", action: "Email Freelancer & Update Log", status: "Running", lastRun: "Just now", runsToday: 42, successRate: 98.4 },
    { id: "AUT-003", name: "Invoice Reminder Bot", trigger: "Invoice Overdue +3 Days", action: "WhatsApp Business Alert", status: "Paused", lastRun: "2 days ago", runsToday: 0, successRate: 100 },
    { id: "AUT-004", name: "Daily Report Sync", trigger: "00:00 UTC", action: "Generate PDF & GDrive Upload", status: "Failed", lastRun: "9 hours ago", runsToday: 1, successRate: 0 },
    { id: "AUT-005", name: "Lead Capture Router", trigger: "Website Form Submit", action: "HubSpot CRM Create + Slack Notify", status: "Idle", lastRun: "1 hour ago", runsToday: 8, successRate: 100 },
]

export default function AutomationsSettingsPage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1200px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Active Automations</h1>
                            <p className="text-sm text-muted-foreground mt-1">Monitor background tasks, webhook triggers, and autonomous workflows.</p>
                        </div>
                        <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-3.5 w-3.5" weight="bold" />New Workflow
                        </Button>
                    </div>

                    {/* Workflow Stats */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Runs Today</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <p className="text-2xl font-bold tracking-tighter">154</p>
                                <span className="text-[10px] text-emerald-400 font-bold tracking-tighter">+12% vs yesterday</span>
                            </div>
                        </div>
                        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Average Success Rate</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <p className="text-2xl font-bold tracking-tighter">99.2%</p>
                                <span className="text-[10px] text-emerald-400 font-bold tracking-tighter">Optimal</span>
                            </div>
                        </div>
                        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Active Engines</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <p className="text-2xl font-bold tracking-tighter">14</p>
                                <span className="text-[10px] text-blue-400 font-bold tracking-tighter">Make / Zapier / Internal</span>
                            </div>
                        </div>
                        <div className="rounded-xl border border-red-500/20 p-4 bg-red-500/5">
                            <p className="text-[10px] uppercase font-bold text-red-400 tracking-widest font-mono">Failure Alerts</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <p className="text-2xl font-bold tracking-tighter text-red-500 underline underline-offset-4">1 Critical</p>
                            </div>
                        </div>
                    </div>

                    {/* List View */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2 p-1">
                            <ChartBar className="h-4 w-4 text-blue-400" />
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground italic">Workflow Registry</h2>
                        </div>

                        {MOCK_AUTOMATIONS.map(auto => (
                            <div key={auto.id} className="group flex items-center gap-4 p-4 pr-6 rounded-2xl border border-border/50 hover:bg-accent/30 transition-all bg-muted/5 relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full font-bold ${auto.status === "Running" ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : auto.status === "Failed" ? "bg-red-500" : auto.status === "Paused" ? "bg-amber-500" : "bg-muted-foreground/30"}`} />

                                <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-95">
                                    <Robot className={`h-5 w-5 ${auto.status === "Running" ? "text-blue-400 animate-pulse" : "text-muted-foreground"}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold tracking-tight uppercase group-hover:text-blue-400 transition-colors">{auto.name}</h3>
                                        <Badge variant="outline" className={`text-[9px] h-4 uppercase font-bold font-mono tracking-tighter border-0 shadow-none px-0 opacity-60 ${auto.status === "Failed" ? "text-red-400" : "text-muted-foreground"}`}>#{auto.id}</Badge>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5 overflow-hidden font-bold">
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <Lightning className="h-3 w-3 text-amber-500" weight="fill" />
                                            <span className="text-[10px] text-foreground/80 font-bold underline decoration-dotted underline-offset-2 uppercase tracking-tighter">{auto.trigger}</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-[-2px] opacity-40">➔</span>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <CheckCircle className="h-3 w-3 text-emerald-500" weight="fill" />
                                            <span className="text-[10px] text-foreground/80 font-bold uppercase tracking-tighter">{auto.action}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics on Row */}
                                <div className="flex items-center gap-8 text-right shrink-0 mr-4 font-bold">
                                    <div className="flex flex-col items-end gap-1">
                                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Runs / Today</p>
                                        <p className={`text-xs font-bold tracking-widest ${auto.runsToday > 0 ? "text-foreground" : "text-muted-foreground/40"}`}>{auto.runsToday}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 min-w-[80px]">
                                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold italic">Success</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1 w-12 rounded-full bg-muted overflow-hidden border border-white/5">
                                                <div className={`h-full ${auto.successRate === 100 ? "bg-emerald-500" : auto.successRate > 90 ? "bg-blue-500" : "bg-red-500"}`} style={{ width: `${auto.successRate}%` }} />
                                            </div>
                                            <span className={`text-xs font-bold font-mono ${auto.successRate === 100 ? "text-emerald-400" : auto.successRate === 0 ? "text-red-400" : "text-foreground"}`}>{auto.successRate}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-1.5 shrink-0 ml-4 pl-4 border-l border-border/40">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-400 transition-colors">
                                        {auto.status === "Paused" ? <Play className="h-4 w-4" weight="fill" /> : <Square className="h-4 w-4" weight="fill" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <DotsThreeVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Warning for Failures */}
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <WarningCircle className="h-5 w-5 text-red-500 mt-0.5" weight="fill" />
                        <div>
                            <h4 className="text-sm font-bold text-red-500 uppercase tracking-tighter italic">Critical Automation Failure</h4>
                            <p className="text-xs text-red-500/70 mt-1 leading-relaxed font-bold tracking-tight italic">
                                The "Daily Report Sync" (AUT-004) failed to execute at 00:00 UTC. Google Drive authentication token expired. Re-authentication required in <span className="underline cursor-pointer">Integrations</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
