"use client"

import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import {
    ArrowUp,
    ArrowDown,
    Folder,
    Users,
    TrendUp,
    Lightning,
    CalendarBlank,
    ChartBar,
    CurrencyEth,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS, BRAND_MAP, type BrandId } from "@/lib/data/brands"

const stats = [
    { label: "Active Projects", value: "14", change: "+4", up: true, icon: Folder },
    { label: "Pipeline Value", value: "387K", change: "+62K", up: true, icon: CurrencyEth, suffix: " ETB" },
    { label: "Content This Month", value: "127", change: "+23", up: true, icon: CalendarBlank, suffix: " posts" },
    { label: "Freelancer Pool", value: "32", change: "+3", up: true, icon: Users, suffix: " active" },
]

const brandRevenue: { brand: BrandId; revenue: string; projects: number; change: string; up: boolean }[] = [
    { brand: "berhan", revenue: "142,000", projects: 4, change: "+18%", up: true },
    { brand: "tirat", revenue: "98,000", projects: 3, change: "+12%", up: true },
    { brand: "debo", revenue: "215,000", projects: 4, change: "+25%", up: true },
    { brand: "ethio-influencers", revenue: "67,000", projects: 2, change: "-5%", up: false },
    { brand: "ethiobot", revenue: "45,000", projects: 1, change: "+8%", up: true },
]

const recentActivity = [
    { action: "New lead added", detail: "Ethio Telecom — Brand Campaign", time: "2m ago", brand: "berhan" as BrandId },
    { action: "Invoice sent", detail: "#INV-0042 — Dashen Bank (45,000 ETB)", time: "15m ago", brand: "tirat" as BrandId },
    { action: "QA approved", detail: "Logo concepts — Anbessa Shoe", time: "1h ago", brand: "tirat" as BrandId },
    { action: "Freelancer assigned", detail: "Selam H. → Ethiopian Airlines website", time: "2h ago", brand: "debo" as BrandId },
    { action: "Campaign launched", detail: "Valentine's Day — 3 influencers", time: "3h ago", brand: "ethio-influencers" as BrandId },
    { action: "Project kicked off", detail: "Ride Ethiopia — Chatbot Setup", time: "4h ago", brand: "ethiobot" as BrandId },
    { action: "Content scheduled", detail: "12 posts queued for next week", time: "5h ago", brand: "berhan" as BrandId },
    { action: "Payout processed", detail: "Abebe M. — 8,500 ETB via Telebirr", time: "6h ago", brand: "debo" as BrandId },
]

const quickActions = [
    { label: "New Lead", icon: Lightning, href: "/pipeline" },
    { label: "Kickoff Project", icon: Folder, href: "/projects" },
    { label: "Schedule Post", icon: CalendarBlank, href: "/content" },
    { label: "View Reports", icon: ChartBar, href: "/performance" },
]

export default function DashboardPage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between border-b border-border/40 px-8 py-5">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">Welcome back — here&apos;s the Hidden Empire at a glance.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-medium">
                                Haz — The Architect
                            </span>
                        </div>
                    </header>

                    <div className="flex-1 overflow-auto p-8 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat) => {
                                const Icon = stat.icon
                                return (
                                    <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-5 space-y-3 hover:shadow-sm transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                                            <Icon className="h-4 w-4 text-muted-foreground/60" />
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                                            <span className={`flex items-center gap-0.5 text-xs font-medium mb-0.5 ${stat.up ? "text-emerald-500" : "text-red-400"}`}>
                                                {stat.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                                {stat.change}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Brand Revenue Cards */}
                        <div>
                            <h2 className="text-sm font-semibold mb-3">Revenue by Brand</h2>
                            <div className="grid grid-cols-5 gap-3">
                                {brandRevenue.map((br) => {
                                    const brand = BRAND_MAP[br.brand]
                                    return (
                                        <Link href="/performance" key={br.brand} className="rounded-xl border border-border/60 bg-card p-4 hover:shadow-md hover:border-border transition-all cursor-pointer">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`h-2.5 w-2.5 rounded-full ${brand.dotColor}`} />
                                                <span className="text-[11px] font-semibold text-muted-foreground truncate">{brand.shortName}</span>
                                            </div>
                                            <p className="text-lg font-bold tracking-tight">{br.revenue} <span className="text-xs font-normal text-muted-foreground">ETB</span></p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-muted-foreground">{br.projects} projects</span>
                                                <span className={`text-[10px] font-medium ${br.up ? "text-emerald-500" : "text-red-400"}`}>{br.change}</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Activity */}
                            <div className="lg:col-span-2 rounded-xl border border-border/60 bg-card">
                                <div className="px-5 py-4 border-b border-border/40">
                                    <h2 className="text-sm font-semibold">Recent Activity</h2>
                                </div>
                                <div className="divide-y divide-border/30">
                                    {recentActivity.map((item, i) => {
                                        const brand = BRAND_MAP[item.brand]
                                        return (
                                            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                                                <span className={`h-2 w-2 rounded-full shrink-0 ${brand.dotColor}`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{item.action}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                                                </div>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Quick Actions + Performance */}
                            <div className="rounded-xl border border-border/60 bg-card">
                                <div className="px-5 py-4 border-b border-border/40">
                                    <h2 className="text-sm font-semibold">Quick Actions</h2>
                                </div>
                                <div className="p-4 grid grid-cols-2 gap-3">
                                    {quickActions.map((action) => {
                                        const ActionIcon = action.icon
                                        return (
                                            <Link
                                                key={action.label}
                                                href={action.href}
                                                className="flex flex-col items-center gap-2 rounded-xl border border-border/40 bg-muted/20 p-4 hover:bg-muted/50 hover:border-border transition-all text-center group"
                                            >
                                                <ActionIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
                                            </Link>
                                        )
                                    })}
                                </div>

                                <div className="px-5 py-4 border-t border-border/40">
                                    <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Empire Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Total Revenue (Feb)</span>
                                            <span className="font-semibold flex items-center gap-1">567,000 ETB <TrendUp className="h-3 w-3 text-emerald-500" /></span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Avg Profit Margin</span>
                                            <span className="font-semibold text-emerald-500">52%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Client Satisfaction</span>
                                            <span className="font-semibold text-emerald-500">96%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Content published</span>
                                            <span className="font-semibold">127 posts</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
