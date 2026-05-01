"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  MagnifyingGlass,
  Plus,
  Buildings,
  Star,
  CurrencyDollar,
  Envelope,
  Phone,
  CalendarBlank,
  Tag,
  ArrowsClockwise,
  FolderOpen,
  Receipt,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS } from "@/lib/data/brands"

type ClientStatus = "Active" | "Paused" | "Completed" | "Churned"

type Client = {
  id: string
  company: string
  contact: string
  email: string
  phone: string
  brands: string[]
  status: ClientStatus
  activeProjects: number
  lifetimeValue: number
  satisfaction: number
  lastActivity: string
  tags: string[]
  source: string
  projectHistory: { name: string; brand: string; value: number; status: string }[]
  invoiceHistory: { id: string; amount: number; status: string; date: string }[]
}

const STATUS_COLORS: Record<ClientStatus, { bg: string; text: string }> = {
  Active: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  Paused: { bg: "bg-amber-500/10", text: "text-amber-400" },
  Completed: { bg: "bg-blue-500/10", text: "text-blue-400" },
  Churned: { bg: "bg-red-500/10", text: "text-red-400" },
}

const MOCK_CLIENTS: Client[] = [
  { id: "CL-001", company: "Merkato Restaurant", contact: "Abebe Kebede", email: "abebe@merkato.com", phone: "+251911234567", brands: ["tirat", "debo", "berhan"], status: "Active", activeProjects: 2, lifetimeValue: 145000, satisfaction: 4.8, lastActivity: "2026-02-15", tags: ["VIP", "Quick Payer"], source: "Referral", projectHistory: [{ name: "Brand Identity", brand: "tirat", value: 45000, status: "In Progress" }, { name: "Website Development", brand: "debo", value: 65000, status: "Planning" }, { name: "Social Media Setup", brand: "berhan", value: 35000, status: "Completed" }], invoiceHistory: [{ id: "INV-TS-2026-012", amount: 22500, status: "Paid", date: "2026-01-15" }, { id: "INV-TS-2026-013", amount: 22500, status: "Pending", date: "2026-02-15" }] },
  { id: "CL-002", company: "Addis Pharma", contact: "Sara Hailu", email: "sara@addispharma.com", phone: "+251922345678", brands: ["debo", "berhan"], status: "Active", activeProjects: 1, lifetimeValue: 110000, satisfaction: 4.5, lastActivity: "2026-02-14", tags: ["Quick Payer"], source: "Website Form", projectHistory: [{ name: "E-commerce Website", brand: "debo", value: 75000, status: "Execution" }, { name: "Content Strategy", brand: "berhan", value: 35000, status: "Completed" }], invoiceHistory: [{ id: "INV-DC-2026-018", amount: 37500, status: "Paid", date: "2026-01-20" }, { id: "INV-DC-2026-019", amount: 37500, status: "Overdue", date: "2026-02-10" }] },
  { id: "CL-003", company: "Habesha Brewing", contact: "Dawit Tessema", email: "dawit@habesha.com", phone: "+251933456789", brands: ["berhan", "ethio-influencers"], status: "Active", activeProjects: 1, lifetimeValue: 85000, satisfaction: 4.2, lastActivity: "2026-02-16", tags: ["Cross-referral candidate"], source: "Facebook DM", projectHistory: [{ name: "Social Media Management", brand: "berhan", value: 35000, status: "Active" }, { name: "Influencer Campaign", brand: "ethio-influencers", value: 50000, status: "Execution" }], invoiceHistory: [{ id: "INV-BH-2026-031", amount: 35000, status: "Pending", date: "2026-02-18" }] },
  { id: "CL-004", company: "Ethio Telecom", contact: "Meron Alemu", email: "meron@ethiotelecom.et", phone: "+251944567890", brands: ["berhan", "tirat", "ethiobot"], status: "Active", activeProjects: 3, lifetimeValue: 280000, satisfaction: 4.9, lastActivity: "2026-02-16", tags: ["VIP", "Enterprise"], source: "Cold Outreach", projectHistory: [{ name: "Year-long Content", brand: "berhan", value: 120000, status: "Active" }, { name: "Brand Refresh", brand: "tirat", value: 80000, status: "QA" }, { name: "CS Chatbot", brand: "ethiobot", value: 80000, status: "Planning" }], invoiceHistory: [{ id: "INV-BH-2026-040", amount: 60000, status: "Paid", date: "2026-01-01" }, { id: "INV-BH-2026-041", amount: 60000, status: "Paid", date: "2026-02-01" }] },
  { id: "CL-005", company: "Zemen Bank", contact: "Yonas Biruk", email: "yonas@zemenbank.com", phone: "+251955678901", brands: ["debo"], status: "Completed", activeProjects: 0, lifetimeValue: 95000, satisfaction: 4.6, lastActivity: "2026-01-28", tags: ["Quick Payer"], source: "Referral", projectHistory: [{ name: "Internet Banking Portal", brand: "debo", value: 95000, status: "Delivered" }], invoiceHistory: [{ id: "INV-DC-2026-005", amount: 95000, status: "Paid", date: "2026-01-25" }] },
  { id: "CL-006", company: "Addis Ababa University", contact: "Kidist Worku", email: "kidist@aau.edu.et", phone: "+251966789012", brands: ["tirat", "debo"], status: "Paused", activeProjects: 0, lifetimeValue: 55000, satisfaction: 3.8, lastActivity: "2026-01-10", tags: ["Needs Hand-Holding"], source: "Website Form", projectHistory: [{ name: "Department Website", brand: "debo", value: 40000, status: "Paused" }, { name: "Brochure Design", brand: "tirat", value: 15000, status: "Completed" }], invoiceHistory: [{ id: "INV-DC-2026-002", amount: 20000, status: "Paid", date: "2025-12-15" }, { id: "INV-DC-2026-003", amount: 20000, status: "Overdue", date: "2026-01-15" }] },
  { id: "CL-007", company: "Lucy Airlines", contact: "Helen Tadesse", email: "helen@lucyairlines.com", phone: "+251977890123", brands: ["berhan", "tirat", "debo", "ethiobot"], status: "Active", activeProjects: 2, lifetimeValue: 320000, satisfaction: 4.7, lastActivity: "2026-02-16", tags: ["VIP", "Enterprise", "Cross-referral candidate"], source: "Cold Outreach", projectHistory: [{ name: "Digital Transformation", brand: "debo", value: 150000, status: "Execution" }, { name: "Brand Evolution", brand: "tirat", value: 60000, status: "Completed" }, { name: "Social Media", brand: "berhan", value: 80000, status: "Active" }, { name: "Booking Bot", brand: "ethiobot", value: 30000, status: "Planning" }], invoiceHistory: [{ id: "INV-DC-2026-050", amount: 75000, status: "Paid", date: "2026-01-15" }, { id: "INV-DC-2026-051", amount: 75000, status: "Pending", date: "2026-02-15" }] },
  { id: "CL-008", company: "Garden of Coffee", contact: "Tigist Beyene", email: "tigist@gardenofcoffee.com", phone: "+251988901234", brands: ["berhan"], status: "Churned", activeProjects: 0, lifetimeValue: 15000, satisfaction: 2.5, lastActivity: "2025-11-20", tags: [], source: "Facebook DM", projectHistory: [{ name: "Social Media Trial", brand: "berhan", value: 15000, status: "Completed" }], invoiceHistory: [{ id: "INV-BH-2025-090", amount: 15000, status: "Paid", date: "2025-11-15" }] },
]

export default function ClientsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "All">("All")
  const [brandFilter, setBrandFilter] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [detailTab, setDetailTab] = useState<"overview" | "projects" | "invoices">("overview")

  const filtered = useMemo(() => {
    return MOCK_CLIENTS.filter(c => {
      if (statusFilter !== "All" && c.status !== statusFilter) return false
      if (brandFilter && !c.brands.includes(brandFilter)) return false
      if (search && !c.company.toLowerCase().includes(search.toLowerCase()) && !c.contact.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }).sort((a, b) => b.lifetimeValue - a.lifetimeValue)
  }, [search, statusFilter, brandFilter])

  const totalLTV = MOCK_CLIENTS.reduce((s, c) => s + c.lifetimeValue, 0)
  const activeCount = MOCK_CLIENTS.filter(c => c.status === "Active").length
  const avgSatisfaction = (MOCK_CLIENTS.reduce((s, c) => s + c.satisfaction, 0) / MOCK_CLIENTS.length).toFixed(1)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col gap-6 p-6 max-w-[1400px]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Client Portfolio</h1>
              <p className="text-sm text-muted-foreground mt-1">All clients across every brand — relationships, lifetime value, and cross-referral tracking.</p>
            </div>
            <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Add Client</Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
              <p className="text-xs text-muted-foreground">Total Clients</p>
              <p className="text-xl font-bold mt-1">{MOCK_CLIENTS.length}</p>
            </div>
            <div className="rounded-xl border border-border/60 p-4 bg-emerald-500/5 border-emerald-500/20">
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-xl font-bold mt-1 text-emerald-400">{activeCount}</p>
            </div>
            <div className="rounded-xl border border-border/60 p-4 bg-blue-500/5 border-blue-500/20">
              <p className="text-xs text-muted-foreground">Total Lifetime Value</p>
              <p className="text-xl font-bold mt-1 text-blue-400">{totalLTV.toLocaleString()} ETB</p>
            </div>
            <div className="rounded-xl border border-border/60 p-4 bg-amber-500/5 border-amber-500/20">
              <p className="text-xs text-muted-foreground">Avg Satisfaction</p>
              <p className="text-xl font-bold mt-1 text-amber-400">⭐ {avgSatisfaction}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search client or contact..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-1.5">
              {(["All", "Active", "Paused", "Completed", "Churned"] as const).map(s => (
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

          {/* Table */}
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Company</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Brands</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-center px-3 py-2.5 text-xs font-medium text-muted-foreground">Projects</th>
                  <th className="text-right px-3 py-2.5 text-xs font-medium text-muted-foreground">Lifetime Value</th>
                  <th className="text-center px-3 py-2.5 text-xs font-medium text-muted-foreground">Rating</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Tags</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Source</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(client => {
                  const sc = STATUS_COLORS[client.status]
                  return (
                    <tr key={client.id} onClick={() => { setSelectedClient(client); setDetailTab("overview") }}
                      className="border-b border-border/30 cursor-pointer hover:bg-accent/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center"><Buildings className="h-4 w-4 text-muted-foreground" /></div>
                          <div>
                            <p className="font-medium">{client.company}</p>
                            <p className="text-xs text-muted-foreground">{client.contact}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          {client.brands.map(bId => { const b = BRANDS.find(x => x.id === bId); return b ? <span key={bId} className={`h-2.5 w-2.5 rounded-full ${b.dotColor}`} title={b.name} /> : null })}
                        </div>
                      </td>
                      <td className="px-3 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>{client.status}</span></td>
                      <td className="px-3 py-3 text-center">{client.activeProjects}</td>
                      <td className="px-3 py-3 text-right font-semibold">{client.lifetimeValue.toLocaleString()} ETB</td>
                      <td className="px-3 py-3 text-center"><span className={`text-xs ${client.satisfaction >= 4.5 ? "text-emerald-400" : client.satisfaction >= 3.5 ? "text-amber-400" : "text-red-400"}`}>⭐ {client.satisfaction}</span></td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1 flex-wrap">{client.tags.map(t => <span key={t} className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">{t}</span>)}</div>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{client.source}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Sheet */}
        <Sheet open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <SheetContent className="sm:max-w-lg">
            {selectedClient && (() => {
              const sc = STATUS_COLORS[selectedClient.status]
              return (
                <>
                  <SheetHeader>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>{selectedClient.status}</span>
                      <div className="flex gap-1">{selectedClient.brands.map(bId => { const b = BRANDS.find(x => x.id === bId); return b ? <span key={bId} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${b.color} ${b.textColor}`}>{b.shortName}</span> : null })}</div>
                    </div>
                    <SheetTitle className="text-lg">{selectedClient.company}</SheetTitle>
                  </SheetHeader>

                  {/* Tabs */}
                  <div className="flex gap-1 mt-4 border-b border-border/40 pb-0">
                    {(["overview", "projects", "invoices"] as const).map(tab => (
                      <button key={tab} onClick={() => setDetailTab(tab)}
                        className={`px-3 py-2 text-xs font-medium capitalize border-b-2 transition-colors ${detailTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 space-y-4">
                    {detailTab === "overview" && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg border border-border/40">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Lifetime Value</p>
                            <p className="text-lg font-bold text-blue-400 mt-1">{selectedClient.lifetimeValue.toLocaleString()} ETB</p>
                          </div>
                          <div className="p-3 rounded-lg border border-border/40">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Satisfaction</p>
                            <p className="text-lg font-bold text-amber-400 mt-1">⭐ {selectedClient.satisfaction}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-sm"><Envelope className="h-4 w-4 text-muted-foreground" /><span>{selectedClient.email}</span></div>
                          <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span>{selectedClient.phone}</span></div>
                          <div className="flex items-center gap-3 text-sm"><CalendarBlank className="h-4 w-4 text-muted-foreground" /><span>Last active: {new Date(selectedClient.lastActivity + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
                          <div className="flex items-center gap-3 text-sm"><Tag className="h-4 w-4 text-muted-foreground" /><span>Source: {selectedClient.source}</span></div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tags</h4>
                          <div className="flex gap-1.5 flex-wrap">{selectedClient.tags.length > 0 ? selectedClient.tags.map(t => <span key={t} className="px-2 py-1 rounded-md text-xs bg-muted">{t}</span>) : <span className="text-xs text-muted-foreground">No tags</span>}</div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Cross-Brand Usage</h4>
                          <div className="flex gap-2">{selectedClient.brands.map(bId => { const b = BRANDS.find(x => x.id === bId); return b ? <div key={bId} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${b.color} ${b.textColor}`}><span className={`h-2 w-2 rounded-full ${b.dotColor}`} /><span className="text-xs font-medium">{b.name}</span></div> : null })}</div>
                        </div>
                      </>
                    )}
                    {detailTab === "projects" && (
                      <div className="space-y-2">
                        {selectedClient.projectHistory.map((p, i) => {
                          const brand = BRANDS.find(b => b.id === p.brand)
                          return (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/40">
                              <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">{p.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {brand && <span className={`text-[10px] ${brand.textColor}`}>{brand.shortName}</span>}
                                  <span className="text-[10px] text-muted-foreground">·</span>
                                  <span className="text-[10px] text-muted-foreground">{p.status}</span>
                                </div>
                              </div>
                              <span className="text-sm font-semibold">{p.value.toLocaleString()} ETB</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {detailTab === "invoices" && (
                      <div className="space-y-2">
                        {selectedClient.invoiceHistory.map((inv, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/40">
                            <Receipt className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-mono">{inv.id}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(inv.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                            </div>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-400" : inv.status === "Overdue" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>{inv.status}</span>
                            <span className="text-sm font-semibold ml-2">{inv.amount.toLocaleString()} ETB</span>
                          </div>
                        ))}
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
