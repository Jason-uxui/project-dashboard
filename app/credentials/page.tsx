"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    MagnifyingGlass,
    LockKey,
    Copy,
    Eye,
    EyeSlash,
    ShieldCheck,
    WarningCircle,
    Plus,
    ArrowSquareOut,
    Globe,
    Envelope,
    Users,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS } from "@/lib/data/brands"

type CredentialType = "Social" | "Hosting" | "API" | "Admin" | "Tool"

type Credential = {
    id: string
    name: string
    type: CredentialType
    username: string
    url?: string
    brands: string[]
    lastUsed: string
    securityScore: number // 0-100
    notes?: string
}

const TYPE_COLORS: Record<CredentialType, string> = {
    Social: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Hosting: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    API: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Admin: "bg-red-500/10 text-red-400 border-red-500/20",
    Tool: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

const MOCK_CREDENTIALS: Credential[] = [
    { id: "CR-001", name: "Instagram — Merkato Restaurant", type: "Social", username: "@merkato_addis", brands: ["tirat"], lastUsed: "2026-02-15", securityScore: 85, notes: "2FA enabled via Meana's phone." },
    { id: "CR-002", name: "Godaddy Admin", type: "Hosting", username: "haz@caravandigital.com", url: "https://godaddy.com", brands: ["tirat", "debo", "berhan"], lastUsed: "2026-02-14", securityScore: 65, notes: "Shared account for all domain management." },
    { id: "CR-003", name: "ManyChat — EthioBot", type: "Tool", username: "salim@caravandigital.com", url: "https://manychat.com", brands: ["ethiobot"], lastUsed: "2026-02-16", securityScore: 92 },
    { id: "CR-004", name: "Paypal — Caravan Corp", type: "Admin", username: "finance@caravandigital.com", url: "https://paypal.com", brands: ["berhan", "tirat", "debo", "ethio-influencers", "ethiobot"], lastUsed: "2026-02-10", securityScore: 98, notes: "Used for international subscriptions." },
    { id: "CR-005", name: "Facebook Ads Manager", type: "Social", username: "haz-business-manager", brands: ["berhan", "ethio-influencers"], lastUsed: "2026-02-16", securityScore: 78 },
    { id: "CR-006", name: "AWS Dashboard", type: "Hosting", username: "root@caravandigital.com", url: "https://aws.amazon.com", brands: ["debo"], lastUsed: "2026-02-12", securityScore: 95 },
    { id: "CR-007", name: "SendGrid API Key", type: "API", username: "apikey", brands: ["debo", "ethiobot"], lastUsed: "2026-02-16", securityScore: 100 },
    { id: "CR-008", name: "Canva Pro Teams", type: "Tool", username: "design@caravandigital.com", brands: ["tirat", "berhan"], lastUsed: "2026-02-15", securityScore: 70 },
    { id: "CR-009", name: "LinkedIn Page — Debo", type: "Social", username: "/company/debo-code", brands: ["debo"], lastUsed: "2026-02-11", securityScore: 82 },
    { id: "CR-010", name: "Vultr — Landing Pages", type: "Hosting", username: "dev@caravandigital.com", url: "https://vultr.com", brands: ["debo", "ethio-influencers"], lastUsed: "2026-02-05", securityScore: 75 },
]

export default function CredentialsPage() {
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState<CredentialType | "All">("All")
    const [brandFilter, setBrandFilter] = useState<string | null>(null)
    const [selectedCred, setSelectedCred] = useState<Credential | null>(null)
    const [showValues, setShowValues] = useState<Record<string, boolean>>({})

    const filtered = useMemo(() => {
        return MOCK_CREDENTIALS.filter(c => {
            if (typeFilter !== "All" && c.type !== typeFilter) return false
            if (brandFilter && !c.brands.includes(brandFilter)) return false
            if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
            return true
        })
    }, [search, typeFilter, brandFilter])

    const toggleShow = (id: string) => setShowValues(prev => ({ ...prev, [id]: !prev[id] }))

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1400px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Shared Credentials</h1>
                            <p className="text-sm text-muted-foreground mt-1">Encrypted vault for social logins, hosting accounts, and tool access.</p>
                        </div>
                        <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-3.5 w-3.5" />Add Credential
                        </Button>
                    </div>

                    {/* Stats / Security Overview */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
                            <p className="text-xs text-muted-foreground">Total Vault Items</p>
                            <p className="text-xl font-bold mt-1">{MOCK_CREDENTIALS.length}</p>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 p-4 bg-emerald-500/5">
                            <p className="text-xs text-muted-foreground">Average Security Score</p>
                            <p className="text-xl font-bold mt-1 text-emerald-400">83%</p>
                        </div>
                        <div className="rounded-xl border border-blue-500/20 p-4 bg-blue-500/5">
                            <p className="text-xs text-muted-foreground">Accounts with 2FA</p>
                            <p className="text-xl font-bold mt-1 text-blue-400">7 / 10</p>
                        </div>
                        <div className="rounded-xl border border-amber-500/20 p-4 bg-amber-500/5">
                            <p className="text-xs text-muted-foreground">Risk Alerts</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <WarningCircle className="h-4 w-4 text-amber-500" />
                                <p className="text-xl font-bold text-amber-500">2 Low Score</p>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search vault..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-1.5">
                            {(["All", "Social", "Hosting", "API", "Admin", "Tool"] as const).map(t => (
                                <button key={t} onClick={() => setTypeFilter(t as any)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${typeFilter === t ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setBrandFilter(null)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${!brandFilter ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                All Brands
                            </button>
                            {BRANDS.map(b => (
                                <button key={b.id} onClick={() => setBrandFilter(brandFilter === b.id ? null : b.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${brandFilter === b.id ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    <span className={`h-2 w-2 rounded-full ${b.dotColor}`} />{b.shortName}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid View */}
                    <div className="grid grid-cols-2 gap-3">
                        {filtered.map(cred => {
                            const isShowing = showValues[cred.id]
                            return (
                                <div key={cred.id}
                                    className="rounded-xl border border-border/50 p-4 hover:bg-accent/30 transition-all cursor-pointer group"
                                    onClick={() => setSelectedCred(cred)}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${TYPE_COLORS[cred.type]}`}>
                                                    {cred.type}
                                                </span>
                                                <div className="flex gap-0.5">
                                                    {cred.brands.map(bId => {
                                                        const b = BRANDS.find(x => x.id === bId)
                                                        return b ? <span key={bId} className={`h-2 w-2 rounded-full ${b.dotColor}`} /> : null
                                                    })}
                                                </div>
                                            </div>
                                            <h3 className="text-sm font-semibold truncate group-hover:text-blue-400 transition-colors">
                                                {cred.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                                                    {cred.username}
                                                </span>
                                                <button className="p-1 rounded hover:bg-muted text-muted-foreground">
                                                    <Copy className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <div className={`h-10 w-10 rounded-full border-4 flex items-center justify-center text-[10px] font-bold ${cred.securityScore >= 90 ? "border-emerald-500 text-emerald-400" : cred.securityScore >= 70 ? "border-blue-500 text-blue-400" : "border-amber-500 text-amber-500"}`}>
                                                    {cred.securityScore}%
                                                </div>
                                                <p className="text-[10px] text-muted-foreground">Last: {new Date(cred.lastUsed + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Detail Sheet */}
                <Sheet open={!!selectedCred} onOpenChange={() => setSelectedCred(null)}>
                    <SheetContent>
                        {selectedCred && (
                            <div className="space-y-6 mt-4">
                                <SheetHeader>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${TYPE_COLORS[selectedCred.type]}`}>{selectedCred.type}</span>
                                    </div>
                                    <SheetTitle className="text-xl">{selectedCred.name}</SheetTitle>
                                </SheetHeader>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Username / Email</label>
                                            <div className="flex items-center justify-between gap-2 p-2 rounded bg-background border border-border/40">
                                                <span className="text-sm font-mono truncate">{selectedCred.username}</span>
                                                <button className="p-1.5 rounded hover:bg-accent"><Copy className="h-4 w-4" /></button>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Password</label>
                                            <div className="flex items-center justify-between gap-2 p-2 rounded bg-background border border-border/40">
                                                <span className="text-sm font-mono">••••••••••••••••</span>
                                                <div className="flex gap-1">
                                                    <button className="p-1.5 rounded hover:bg-accent"><Eye className="h-4 w-4" /></button>
                                                    <button className="p-1.5 rounded hover:bg-accent"><Copy className="h-4 w-4" /></button>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedCred.url && (
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">URL</label>
                                                <div className="flex items-center justify-between gap-2 p-2 rounded bg-background border border-border/40">
                                                    <span className="text-sm font-mono truncate text-blue-400 underline">{selectedCred.url}</span>
                                                    <button className="p-1.5 rounded hover:bg-accent"><ArrowSquareOut className="h-4 w-4" /></button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Linked Brands</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCred.brands.map(bId => {
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

                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Security Audit</h4>
                                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-emerald-500/5">
                                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                            <div>
                                                <p className="text-sm font-medium">Strong Security Score</p>
                                                <p className="text-xs text-muted-foreground">Unique password and active 2FA detected.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedCred.notes && (
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Notes</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-muted pl-3">
                                                "{selectedCred.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button variant="outline" className="flex-1">Edit</Button>
                                    <Button variant="secondary" className="flex-1">History</Button>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </SidebarInset>
        </SidebarProvider>
    )
}
