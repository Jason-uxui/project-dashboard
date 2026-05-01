"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
    BuildingOffice,
    CheckCircle,
    Circle,
    Clock,
    CalendarBlank,
    WarningCircle,
    FileText,
    Export,
    CurrencyDollar,
    Receipt,
} from "@phosphor-icons/react/dist/ssr"

type TaxItem = {
    id: string
    title: string
    description: string
    category: "VAT" | "Income Tax" | "Filing" | "Compliance"
    dueDate: string
    status: "Completed" | "Pending" | "Overdue" | "Upcoming"
    amount?: number
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    Completed: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
    Pending: { bg: "bg-amber-500/10", text: "text-amber-400" },
    Overdue: { bg: "bg-red-500/10", text: "text-red-400" },
    Upcoming: { bg: "bg-blue-500/10", text: "text-blue-400" },
}

const MOCK_TAX_ITEMS: TaxItem[] = [
    { id: "TX-001", title: "January VAT Filing", description: "Monthly VAT declaration and payment to ERCA", category: "VAT", dueDate: "2026-02-15", status: "Completed", amount: 45000 },
    { id: "TX-002", title: "January Payroll Tax", description: "Employee payroll tax withholding submission", category: "Income Tax", dueDate: "2026-02-10", status: "Completed", amount: 12500 },
    { id: "TX-003", title: "February VAT Filing", description: "Monthly VAT declaration and payment to ERCA", category: "VAT", dueDate: "2026-03-15", status: "Pending", amount: 52000 },
    { id: "TX-004", title: "Quarterly Profit Tax Filing", description: "Q1 2026 estimated profit tax payment", category: "Income Tax", dueDate: "2026-03-31", status: "Upcoming", amount: 85000 },
    { id: "TX-005", title: "Annual Business License Renewal", description: "Caravan Digital Pvt. Ltd. Co. business license renewal at Addis Ababa Trade Bureau", category: "Compliance", dueDate: "2026-06-30", status: "Upcoming", amount: 5000 },
    { id: "TX-006", title: "February Payroll Tax", description: "Employee payroll tax withholding submission", category: "Income Tax", dueDate: "2026-03-10", status: "Upcoming", amount: 13200 },
    { id: "TX-007", title: "TIN Certificate Renewal", description: "Taxpayer Identification Number annual renewal with ERCA", category: "Compliance", dueDate: "2026-01-31", status: "Completed" },
    { id: "TX-008", title: "VAT Withholding Report — Dec", description: "December VAT withholdings reconciliation and report", category: "VAT", dueDate: "2026-01-20", status: "Completed", amount: 38000 },
    { id: "TX-009", title: "Annual Financial Audit", description: "External audit by certified auditor — required for businesses with revenue >1M ETB", category: "Compliance", dueDate: "2026-07-31", status: "Upcoming" },
    { id: "TX-010", title: "Bank Statement Reconciliation — Jan", description: "Match all bank transactions with ERP records for January", category: "Filing", dueDate: "2026-02-05", status: "Completed" },
]

const REFERENCE_DOCS = [
    { label: "TIN Certificate", value: "TIN-1234567890", status: "Active" },
    { label: "VAT Registration", value: "VAT-ET-2024-00891", status: "Active" },
    { label: "Business Registration", value: "BRN-AA-2023-05544", status: "Active" },
    { label: "Trade License", value: "TL-AA-2025-22189", status: "Expires June 2026" },
]

export default function TaxPage() {
    const [items, setItems] = useState(MOCK_TAX_ITEMS)
    const [categoryFilter, setCategoryFilter] = useState<string>("All")

    const filtered = categoryFilter === "All" ? items : items.filter(i => i.category === categoryFilter)
    const sortedItems = filtered.sort((a, b) => {
        const order: Record<string, number> = { Overdue: 0, Pending: 1, Upcoming: 2, Completed: 3 }
        return order[a.status] - order[b.status]
    })

    const toggleStatus = (id: string) => {
        setItems(prev => prev.map(item => {
            if (item.id !== id) return item
            return { ...item, status: item.status === "Completed" ? "Pending" : "Completed" }
        }))
    }

    const vatOwed = items.filter(i => i.category === "VAT" && i.status !== "Completed").reduce((s, i) => s + (i.amount || 0), 0)
    const totalPaid = items.filter(i => i.status === "Completed").reduce((s, i) => s + (i.amount || 0), 0)
    const upcomingCount = items.filter(i => i.status === "Upcoming" || i.status === "Pending").length

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1200px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Tax & Compliance</h1>
                            <p className="text-sm text-muted-foreground mt-1">VAT records, tax filings, compliance deadlines, and audit trail.</p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1.5"><Export className="h-3.5 w-3.5" />Export Report</Button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="rounded-xl border border-amber-500/20 p-4 bg-amber-500/5">
                            <p className="text-xs text-muted-foreground">VAT Owed</p>
                            <p className="text-xl font-bold text-amber-400 mt-1">{vatOwed.toLocaleString()} ETB</p>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 p-4 bg-emerald-500/5">
                            <p className="text-xs text-muted-foreground">Taxes Paid (FY)</p>
                            <p className="text-xl font-bold text-emerald-400 mt-1">{totalPaid.toLocaleString()} ETB</p>
                        </div>
                        <div className="rounded-xl border border-blue-500/20 p-4 bg-blue-500/5">
                            <p className="text-xs text-muted-foreground">Upcoming Deadlines</p>
                            <p className="text-xl font-bold text-blue-400 mt-1">{upcomingCount}</p>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 p-4 bg-emerald-500/5">
                            <p className="text-xs text-muted-foreground">Compliance Status</p>
                            <p className="text-xl font-bold text-emerald-400 mt-1">✓ Current</p>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex items-center gap-1.5">
                        {["All", "VAT", "Income Tax", "Filing", "Compliance"].map(c => (
                            <button key={c} onClick={() => setCategoryFilter(c)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${categoryFilter === c ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* Tax Checklist */}
                    <div className="space-y-1.5">
                        {sortedItems.map(item => {
                            const sc = STATUS_COLORS[item.status]
                            const dueDate = new Date(item.dueDate + "T00:00:00")
                            const isCompleted = item.status === "Completed"
                            return (
                                <div key={item.id}
                                    className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${isCompleted ? "border-border/30 opacity-60" : "border-border/50 hover:bg-accent/30"}`}>
                                    <button onClick={() => toggleStatus(item.id)} className="mt-0.5 shrink-0">
                                        {isCompleted ? <CheckCircle className="h-5 w-5 text-emerald-400" weight="fill" /> : <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />}
                                    </button>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>{item.title}</span>
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>{item.status}</span>
                                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">{item.category}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><CalendarBlank className="h-3 w-3" />{dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                            {item.amount && <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><CurrencyDollar className="h-3 w-3" />{item.amount.toLocaleString()} ETB</span>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Reference Documents */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Reference Documents</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {REFERENCE_DOCS.map(doc => (
                                <div key={doc.label} className="rounded-xl border border-border/50 p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">{doc.label}</p>
                                        <p className="text-sm font-mono font-medium mt-1">{doc.value}</p>
                                    </div>
                                    <span className={`text-[10px] font-medium ${doc.status === "Active" ? "text-emerald-400" : "text-amber-400"}`}>{doc.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
