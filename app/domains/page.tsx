"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    MagnifyingGlass,
    Globe,
    Plus,
    ArrowSquareOut,
    CalendarBlank,
    HardDrive,
    Record,
    WarningCircle,
    ShieldCheck,
    CheckCircle,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS } from "@/lib/data/brands"

type DomainStatus = "Active" | "Expiring Soon" | "Expired" | "Pending"

type Domain = {
    id: string
    name: string
    registrar: string
    expiryDate: string
    autoRenew: boolean
    brands: string[]
    status: DomainStatus
    dnsProvider: string
    hosting?: string
    sslStatus: "Valid" | "Expiring" | "Invalid"
}

const STATUS_COLORS: Record<DomainStatus, { bg: string; text: string; dot: string }> = {
    Active: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500" },
    "Expiring Soon": { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-500" },
    Expired: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-500" },
    Pending: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-500" },
}

const MOCK_DOMAINS: Domain[] = [
    { id: "DOM-001", name: "caravandigital.com", registrar: "GoDaddy", expiryDate: "2027-02-15", autoRenew: true, brands: ["tirat", "debo", "berhan"], status: "Active", dnsProvider: "Cloudflare", hosting: "Vultr", sslStatus: "Valid" },
    { id: "DOM-002", name: "tiratstudio.com", registrar: "GoDaddy", expiryDate: "2026-06-12", autoRenew: true, brands: ["tirat"], status: "Active", dnsProvider: "Cloudflare", hosting: "GitHub Pages", sslStatus: "Valid" },
    { id: "DOM-003", name: "debocode.et", registrar: "Ethio-Telecom", expiryDate: "2026-03-20", autoRenew: false, brands: ["debo"], status: "Expiring Soon", dnsProvider: "Cloudflare", hosting: "AWS", sslStatus: "Expiring" },
    { id: "DOM-004", name: "berhandigital.et", registrar: "Ethio-Telecom", expiryDate: "2026-05-15", autoRenew: true, brands: ["berhan"], status: "Active", dnsProvider: "ERCA Gov", hosting: "Vultr", sslStatus: "Valid" },
    { id: "DOM-005", name: "merkatoaddis.com", registrar: "Namecheap", expiryDate: "2026-02-28", autoRenew: true, brands: ["tirat"], status: "Expiring Soon", dnsProvider: "DigitalOcean", hosting: "DigitalOcean", sslStatus: "Valid" },
    { id: "DOM-006", name: "ethiobot.ai", registrar: "Namecheap", expiryDate: "2027-01-20", autoRenew: true, brands: ["ethiobot"], status: "Active", dnsProvider: "Cloudflare", hosting: "Vultr", sslStatus: "Valid" },
    { id: "DOM-007", name: "influencerconnect.et", registrar: "Ethio-Telecom", expiryDate: "2026-01-10", autoRenew: false, brands: ["ethio-influencers"], status: "Expired", dnsProvider: "Local", sslStatus: "Invalid" },
    { id: "DOM-008", name: "addisrestaurant.eth", registrar: "Web3", expiryDate: "2030-10-10", autoRenew: false, brands: ["ethiobot"], status: "Active", dnsProvider: "ENS", sslStatus: "Valid" },
]

export default function DomainsPage() {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<DomainStatus | "All">("All")
    const [brandFilter, setBrandFilter] = useState<string | null>(null)
    const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)

    const filtered = useMemo(() => {
        return MOCK_DOMAINS.filter(d => {
            if (statusFilter !== "All" && d.status !== statusFilter) return false
            if (brandFilter && !d.brands.includes(brandFilter)) return false
            if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
            return true
        })
    }, [search, statusFilter, brandFilter])

    const expiringCount = MOCK_DOMAINS.filter(d => d.status === "Expiring Soon" || d.status === "Expired").length

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1400px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Domains & Hosting</h1>
                            <p className="text-sm text-muted-foreground mt-1">Manage web properties, registrars, and DNS records for all brands.</p>
                        </div>
                        <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-3.5 w-3.5" />Register Domain
                        </Button>
                    </div>

                    {/* Critical Alerts / Summary */}
                    {expiringCount > 0 && (
                        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                            <WarningCircle className="h-5 w-5 text-red-400" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-400">Attention Required</p>
                                <p className="text-xs text-red-400/80">{expiringCount} domains are expiring or have already expired. Please renew to prevent service disruption.</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10">Renew Now</Button>
                        </div>
                    )}

                    <div className="grid grid-cols-4 gap-3">
                        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
                            <p className="text-xs text-muted-foreground">Active Domains</p>
                            <p className="text-xl font-bold mt-1">{MOCK_DOMAINS.filter(d => d.status === "Active").length}</p>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 p-4 bg-emerald-500/5">
                            <p className="text-xs text-muted-foreground">SSL Compliance</p>
                            <p className="text-xl font-bold mt-1 text-emerald-400">92%</p>
                        </div>
                        <div className="rounded-xl border border-blue-500/20 p-4 bg-blue-500/5">
                            <p className="text-xs text-muted-foreground">Auto-Renew Status</p>
                            <p className="text-xl font-bold mt-1 text-blue-400">5 / 8</p>
                        </div>
                        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
                            <p className="text-xs text-muted-foreground">Primary Registrar</p>
                            <p className="text-xl font-bold mt-1">GoDaddy</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search domains..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-1.5">
                            {(["All", "Active", "Expiring Soon", "Expired"] as const).map(s => (
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

                    {/* Table View */}
                    <div className="rounded-xl border border-border/60 overflow-hidden">
                        <table className="w-full text-sm font-medium">
                            <thead>
                                <tr className="border-b border-border/60 bg-muted/30">
                                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Domain Name</th>
                                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">Brands</th>
                                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">Registrar</th>
                                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">SSL</th>
                                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">Expiry Date</th>
                                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">Status</th>
                                    <th className="w-10 px-3 py-2.5"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(domain => {
                                    const sc = STATUS_COLORS[domain.status]
                                    const expiryDate = new Date(domain.expiryDate + "T00:00:00")
                                    return (
                                        <tr key={domain.id} onClick={() => setSelectedDomain(domain)}
                                            className="border-b border-border/30 cursor-pointer hover:bg-accent/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4 text-blue-400" />
                                                    <span className="text-sm font-bold tracking-tight">{domain.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex gap-0.5">
                                                    {domain.brands.map(bId => {
                                                        const b = BRANDS.find(x => x.id === bId)
                                                        return b ? <span key={bId} className={`h-2.5 w-2.5 rounded-full ${b.dotColor}`} /> : null
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 text-xs text-muted-foreground">{domain.registrar}</td>
                                            <td className="px-3 py-3">
                                                <span className={`inline-flex items-center gap-1 text-[10px] ${domain.sslStatus === "Valid" ? "text-emerald-400" : "text-amber-400"}`}>
                                                    <ShieldCheck className="h-3.5 w-3.5" weight="fill" />
                                                    {domain.sslStatus}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-foreground">{expiryDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                                    {domain.autoRenew && <span className="text-[9px] text-emerald-400 uppercase font-bold">Auto-Renew On</span>}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${sc.bg} ${sc.text}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                                    {domain.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-right">
                                                <ArrowSquareOut className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detail Sheet */}
                <Sheet open={!!selectedDomain} onOpenChange={() => setSelectedDomain(null)}>
                    <SheetContent className="sm:max-w-md">
                        {selectedDomain && (
                            <div className="space-y-6 mt-4">
                                <SheetHeader>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${STATUS_COLORS[selectedDomain.status].bg} ${STATUS_COLORS[selectedDomain.status].text}`}>
                                            {selectedDomain.status}
                                        </span>
                                    </div>
                                    <SheetTitle className="text-xl font-bold">{selectedDomain.name}</SheetTitle>
                                </SheetHeader>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl border border-border/40 bg-muted/20">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Registrar</p>
                                        <p className="text-sm font-medium mt-1">{selectedDomain.registrar}</p>
                                    </div>
                                    <div className="p-3 rounded-xl border border-border/40 bg-muted/20">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">DNS Provider</p>
                                        <p className="text-sm font-medium mt-1">{selectedDomain.dnsProvider}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/40">
                                        <div className="flex items-center gap-3">
                                            <HardDrive className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Hosting</p>
                                                <p className="text-xs text-muted-foreground">{selectedDomain.hosting || "Not Linked"}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">Manage</Button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/40">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                            <div>
                                                <p className="text-sm font-medium">SSL Certificate</p>
                                                <p className="text-xs text-muted-foreground">Issued by Let's Encrypt</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Valid</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Linked Brands</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedDomain.brands.map(bId => {
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

                                <div className="rounded-xl border border-border/40 p-4 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Expiry Date</span>
                                        <span className="font-bold">{new Date(selectedDomain.expiryDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-t border-border/40 pt-3">
                                        <span className="text-muted-foreground">Auto-Renewal</span>
                                        <span className={`font-bold ${selectedDomain.autoRenew ? "text-emerald-400" : "text-muted-foreground"}`}>{selectedDomain.autoRenew ? "Enabled" : "Disabled"}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Renew Domain</Button>
                                    <Button variant="outline" className="flex-1">DNS Settings</Button>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </SidebarInset>
        </SidebarProvider>
    )
}
