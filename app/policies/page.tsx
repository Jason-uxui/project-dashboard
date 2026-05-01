"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    MagnifyingGlass,
    ShieldCheck,
    Plus,
    ArrowSquareOut,
    CalendarBlank,
    Buildings,
    WarningCircle,
    CheckCircle,
    Eye,
    FileText,
    LockKey,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS } from "@/lib/data/brands"

type PolicyCategory = "Privacy" | "Security" | "HR" | "Internal" | "Client"

type Policy = {
    id: string
    title: string
    category: PolicyCategory
    status: "Active" | "Draft" | "Review Required" | "Archived"
    version: string
    lastReview: string
    nextReview: string
    brands: string[]
    description: string
}

const CATEGORY_COLORS: Record<PolicyCategory, string> = {
    Privacy: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Security: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    HR: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Internal: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Client: "bg-red-500/10 text-red-400 border-red-500/20",
}

const MOCK_POLICIES: Policy[] = [
    { id: "POL-001", title: "Data Privacy Policy", category: "Privacy", status: "Active", version: "2.1", lastReview: "2026-01-15", nextReview: "2027-01-15", brands: ["tirat", "debo", "berhan", "ethio-influencers", "ethiobot"], description: "Global data handling and privacy protocol for all Caravan Digital brands and clients." },
    { id: "POL-002", title: "Information Security Policy", category: "Security", status: "Active", version: "1.8", lastReview: "2025-11-20", nextReview: "2026-11-20", brands: ["tirat", "debo", "berhan"], description: "Guidelines for password management, device security, and network access." },
    { id: "POL-003", title: "Freelancer Code of Conduct", category: "HR", status: "Active", version: "3.2", lastReview: "2026-02-01", nextReview: "2027-02-01", brands: ["tirat", "debo", "berhan", "ethio-influencers", "ethiobot"], description: "Professional standards and communication protocols for all registered freelancers." },
    { id: "POL-004", title: "Remote Work Policy", category: "Internal", status: "Active", version: "1.5", lastReview: "2025-09-10", nextReview: "2026-03-10", brands: ["tirat", "debo", "berhan"], description: "Expectations for remote teams, core hours, and digital presence." },
    { id: "POL-005", title: "Social Media Guidelines", category: "Client", status: "Review Required", version: "2.0", lastReview: "2025-05-15", nextReview: "2026-05-15", brands: ["berhan", "ethio-influencers"], description: "Standard operating procedures for managing client social media accounts." },
    { id: "POL-006", title: "AI Usage & Ethics", category: "Internal", status: "Active", version: "1.0", lastReview: "2026-02-14", nextReview: "2026-08-14", brands: ["ethiobot", "debo", "berhan"], description: "Protocols for using LLMs and generative AI in client deliverables and internal ops." },
    { id: "POL-007", title: "Expense Reimbursement", category: "HR", status: "Active", version: "1.2", lastReview: "2025-12-05", nextReview: "2026-12-05", brands: ["tirat", "debo", "berhan"], description: "Step-by-step guide for submitting and approving business expenses." },
    { id: "POL-008", title: "Incident Response Plan", category: "Security", status: "Draft", version: "0.9", lastReview: "2026-02-16", nextReview: "2026-08-16", brands: ["debo", "ethiobot"], description: "Procedure for handling security breaches or service disruptions." },
]

export default function PoliciesPage() {
    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<PolicyCategory | "All">("All")
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)

    const filtered = useMemo(() => {
        return MOCK_POLICIES.filter(p => {
            if (categoryFilter !== "All" && p.category !== categoryFilter) return false
            if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
            return true
        })
    }, [search, categoryFilter])

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1400px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Policies & Compliance</h1>
                            <p className="text-sm text-muted-foreground mt-1">Foundational policies, versioned standards, and compliance protocols.</p>
                        </div>
                        <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-3.5 w-3.5" />New Policy
                        </Button>
                    </div>

                    {/* Quick Metrics */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
                            <p className="text-xs text-muted-foreground">Total Policies</p>
                            <p className="text-xl font-bold mt-1">{MOCK_POLICIES.length}</p>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 p-4 bg-emerald-500/5">
                            <p className="text-xs text-muted-foreground">Active & Valid</p>
                            <p className="text-xl font-bold mt-1 text-emerald-400">{MOCK_POLICIES.filter(p => p.status === "Active").length}</p>
                        </div>
                        <div className="rounded-xl border border-amber-500/20 p-4 bg-amber-500/5">
                            <p className="text-xs text-muted-foreground">Review Due Soon</p>
                            <p className="text-xl font-bold mt-1 text-amber-500">2 Policies</p>
                        </div>
                        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
                            <p className="text-xs text-muted-foreground">Average Version</p>
                            <p className="text-xl font-bold mt-1">v2.1</p>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search policies..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-1.5">
                            {(["All", "Privacy", "Security", "HR", "Internal", "Client"] as const).map(c => (
                                <button key={c} onClick={() => setCategoryFilter(c)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${categoryFilter === c ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Policy List */}
                    <div className="grid grid-cols-2 gap-3">
                        {filtered.map(policy => {
                            return (
                                <div key={policy.id}
                                    className="flex flex-col p-5 rounded-xl border border-border/50 hover:bg-accent/30 transition-all cursor-pointer group"
                                    onClick={() => setSelectedPolicy(policy)}>
                                    <div className="flex items-start justify-between mb-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${CATEGORY_COLORS[policy.category]}`}>
                                            {policy.category}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase ${policy.status === "Active" ? "text-emerald-400" : "text-amber-500"}`}>
                                            {policy.status}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold tracking-tight mb-2 group-hover:text-blue-400 transition-colors">{policy.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{policy.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-0.5">
                                                {policy.brands.slice(0, 4).map(bId => {
                                                    const b = BRANDS.find(x => x.id === bId)
                                                    return b ? <span key={bId} className={`h-2.5 w-2.5 rounded-full ${b.dotColor}`} /> : null
                                                })}
                                                {policy.brands.length > 4 && <span className="text-[10px] text-muted-foreground ml-1">+{policy.brands.length - 4}</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-muted-foreground font-medium uppercase font-mono">v{policy.version}</span>
                                            <span className="h-1 w-1 rounded-full bg-border" />
                                            <span className="text-[10px] text-muted-foreground font-medium uppercase font-mono">Review: {new Date(policy.nextReview + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Detail Sheet */}
                <Sheet open={!!selectedPolicy} onOpenChange={() => setSelectedPolicy(null)}>
                    <SheetContent className="sm:max-w-md">
                        {selectedPolicy && (
                            <div className="space-y-6 mt-4">
                                <SheetHeader>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${CATEGORY_COLORS[selectedPolicy.category]}`}>
                                            {selectedPolicy.category}
                                        </span>
                                    </div>
                                    <SheetTitle className="text-xl font-bold">{selectedPolicy.title}</SheetTitle>
                                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Version {selectedPolicy.version}</p>
                                </SheetHeader>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Overview</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{selectedPolicy.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl border border-border/40 bg-muted/20">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Last Reviewed</p>
                                            <p className="text-sm font-medium mt-1">{new Date(selectedPolicy.lastReview + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                                        </div>
                                        <div className="p-3 rounded-xl border border-border/40 bg-muted/20">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Next Review</p>
                                            <p className="text-sm font-medium mt-1">{new Date(selectedPolicy.nextReview + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Applicable To</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPolicy.brands.map(bId => {
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

                                    <div className="space-y-3">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compliance Actions</h4>
                                        <div className="flex flex-col gap-2">
                                            <Button variant="outline" className="justify-start gap-3 h-12 text-sm">
                                                <FileText className="h-5 w-5 text-blue-400" />
                                                Read Full Policy Document
                                                <ArrowSquareOut className="h-4 w-4 ml-auto" />
                                            </Button>
                                            <Button variant="outline" className="justify-start gap-3 h-12 text-sm">
                                                <CheckCircle className="h-5 w-5 text-emerald-400" />
                                                Acknowledge & Sign
                                                <ArrowSquareOut className="h-4 w-4 ml-auto" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Edit Policy</Button>
                                    <Button variant="secondary" className="flex-1">Audit Trail</Button>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </SidebarInset>
        </SidebarProvider>
    )
}
