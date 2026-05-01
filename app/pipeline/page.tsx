"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Funnel, Plus, MagnifyingGlass, DotsThree, Star, X, ArrowRight, Phone, Envelope, ChatCircle } from "@phosphor-icons/react/dist/ssr"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BRAND_MAP, BRANDS, type BrandId, type LeadSource } from "@/lib/data/brands"
import { toast } from "sonner"

type Lead = {
    id: string
    name: string
    value: number
    contact: string
    email: string
    phone: string
    days: number
    brand: BrandId
    score: number
    source: LeadSource
    services: string[]
    notes: string
}

const initialStages: { name: string; color: string; leads: Lead[] }[] = [
    {
        name: "New Lead",
        color: "bg-blue-500",
        leads: [
            { id: "L001", name: "Ethio Telecom", value: 35000, contact: "Abebe K.", email: "abebe@ethiotelecom.et", phone: "+251-911-123456", days: 2, brand: "berhan", score: 82, source: "Facebook DM", services: ["Social Media", "SEO"], notes: "Interested in Q2 social package" },
            { id: "L002", name: "Commercial Bank of Ethiopia", value: 48000, contact: "Sara M.", email: "sara@cbe.et", phone: "+251-922-234567", days: 1, brand: "tirat", score: 88, source: "Referral", services: ["Full Rebrand"], notes: "Top priority — CEO referral from Awash Bank" },
            { id: "L003", name: "Dashen Brewery", value: 15000, contact: "Daniel T.", email: "daniel@dashen.et", phone: "+251-933-345678", days: 3, brand: "berhan", score: 55, source: "Website", services: ["Social Media"], notes: "Small scope, good for Bronze freelancers" },
        ],
    },
    {
        name: "Contacted",
        color: "bg-amber-500",
        leads: [
            { id: "L004", name: "Awash Bank", value: 60000, contact: "Helen G.", email: "helen@awashbank.et", phone: "+251-944-456789", days: 5, brand: "debo", score: 91, source: "Referral", services: ["Website", "E-commerce"], notes: "Need custom CMS with Amharic support" },
            { id: "L005", name: "Habesha Breweries", value: 25000, contact: "Meron A.", email: "meron@habesha.et", phone: "+251-955-567890", days: 7, brand: "ethio-influencers", score: 68, source: "Facebook DM", services: ["Influencer Campaign"], notes: "Festival season timing" },
        ],
    },
    {
        name: "Proposal Sent",
        color: "bg-purple-500",
        leads: [
            { id: "L006", name: "Ethiopian Airlines", value: 120000, contact: "Kidane B.", email: "kidane@ethiopianairlines.com", phone: "+251-966-678901", days: 10, brand: "debo", score: 95, source: "Cross-referral", services: ["Website", "Mobile App", "Chatbot"], notes: "Multi-brand deal — Debo primary, EthioBot for chatbot" },
            { id: "L007", name: "Zemen Bank", value: 45000, contact: "Tigist W.", email: "tigist@zemenbank.et", phone: "+251-977-789012", days: 8, brand: "tirat", score: 78, source: "Website", services: ["Branding", "Logo Design"], notes: "Wants modern refresh, keep heritage feel" },
            { id: "L008", name: "Anbessa Shoe", value: 18000, contact: "Yonas D.", email: "yonas@anbessa.et", phone: "+251-988-890123", days: 4, brand: "tirat", score: 62, source: "Facebook DM", services: ["Logo Design"], notes: "Quick turnaround needed" },
        ],
    },
    {
        name: "Negotiation",
        color: "bg-orange-500",
        leads: [
            { id: "L009", name: "Varnero Tech", value: 85000, contact: "Robel S.", email: "robel@varnero.com", phone: "+251-999-901234", days: 14, brand: "debo", score: 90, source: "Referral", services: ["Web App", "API Integration"], notes: "Technical scope review needed with Dawit" },
        ],
    },
    {
        name: "Closed Won",
        color: "bg-emerald-500",
        leads: [
            { id: "L010", name: "Ride Ethiopia", value: 60000, contact: "Hanna F.", email: "hanna@rideethiopia.com", phone: "+251-910-012345", days: 21, brand: "debo", score: 93, source: "Referral", services: ["Website", "CMS"], notes: "Kickoff complete — Dawit leading dev" },
            { id: "L011", name: "BlueMoon Hotel", value: 45000, contact: "Liya T.", email: "liya@bluemoonhotel.et", phone: "+251-921-123456", days: 18, brand: "tirat", score: 85, source: "Cross-referral", services: ["Full Rebrand", "Print Design"], notes: "Phase 1 delivered, Phase 2 starting" },
        ],
    },
]

function ScoreBadge({ score }: { score: number }) {
    const color = score >= 80 ? "bg-emerald-500/10 text-emerald-500" : score >= 60 ? "bg-amber-500/10 text-amber-500" : "bg-red-400/10 text-red-400"
    return <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold ${color}`}>{score}</span>
}

function formatETB(value: number) {
    return value.toLocaleString("en-US") + " ETB"
}

export default function PipelinePage() {
    const [stages, setStages] = useState(initialStages)
    const [search, setSearch] = useState("")
    const [brandFilter, setBrandFilter] = useState<string>("all")
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newLead, setNewLead] = useState({ name: "", contact: "", email: "", phone: "", value: "", brand: "" as BrandId | "", services: "", source: "" as LeadSource | "", notes: "" })

    const filteredStages = stages.map((stage) => ({
        ...stage,
        leads: stage.leads.filter((lead) => {
            const matchesSearch = search === "" || lead.name.toLowerCase().includes(search.toLowerCase()) || lead.contact.toLowerCase().includes(search.toLowerCase())
            const matchesBrand = brandFilter === "all" || lead.brand === brandFilter
            return matchesSearch && matchesBrand
        }),
    }))

    const totalValue = filteredStages.reduce((sum, s) => sum + s.leads.reduce((ls, l) => ls + l.value, 0), 0)

    const handleCreateLead = () => {
        if (!newLead.name || !newLead.brand) {
            toast.error("Name and brand are required")
            return
        }
        const lead: Lead = {
            id: `L${Date.now()}`,
            name: newLead.name,
            contact: newLead.contact,
            email: newLead.email,
            phone: newLead.phone,
            value: parseInt(newLead.value) || 0,
            brand: newLead.brand as BrandId,
            score: Math.floor(Math.random() * 40) + 50,
            source: (newLead.source || "Website") as LeadSource,
            services: newLead.services.split(",").map(s => s.trim()).filter(Boolean),
            notes: newLead.notes,
            days: 0,
        }
        setStages(prev => prev.map((s, i) => i === 0 ? { ...s, leads: [...s.leads, lead] } : s))
        setIsCreateOpen(false)
        setNewLead({ name: "", contact: "", email: "", phone: "", value: "", brand: "", services: "", source: "", notes: "" })
        toast.success(`Lead "${lead.name}" added to New Lead stage`)
    }

    const handleMoveLead = (lead: Lead, fromStage: string, direction: "forward" | "back") => {
        const stageIndex = stages.findIndex(s => s.name === fromStage)
        const targetIndex = direction === "forward" ? stageIndex + 1 : stageIndex - 1
        if (targetIndex < 0 || targetIndex >= stages.length) return

        setStages(prev => prev.map((s, i) => {
            if (i === stageIndex) return { ...s, leads: s.leads.filter(l => l.id !== lead.id) }
            if (i === targetIndex) return { ...s, leads: [...s.leads, lead] }
            return s
        }))
        toast.success(`"${lead.name}" moved to ${stages[targetIndex].name}`)
        setSelectedLead(null)
    }

    const getLeadStage = (lead: Lead) => stages.find(s => s.leads.some(l => l.id === lead.id))?.name || ""

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between border-b border-border/40 px-8 py-5">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">Pipeline</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">Track leads across all 5 brands — {formatETB(totalValue)} in pipeline.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}>
                                <Plus className="h-4 w-4" /> Add Lead
                            </Button>
                        </div>
                    </header>

                    <div className="px-8 py-4 border-b border-border/40 flex items-center gap-4">
                        <div className="relative max-w-sm flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search leads..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setBrandFilter("all")}
                                className={`flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium hover:bg-muted transition-colors ${brandFilter === "all" ? "bg-muted border-foreground/30" : ""}`}
                            >
                                All Brands
                            </button>
                            {BRANDS.map((b) => (
                                <button
                                    key={b.id}
                                    onClick={() => setBrandFilter(brandFilter === b.id ? "all" : b.id)}
                                    className={`flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium hover:bg-muted transition-colors ${brandFilter === b.id ? "bg-muted border-foreground/30" : ""}`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${b.dotColor}`} />
                                    {b.shortName}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto p-6">
                        <div className="flex gap-4 min-w-max">
                            {filteredStages.map((stage) => (
                                <div key={stage.name} className="w-[290px] flex-shrink-0">
                                    <div className="flex items-center gap-2 mb-3 px-1">
                                        <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stage.name}</span>
                                        <span className="ml-auto text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{stage.leads.length}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {stage.leads.map((lead) => {
                                            const brand = BRAND_MAP[lead.brand]
                                            return (
                                                <div
                                                    key={lead.id}
                                                    onClick={() => setSelectedLead(lead)}
                                                    className="rounded-xl border border-border/60 bg-card p-4 hover:shadow-md hover:border-border transition-all cursor-pointer group active:scale-[0.98]"
                                                >
                                                    <div className="flex items-start justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`h-2 w-2 rounded-full shrink-0 ${brand.dotColor}`} />
                                                            <h3 className="text-sm font-medium truncate">{lead.name}</h3>
                                                        </div>
                                                        <ScoreBadge score={lead.score} />
                                                    </div>
                                                    <p className="text-base font-bold tracking-tight mb-2">{formatETB(lead.value)}</p>
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {lead.services.map((s) => (
                                                            <span key={s} className="bg-muted px-1.5 py-0.5 rounded text-[9px] font-medium text-muted-foreground">{s}</span>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>{lead.contact}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-muted/80 px-1.5 py-0.5 rounded text-[9px]">{lead.source}</span>
                                                            <span>{lead.days}d ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <button
                                            onClick={() => setIsCreateOpen(true)}
                                            className="w-full rounded-xl border border-dashed border-border/60 py-3 text-xs text-muted-foreground hover:bg-muted/30 hover:border-border transition-all"
                                        >
                                            + Add lead
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lead Detail Sheet */}
                <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
                    <SheetContent className="sm:max-w-lg overflow-y-auto">
                        {selectedLead && (() => {
                            const brand = BRAND_MAP[selectedLead.brand]
                            const currentStage = getLeadStage(selectedLead)
                            const stageIndex = stages.findIndex(s => s.name === currentStage)
                            return (
                                <>
                                    <SheetHeader>
                                        <div className="flex items-center gap-2">
                                            <span className={`h-3 w-3 rounded-full ${brand.dotColor}`} />
                                            <SheetTitle>{selectedLead.name}</SheetTitle>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{brand.name} · {currentStage}</p>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Deal Value</p>
                                                <p className="text-2xl font-bold">{formatETB(selectedLead.value)}</p>
                                            </div>
                                            <ScoreBadge score={selectedLead.score} />
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contact</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"><Phone className="h-4 w-4 text-muted-foreground" /></span>
                                                    <div>
                                                        <p className="font-medium">{selectedLead.contact}</p>
                                                        <p className="text-xs text-muted-foreground">{selectedLead.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"><Envelope className="h-4 w-4 text-muted-foreground" /></span>
                                                    <p className="text-muted-foreground">{selectedLead.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Services</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedLead.services.map((s) => (
                                                    <span key={s} className="bg-muted px-2.5 py-1 rounded-lg text-xs font-medium">{s}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Score Breakdown</h4>
                                            <div className="space-y-2">
                                                {[
                                                    { label: "Budget Fit", value: Math.min(100, selectedLead.score + 5) },
                                                    { label: "Engagement", value: Math.min(100, selectedLead.score - 3) },
                                                    { label: "Timeline", value: Math.min(100, selectedLead.score + 10) },
                                                    { label: "Referral Quality", value: selectedLead.source === "Referral" || selectedLead.source === "Cross-referral" ? 95 : 50 },
                                                ].map((item) => (
                                                    <div key={item.label} className="flex items-center gap-3">
                                                        <span className="text-xs text-muted-foreground w-28">{item.label}</span>
                                                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${item.value >= 80 ? "bg-emerald-500" : item.value >= 60 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${item.value}%` }} />
                                                        </div>
                                                        <span className="text-xs font-medium w-8 text-right">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notes</h4>
                                            <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 border border-border/40">{selectedLead.notes}</p>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            {stageIndex > 0 && (
                                                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleMoveLead(selectedLead, currentStage, "back")}>
                                                    ← Move Back
                                                </Button>
                                            )}
                                            {stageIndex < stages.length - 1 && (
                                                <Button size="sm" className="flex-1 gap-1" onClick={() => handleMoveLead(selectedLead, currentStage, "forward")}>
                                                    Advance <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )
                        })()}
                    </SheetContent>
                </Sheet>

                {/* New Lead Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>New Lead</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label>Company Name *</Label>
                                <Input value={newLead.name} onChange={(e) => setNewLead(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Ethiopian Airlines" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Contact Person</Label>
                                    <Input value={newLead.contact} onChange={(e) => setNewLead(prev => ({ ...prev, contact: e.target.value }))} placeholder="e.g. Abebe K." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Brand *</Label>
                                    <Select value={newLead.brand} onValueChange={(v) => setNewLead(prev => ({ ...prev, brand: v as BrandId }))}>
                                        <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                                        <SelectContent>
                                            {BRANDS.map((b) => (
                                                <SelectItem key={b.id} value={b.id}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`h-2 w-2 rounded-full ${b.dotColor}`} />
                                                        {b.shortName}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" value={newLead.email} onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input value={newLead.phone} onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Deal Value (ETB)</Label>
                                    <Input type="number" value={newLead.value} onChange={(e) => setNewLead(prev => ({ ...prev, value: e.target.value }))} placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Source</Label>
                                    <Select value={newLead.source} onValueChange={(v) => setNewLead(prev => ({ ...prev, source: v as LeadSource }))}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            {(["Website", "Facebook DM", "Referral", "Cross-referral", "Inbound Call", "Event"] as const).map((s) => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Services (comma separated)</Label>
                                <Input value={newLead.services} onChange={(e) => setNewLead(prev => ({ ...prev, services: e.target.value }))} placeholder="e.g. Website, Logo Design" />
                            </div>
                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea value={newLead.notes} onChange={(e) => setNewLead(prev => ({ ...prev, notes: e.target.value }))} placeholder="Initial observations..." rows={3} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateLead}>Add Lead</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    )
}
