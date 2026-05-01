"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    MagnifyingGlass,
    Wallet,
    CheckCircle,
    Clock,
    WarningCircle,
    CurrencyDollar,
    Receipt,
    Export,
    CaretUpDown,
    User,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS } from "@/lib/data/brands"

type PayoutStatus = "Pending" | "Processing" | "Paid" | "Overdue"

type Payout = {
    id: string
    freelancer: string
    project: string
    deliverable: string
    brand: string
    amount: number
    method: string
    dueDate: string
    status: PayoutStatus
    tier: string
}

const STATUS_CONFIG: Record<PayoutStatus, { color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
    Pending: { color: "text-amber-400", bg: "bg-amber-500/10", icon: Clock },
    Processing: { color: "text-blue-400", bg: "bg-blue-500/10", icon: CaretUpDown },
    Paid: { color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle },
    Overdue: { color: "text-red-400", bg: "bg-red-500/10", icon: WarningCircle },
}

const MOCK_PAYOUTS: Payout[] = [
    { id: "PO-001", freelancer: "Dawit Mengistu", project: "Merkato Restaurant Rebrand", deliverable: "Logo Design (3 concepts)", brand: "tirat", amount: 8000, method: "Telebirr", dueDate: "2026-02-10", status: "Overdue", tier: "Gold" },
    { id: "PO-002", freelancer: "Hana Tadesse", project: "Addis Pharma Website", deliverable: "Homepage Development", brand: "debo", amount: 12000, method: "CBE Birr", dueDate: "2026-02-14", status: "Overdue", tier: "Platinum" },
    { id: "PO-003", freelancer: "Yonas Bekele", project: "Habesha Brewing Campaign", deliverable: "Social Media Kit (15 posts)", brand: "berhan", amount: 6000, method: "Bank Transfer", dueDate: "2026-02-17", status: "Pending", tier: "Silver" },
    { id: "PO-004", freelancer: "Sara Tesfaye", project: "Merkato Restaurant Rebrand", deliverable: "Brand Guidelines PDF", brand: "tirat", amount: 6000, method: "Telebirr", dueDate: "2026-02-17", status: "Pending", tier: "Gold" },
    { id: "PO-005", freelancer: "Abel Girma", project: "EthioShop MVP", deliverable: "Payment Integration", brand: "debo", amount: 15000, method: "CBE Birr", dueDate: "2026-02-18", status: "Pending", tier: "Platinum" },
    { id: "PO-006", freelancer: "Meron Alemu", project: "Valentine's Influencer Push", deliverable: "Campaign Video Edits (5)", brand: "ethio-influencers", amount: 5000, method: "Telebirr", dueDate: "2026-02-19", status: "Pending", tier: "Silver" },
    { id: "PO-007", freelancer: "Dawit Mengistu", project: "Merkato Restaurant Rebrand", deliverable: "Business Card Design", brand: "tirat", amount: 3000, method: "Telebirr", dueDate: "2026-02-20", status: "Pending", tier: "Gold" },
    { id: "PO-008", freelancer: "Kidist Haile", project: "Addis Restaurant Chatbot", deliverable: "ManyChat Flow Setup", brand: "ethiobot", amount: 4500, method: "Bank Transfer", dueDate: "2026-02-20", status: "Pending", tier: "Silver" },
    { id: "PO-009", freelancer: "Yonas Bekele", project: "Berhan Monthly Content", deliverable: "February Content Pack", brand: "berhan", amount: 4000, method: "Bank Transfer", dueDate: "2026-02-15", status: "Processing", tier: "Silver" },
    { id: "PO-010", freelancer: "Hana Tadesse", project: "Tirat Portfolio Site", deliverable: "Full Site Development", brand: "tirat", amount: 18000, method: "CBE Birr", dueDate: "2026-02-01", status: "Paid", tier: "Platinum" },
    { id: "PO-011", freelancer: "Sara Tesfaye", project: "Debo Brand Identity", deliverable: "Logo + Colors + Type", brand: "debo", amount: 10000, method: "Telebirr", dueDate: "2026-02-03", status: "Paid", tier: "Gold" },
    { id: "PO-012", freelancer: "Abel Girma", project: "EthioBot Landing Page", deliverable: "Landing Page Dev", brand: "ethiobot", amount: 8000, method: "CBE Birr", dueDate: "2026-02-05", status: "Paid", tier: "Platinum" },
]

export default function PayoutsPage() {
    const [payouts, setPayouts] = useState(MOCK_PAYOUTS)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<PayoutStatus | "All">("All")
    const [brandFilter, setBrandFilter] = useState<string | null>(null)
    const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    const filtered = useMemo(() => {
        return payouts.filter(p => {
            if (statusFilter !== "All" && p.status !== statusFilter) return false
            if (brandFilter && p.brand !== brandFilter) return false
            if (search && !p.freelancer.toLowerCase().includes(search.toLowerCase()) && !p.project.toLowerCase().includes(search.toLowerCase())) return false
            return true
        }).sort((a, b) => {
            const order: Record<PayoutStatus, number> = { Overdue: 0, Pending: 1, Processing: 2, Paid: 3 }
            return order[a.status] - order[b.status]
        })
    }, [payouts, search, statusFilter, brandFilter])

    const toggleSelect = (id: string) => setSelectedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
    const selectAllPending = () => setSelectedIds(new Set(filtered.filter(p => p.status === "Pending" || p.status === "Overdue").map(p => p.id)))

    const markSelectedPaid = () => {
        setPayouts(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, status: "Paid" as PayoutStatus } : p))
        setSelectedIds(new Set())
    }

    const stats = useMemo(() => ({
        pending: payouts.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0),
        overdue: payouts.filter(p => p.status === "Overdue").reduce((s, p) => s + p.amount, 0),
        processing: payouts.filter(p => p.status === "Processing").reduce((s, p) => s + p.amount, 0),
        paid: payouts.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0),
    }), [payouts])

    const TIER_COLORS: Record<string, string> = { Platinum: "text-cyan-400", Gold: "text-amber-400", Silver: "text-slate-400", Bronze: "text-orange-400" }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1400px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Freelancer Payouts</h1>
                            <p className="text-sm text-muted-foreground mt-1">Manage freelancer payments, batch processing, and receipts.</p>
                        </div>
                        <div className="flex gap-2">
                            {selectedIds.size > 0 && (
                                <Button size="sm" onClick={markSelectedPaid} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                                    <CheckCircle className="h-3.5 w-3.5" />Mark {selectedIds.size} as Paid
                                </Button>
                            )}
                            <Button variant="outline" size="sm" className="gap-1.5"><Export className="h-3.5 w-3.5" />Export</Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: "Pending", value: stats.pending, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                            { label: "Overdue", value: stats.overdue, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
                            { label: "Processing", value: stats.processing, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                            { label: "Paid This Month", value: stats.paid, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                        ].map(s => (
                            <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
                                <p className="text-xs text-muted-foreground">{s.label}</p>
                                <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value.toLocaleString()} ETB</p>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search freelancer or project..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-1.5">
                            {(["All", "Pending", "Overdue", "Processing", "Paid"] as const).map(s => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${statusFilter === s ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setBrandFilter(null)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${!brandFilter ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                All Brands
                            </button>
                            {BRANDS.map(b => (
                                <button key={b.id} onClick={() => setBrandFilter(b.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${brandFilter === b.id ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    <span className={`h-2 w-2 rounded-full ${b.dotColor}`} />{b.shortName}
                                </button>
                            ))}
                        </div>
                        <button onClick={selectAllPending} className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Select All Pending
                        </button>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-border/60 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/60 bg-muted/30">
                                    <th className="w-10 px-3 py-2.5"><input type="checkbox" className="rounded" /></th>
                                    <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Freelancer</th>
                                    <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Project / Deliverable</th>
                                    <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Brand</th>
                                    <th className="text-right px-3 py-2.5 text-xs font-medium text-muted-foreground">Amount</th>
                                    <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Method</th>
                                    <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Due</th>
                                    <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(payout => {
                                    const cfg = STATUS_CONFIG[payout.status]
                                    const StatusIcon = cfg.icon
                                    const brand = BRANDS.find(b => b.id === payout.brand)
                                    const isSelected = selectedIds.has(payout.id)
                                    const dueDate = new Date(payout.dueDate + "T00:00:00")
                                    const isOverdue = payout.status === "Overdue"
                                    return (
                                        <tr key={payout.id} onClick={() => setSelectedPayout(payout)}
                                            className={`border-b border-border/30 cursor-pointer transition-colors ${isSelected ? "bg-blue-500/5" : "hover:bg-accent/50"} ${isOverdue ? "bg-red-500/3" : ""}`}>
                                            <td className="px-3 py-2.5" onClick={e => { e.stopPropagation(); toggleSelect(payout.id) }}>
                                                <input type="checkbox" checked={isSelected} readOnly className="rounded" />
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{payout.freelancer}</p>
                                                        <p className={`text-[10px] ${TIER_COLORS[payout.tier] || "text-muted-foreground"}`}>● {payout.tier}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <p className="text-sm">{payout.project}</p>
                                                <p className="text-xs text-muted-foreground">{payout.deliverable}</p>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                {brand && <span className={`inline-flex items-center gap-1.5 text-xs ${brand.textColor}`}><span className={`h-2 w-2 rounded-full ${brand.dotColor}`} />{brand.shortName}</span>}
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-semibold">{payout.amount.toLocaleString()} ETB</td>
                                            <td className="px-3 py-2.5 text-xs text-muted-foreground">{payout.method}</td>
                                            <td className={`px-3 py-2.5 text-xs ${isOverdue ? "text-red-400 font-medium" : "text-muted-foreground"}`}>
                                                {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
                                                    <StatusIcon className="h-3 w-3" />{payout.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detail Sheet */}
                <Sheet open={!!selectedPayout} onOpenChange={() => setSelectedPayout(null)}>
                    <SheetContent className="sm:max-w-md">
                        {selectedPayout && (() => {
                            const cfg = STATUS_CONFIG[selectedPayout.status]
                            const brand = BRANDS.find(b => b.id === selectedPayout.brand)
                            return (
                                <>
                                    <SheetHeader>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>{selectedPayout.status}</span>
                                            {brand && <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${brand.color} ${brand.textColor}`}>{brand.shortName}</span>}
                                        </div>
                                        <SheetTitle>{selectedPayout.freelancer}</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        <div className="rounded-lg border border-border/60 p-4 space-y-3">
                                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Payout ID</span><span className="font-mono">{selectedPayout.id}</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount</span><span className="font-bold text-lg">{selectedPayout.amount.toLocaleString()} ETB</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Method</span><span>{selectedPayout.method}</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Due Date</span><span>{new Date(selectedPayout.dueDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tier</span><span className={TIER_COLORS[selectedPayout.tier]}>● {selectedPayout.tier}</span></div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Work Details</h4>
                                            <p className="text-sm font-medium">{selectedPayout.project}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{selectedPayout.deliverable}</p>
                                        </div>
                                        {(selectedPayout.status === "Pending" || selectedPayout.status === "Overdue") && (
                                            <div className="flex gap-2">
                                                <Button size="sm" className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                                                    onClick={() => { setPayouts(prev => prev.map(p => p.id === selectedPayout.id ? { ...p, status: "Paid" as PayoutStatus } : p)); setSelectedPayout(null) }}>
                                                    <CheckCircle className="h-3.5 w-3.5" />Mark as Paid
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1 gap-1.5"><Receipt className="h-3.5 w-3.5" />Attach Receipt</Button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )
                        })()}
                    </SheetContent>
                </Sheet>
            </SidebarInset>
        </SidebarProvider>
    )
}
