"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    MagnifyingGlass,
    FileText,
    Plus,
    ArrowSquareOut,
    CalendarBlank,
    Users,
    CheckCircle,
    Clock,
    WarningCircle,
    Buildings,
    Signature,
    DownloadSimple,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS } from "@/lib/data/brands"

type ContractStatus = "Active" | "Expired" | "Draft" | "Pending Signature" | "Review Required"
type ContractType = "Client Agreement" | "Freelancer NDA" | "Lease" | "Partnership" | "SOW"

type Contract = {
    id: string
    title: string
    type: ContractType
    party: string // The other entity (Client name, Freelancer name, etc.)
    effectiveDate: string
    expiryDate?: string
    brands: string[]
    status: ContractStatus
    value?: number
    lastUpdated: string
}

const STATUS_COLORS: Record<ContractStatus, { bg: string; text: string; dot: string }> = {
    Active: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500" },
    Expired: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-500" },
    Draft: { bg: "bg-muted/30", text: "text-muted-foreground", dot: "bg-muted-foreground" },
    "Pending Signature": { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-500" },
    "Review Required": { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-500" },
}

const MOCK_CONTRACTS: Contract[] = [
    { id: "CTR-001", title: "Master Services Agreement", type: "Client Agreement", party: "Merkato Restaurant", effectiveDate: "2025-01-15", expiryDate: "2026-01-15", brands: ["tirat", "berhan"], status: "Expired", value: 180000, lastUpdated: "2025-12-15" },
    { id: "CTR-002", title: "Monthly Retainer SOW", type: "SOW", party: "Merkato Restaurant", effectiveDate: "2026-02-01", expiryDate: "2027-02-01", brands: ["berhan"], status: "Active", value: 45000, lastUpdated: "2026-02-05" },
    { id: "CTR-003", title: "Hana Tadesse — NDA", type: "Freelancer NDA", party: "Hana Tadesse", effectiveDate: "2026-01-10", brands: ["debo", "tirat"], status: "Active", lastUpdated: "2026-01-10" },
    { id: "CTR-004", title: "Ethio Telecom Website Dev", type: "Client Agreement", party: "Ethio Telecom", effectiveDate: "2026-02-15", brands: ["debo"], status: "Pending Signature", value: 350000, lastUpdated: "2026-02-16" },
    { id: "CTR-005", title: "Office Lease — Addis Ababa", type: "Lease", party: "Zemen Real Estate", effectiveDate: "2024-03-01", expiryDate: "2026-03-01", brands: ["tirat", "debo", "berhan", "ethio-influencers", "ethiobot"], status: "Review Required", value: 120000, lastUpdated: "2026-01-20" },
    { id: "CTR-006", title: "Influencer Campaign SOW", type: "SOW", party: "Habesha Brewing", effectiveDate: "2026-02-10", expiryDate: "2026-04-10", brands: ["ethio-influencers"], status: "Active", value: 85000, lastUpdated: "2026-02-12" },
    { id: "CTR-007", title: "Dawit Mengistu — Contractor", type: "Freelancer NDA", party: "Dawit Mengistu", effectiveDate: "2025-11-20", brands: ["tirat"], status: "Active", lastUpdated: "2025-11-20" },
    { id: "CTR-008", title: "ManyChat Partnership", type: "Partnership", party: "ManyChat Inc.", effectiveDate: "2026-01-01", expiryDate: "2027-01-01", brands: ["ethiobot"], status: "Active", lastUpdated: "2026-01-01" },
    { id: "CTR-009", title: "Digital Transformation MSA", type: "Client Agreement", party: "Lucy Airlines", effectiveDate: "2026-01-20", brands: ["debo", "tirat", "berhan"], status: "Active", value: 450000, lastUpdated: "2026-02-01" },
    { id: "CTR-010", title: "New Client Proposal Template", type: "Draft", party: "Internal", effectiveDate: "2026-02-16", brands: ["tirat", "debo", "berhan"], status: "Draft", lastUpdated: "2026-02-16" },
]

export default function ContractsPage() {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<ContractStatus | "All">("All")
    const [brandFilter, setBrandFilter] = useState<string | null>(null)
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

    const filtered = useMemo(() => {
        return MOCK_CONTRACTS.filter(c => {
            if (statusFilter !== "All" && c.status !== statusFilter) return false
            if (brandFilter && !c.brands.includes(brandFilter)) return false
            if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.party.toLowerCase().includes(search.toLowerCase())) return false
            return true
        })
    }, [search, statusFilter, brandFilter])

    const totalValue = MOCK_CONTRACTS.filter(c => c.status === "Active" && c.value).reduce((s, c) => s + (c.value || 0), 0)

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1400px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Legal Contracts</h1>
                            <p className="text-sm text-muted-foreground mt-1">Repository of MSA, SOW, NDA, and Lease agreements across all brands.</p>
                        </div>
                        <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-3.5 w-3.5" />New Contract
                        </Button>
                    </div>

                    {/* Quick Metrics */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
                            <p className="text-xs text-muted-foreground">Total Active Value</p>
                            <p className="text-xl font-bold mt-1 text-emerald-400">{totalValue.toLocaleString()} ETB</p>
                        </div>
                        <div className="rounded-xl border border-blue-500/20 p-4 bg-blue-500/5">
                            <p className="text-xs text-muted-foreground">Pending Signature</p>
                            <p className="text-xl font-bold mt-1 text-blue-400">{MOCK_CONTRACTS.filter(c => c.status === "Pending Signature").length}</p>
                        </div>
                        <div className="rounded-xl border border-amber-500/20 p-4 bg-amber-500/5">
                            <p className="text-xs text-muted-foreground">Expired Documents</p>
                            <p className="text-xl font-bold mt-1 text-amber-500">{MOCK_CONTRACTS.filter(c => c.status === "Expired").length}</p>
                        </div>
                        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
                            <p className="text-xs text-muted-foreground">NDA Compliance</p>
                            <p className="text-xl font-bold mt-1">100%</p>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search contracts or parties..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-1.5">
                            {(["All", "Active", "Pending Signature", "Review Required", "Expired"] as const).map(s => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${statusFilter === s ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                            {BRANDS.map(b => (
                                <button key={b.id} onClick={() => setBrandFilter(brandFilter === b.id ? null : b.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${brandFilter === b.id ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    <span className={`h-2 w-2 rounded-full ${b.dotColor}`} />{b.shortName}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* List View */}
                    <div className="space-y-1.5">
                        {filtered.map(contract => {
                            const sc = STATUS_COLORS[contract.status]
                            return (
                                <div key={contract.id}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-accent/30 transition-all cursor-pointer group"
                                    onClick={() => setSelectedContract(contract)}>
                                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                        <FileText className="h-5 w-5 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold tracking-tight">{contract.title}</h3>
                                            <span className="text-xs text-muted-foreground">·</span>
                                            <span className="text-xs text-muted-foreground">{contract.party}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{contract.type}</span>
                                            <span className="h-1 w-1 rounded-full bg-border" />
                                            <div className="flex gap-0.5">
                                                {contract.brands.map(bId => {
                                                    const b = BRANDS.find(x => x.id === bId)
                                                    return b ? <span key={bId} className={`h-2 w-2 rounded-full ${b.dotColor}`} /> : null
                                                })}
                                            </div>
                                            {contract.value && (
                                                <>
                                                    <span className="h-1 w-1 rounded-full bg-border" />
                                                    <span className="text-xs font-semibold text-foreground/80">{contract.value.toLocaleString()} ETB</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border-0 shadow-sm ${sc.bg} ${sc.text}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                            {contract.status}
                                        </span>
                                        <p className="text-[10px] text-muted-foreground uppercase font-medium">Updated: {new Date(contract.lastUpdated + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Detail Sheet */}
                <Sheet open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
                    <SheetContent className="sm:max-w-md">
                        {selectedContract && (
                            <div className="space-y-6 mt-4">
                                <SheetHeader>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${STATUS_COLORS[selectedContract.status].bg} ${STATUS_COLORS[selectedContract.status].text}`}>
                                            {selectedContract.status}
                                        </span>
                                    </div>
                                    <SheetTitle className="text-xl font-bold">{selectedContract.title}</SheetTitle>
                                    <p className="text-sm text-muted-foreground">{selectedContract.party}</p>
                                </SheetHeader>

                                <div className="space-y-4">
                                    <div className="rounded-xl border border-border/40 p-4 space-y-3 bg-muted/20">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-muted-foreground">CONTRACT TYPE</span>
                                            <span className="font-bold">{selectedContract.type}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs border-t border-border/40 pt-3">
                                            <span className="text-muted-foreground">EFFECTIVE DATE</span>
                                            <span className="font-bold">{new Date(selectedContract.effectiveDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                                        </div>
                                        {selectedContract.expiryDate && (
                                            <div className="flex justify-between items-center text-xs border-t border-border/40 pt-3">
                                                <span className="text-muted-foreground">EXPIRY DATE</span>
                                                <span className={`font-bold ${selectedContract.status === "Expired" ? "text-red-400" : ""}`}>{new Date(selectedContract.expiryDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                                            </div>
                                        )}
                                        {selectedContract.value && (
                                            <div className="flex justify-between items-center text-xs border-t border-border/40 pt-3">
                                                <span className="text-muted-foreground">CONTRACT VALUE</span>
                                                <span className="font-bold text-lg">{selectedContract.value.toLocaleString()} ETB</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Associated Brands</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedContract.brands.map(bId => {
                                                const b = BRANDS.find(x => x.id === bId)
                                                return b ? (
                                                    <div key={bId} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${b.color} ${b.textColor}`}>
                                                        <span className={`h-2 w-2 rounded-full ${b.dotColor}`} />
                                                        <span className="text-xs font-medium">{b.name}</span>
                                                    </div>
                                                ) : null
                                            })}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl border border-border/40 space-y-3">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Document Status</h4>
                                        {selectedContract.status === "Pending Signature" ? (
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 text-amber-500 border border-amber-500/20">
                                                <Signature className="h-5 w-5" />
                                                <p className="text-xs font-medium">Awaiting Client Signature</p>
                                            </div>
                                        ) : selectedContract.status === "Review Required" ? (
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 text-blue-400 border border-blue-500/20">
                                                <Clock className="h-5 w-5" />
                                                <p className="text-xs font-medium">Under Legal Review</p>
                                            </div>
                                        ) : selectedContract.status === "Expired" ? (
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 text-red-400 border border-red-500/20">
                                                <WarningCircle className="h-5 w-5" />
                                                <p className="text-xs font-medium">Contract Terminated / Expired</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 text-emerald-400 border border-emerald-500/20">
                                                <CheckCircle className="h-5 w-5" />
                                                <p className="text-xs font-medium">Active and Compliant</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2">
                                        <DownloadSimple className="h-4 w-4" />
                                        Download PDF
                                    </Button>
                                    <Button variant="outline" className="flex-1">Send for Signature</Button>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </SidebarInset>
        </SidebarProvider>
    )
}
