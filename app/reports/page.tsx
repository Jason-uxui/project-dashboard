"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
    ChartPieSlice,
    TrendUp,
    TrendDown,
    CurrencyDollar,
    Users,
    FolderOpen,
    Export,
    CalendarBlank,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS } from "@/lib/data/brands"

type ReportType = "pnl" | "revenue-brand" | "revenue-service" | "margins" | "cashflow" | "ltv" | "freelancer-econ" | "receivables"

const REPORTS: { id: ReportType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "pnl", label: "Profit & Loss", description: "Revenue minus all costs, by month", icon: ChartPieSlice },
    { id: "revenue-brand", label: "Revenue by Brand", description: "Which brands earn what", icon: TrendUp },
    { id: "revenue-service", label: "Revenue by Service", description: "Which services earn the most", icon: CurrencyDollar },
    { id: "margins", label: "Project Margins", description: "Actual margin per completed project", icon: TrendDown },
    { id: "cashflow", label: "Cash Flow Forecast", description: "Expected in/out next 30/60/90 days", icon: CalendarBlank },
    { id: "ltv", label: "Client Lifetime Value", description: "Total revenue per client, all brands", icon: Users },
    { id: "freelancer-econ", label: "Freelancer Economics", description: "Cost distribution across talent pool", icon: Users },
    { id: "receivables", label: "Outstanding Receivables", description: "Unpaid invoices, aging buckets", icon: CurrencyDollar },
]

const BRAND_REVENUE = [
    { brand: "berhan", revenue: 485000, growth: 12 },
    { brand: "tirat", revenue: 368000, growth: 8 },
    { brand: "debo", revenue: 520000, growth: 22 },
    { brand: "ethio-influencers", revenue: 195000, growth: -3 },
    { brand: "ethiobot", revenue: 142000, growth: 45 },
]

const MONTHLY_PNL = [
    { month: "Sep", revenue: 280000, costs: 145000 },
    { month: "Oct", revenue: 310000, costs: 158000 },
    { month: "Nov", revenue: 345000, costs: 172000 },
    { month: "Dec", revenue: 295000, costs: 162000 },
    { month: "Jan", revenue: 380000, costs: 185000 },
    { month: "Feb", revenue: 400000, costs: 192000 },
]

export default function ReportsPage() {
    const [activeReport, setActiveReport] = useState<ReportType>("pnl")
    const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly")

    const totalRevenue = BRAND_REVENUE.reduce((s, b) => s + b.revenue, 0)
    const maxRevenue = Math.max(...BRAND_REVENUE.map(b => b.revenue))
    const maxMonthly = Math.max(...MONTHLY_PNL.map(m => m.revenue))

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1400px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Financial Reports</h1>
                            <p className="text-sm text-muted-foreground mt-1">Revenue intelligence, margins, and financial dashboards.</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5">
                                {(["monthly", "quarterly", "yearly"] as const).map(p => (
                                    <button key={p} onClick={() => setPeriod(p)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${period === p ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{p}</button>
                                ))}
                            </div>
                            <Button variant="outline" size="sm" className="gap-1.5"><Export className="h-3.5 w-3.5" />Export</Button>
                        </div>
                    </div>

                    {/* Report Type Selector */}
                    <div className="grid grid-cols-4 gap-2">
                        {REPORTS.map(r => {
                            const Icon = r.icon
                            return (
                                <button key={r.id} onClick={() => setActiveReport(r.id)}
                                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${activeReport === r.id ? "bg-accent/50 border-foreground/20" : "border-border/50 hover:bg-accent/30"}`}>
                                    <Icon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium">{r.label}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{r.description}</p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="rounded-xl border border-emerald-500/20 p-4 bg-emerald-500/5">
                            <p className="text-xs text-muted-foreground">Total Revenue (FY)</p>
                            <p className="text-2xl font-bold text-emerald-400 mt-1">{totalRevenue.toLocaleString()} ETB</p>
                            <p className="text-xs text-emerald-400 mt-1">↑ 18% vs last year</p>
                        </div>
                        <div className="rounded-xl border border-blue-500/20 p-4 bg-blue-500/5">
                            <p className="text-xs text-muted-foreground">Avg Project Margin</p>
                            <p className="text-2xl font-bold text-blue-400 mt-1">47%</p>
                            <p className="text-xs text-blue-400 mt-1">↑ 3% vs last quarter</p>
                        </div>
                        <div className="rounded-xl border border-amber-500/20 p-4 bg-amber-500/5">
                            <p className="text-xs text-muted-foreground">Outstanding Receivables</p>
                            <p className="text-2xl font-bold text-amber-400 mt-1">215,000 ETB</p>
                            <p className="text-xs text-red-400 mt-1">72,500 ETB overdue</p>
                        </div>
                        <div className="rounded-xl border border-purple-500/20 p-4 bg-purple-500/5">
                            <p className="text-xs text-muted-foreground">Freelancer Costs</p>
                            <p className="text-2xl font-bold text-purple-400 mt-1">814,000 ETB</p>
                            <p className="text-xs text-muted-foreground mt-1">48% of revenue</p>
                        </div>
                    </div>

                    {/* Report Content */}
                    {activeReport === "pnl" && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Monthly Profit & Loss</h3>
                            <div className="rounded-xl border border-border/60 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border/60 bg-muted/30">
                                            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Month</th>
                                            <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Revenue</th>
                                            <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Costs</th>
                                            <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Profit</th>
                                            <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Margin</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground w-[200px]">Visual</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MONTHLY_PNL.map(m => {
                                            const profit = m.revenue - m.costs
                                            const margin = Math.round((profit / m.revenue) * 100)
                                            return (
                                                <tr key={m.month} className="border-b border-border/30 hover:bg-accent/30">
                                                    <td className="px-4 py-3 font-medium">{m.month} 2026</td>
                                                    <td className="px-4 py-3 text-right text-emerald-400">{m.revenue.toLocaleString()} ETB</td>
                                                    <td className="px-4 py-3 text-right text-red-400">{m.costs.toLocaleString()} ETB</td>
                                                    <td className="px-4 py-3 text-right font-semibold">{profit.toLocaleString()} ETB</td>
                                                    <td className="px-4 py-3 text-right"><span className={`${margin >= 45 ? "text-emerald-400" : margin >= 35 ? "text-amber-400" : "text-red-400"}`}>{margin}%</span></td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1 h-4">
                                                            <div className="bg-emerald-500/30 rounded-full h-3" style={{ width: `${(m.revenue / maxMonthly) * 100}%` }} />
                                                            <div className="bg-red-500/30 rounded-full h-3" style={{ width: `${(m.costs / maxMonthly) * 100}%` }} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeReport === "revenue-brand" && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Revenue by Brand</h3>
                            <div className="space-y-3">
                                {BRAND_REVENUE.sort((a, b) => b.revenue - a.revenue).map(br => {
                                    const brand = BRANDS.find(b => b.id === br.brand)
                                    if (!brand) return null
                                    const pct = Math.round((br.revenue / totalRevenue) * 100)
                                    return (
                                        <div key={br.brand} className="rounded-xl border border-border/50 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-3 w-3 rounded-full ${brand.dotColor}`} />
                                                    <span className="text-sm font-medium">{brand.name}</span>
                                                    <span className="text-xs text-muted-foreground">({pct}%)</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs font-medium ${br.growth >= 0 ? "text-emerald-400" : "text-red-400"}`}>{br.growth >= 0 ? "↑" : "↓"} {Math.abs(br.growth)}%</span>
                                                    <span className="text-sm font-bold">{br.revenue.toLocaleString()} ETB</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-muted/30 rounded-full h-2.5">
                                                <div className={`h-2.5 rounded-full ${brand.dotColor}`} style={{ width: `${(br.revenue / maxRevenue) * 100}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {activeReport !== "pnl" && activeReport !== "revenue-brand" && (
                        <div className="rounded-xl border border-border/60 p-12 flex flex-col items-center justify-center text-center">
                            <ChartPieSlice className="h-12 w-12 text-muted-foreground/30 mb-4" />
                            <h3 className="text-sm font-semibold">{REPORTS.find(r => r.id === activeReport)?.label}</h3>
                            <p className="text-xs text-muted-foreground mt-1 max-w-sm">{REPORTS.find(r => r.id === activeReport)?.description}. Select this report type to view detailed analytics.</p>
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
