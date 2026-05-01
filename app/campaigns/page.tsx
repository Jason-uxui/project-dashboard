"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Plus, MagnifyingGlass, TrendUp, Pause, Play, Pencil } from "@phosphor-icons/react/dist/ssr"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BRAND_MAP, BRANDS, type BrandId } from "@/lib/data/brands"
import { toast } from "sonner"

type Campaign = {
    id: string
    name: string
    brand: BrandId
    status: string
    influencers: number
    posts: number
    reach: string
    engagement: string
    budget: number
    spent: number
    startDate: string
    endDate: string
}

const initialCampaigns: Campaign[] = [
    { id: "C001", name: "Valentine's Day 2026", brand: "ethio-influencers", status: "Active", influencers: 3, posts: 12, reach: "45K", engagement: "3.8%", budget: 35000, spent: 28000, startDate: "Feb 1", endDate: "Feb 14" },
    { id: "C002", name: "Ethio Telecom — New SIM Launch", brand: "berhan", status: "Active", influencers: 5, posts: 20, reach: "120K", engagement: "4.2%", budget: 80000, spent: 52000, startDate: "Feb 10", endDate: "Mar 10" },
    { id: "C003", name: "Dashen Bank — Youth Savings", brand: "berhan", status: "Planning", influencers: 4, posts: 0, reach: "—", engagement: "—", budget: 45000, spent: 0, startDate: "Mar 1", endDate: "Mar 31" },
    { id: "C004", name: "Habesha Beer — Festival Season", brand: "ethio-influencers", status: "Active", influencers: 6, posts: 18, reach: "200K", engagement: "5.1%", budget: 120000, spent: 95000, startDate: "Jan 15", endDate: "Feb 28" },
    { id: "C005", name: "BlueMoon Hotel — Rebrand Awareness", brand: "tirat", status: "Completed", influencers: 2, posts: 8, reach: "30K", engagement: "2.9%", budget: 25000, spent: 24500, startDate: "Jan 5", endDate: "Jan 25" },
    { id: "C006", name: "Ride Ethiopia — App Launch", brand: "debo", status: "Planning", influencers: 0, posts: 0, reach: "—", engagement: "—", budget: 55000, spent: 0, startDate: "Mar 15", endDate: "Apr 15" },
]

const statusColor: Record<string, string> = {
    Active: "bg-emerald-500/10 text-emerald-500",
    Planning: "bg-blue-500/10 text-blue-500",
    Completed: "bg-zinc-500/10 text-zinc-400",
    Paused: "bg-amber-500/10 text-amber-500",
}

function formatETB(value: number) {
    return value.toLocaleString("en-US")
}

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState(initialCampaigns)
    const [search, setSearch] = useState("")
    const [brandFilter, setBrandFilter] = useState<string>("all")
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newCampaign, setNewCampaign] = useState({ name: "", brand: "" as BrandId | "", budget: "", startDate: "", endDate: "" })

    const filtered = campaigns.filter((c) => {
        const matchesSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase())
        const matchesBrand = brandFilter === "all" || c.brand === brandFilter
        return matchesSearch && matchesBrand
    })

    const totalBudget = filtered.reduce((sum, c) => sum + c.budget, 0)
    const totalSpent = filtered.reduce((sum, c) => sum + c.spent, 0)
    const activeCampaigns = filtered.filter((c) => c.status === "Active").length

    const handleCreate = () => {
        if (!newCampaign.name || !newCampaign.brand) { toast.error("Name and brand are required"); return }
        const campaign: Campaign = {
            id: `C${Date.now()}`,
            name: newCampaign.name,
            brand: newCampaign.brand as BrandId,
            status: "Planning",
            influencers: 0, posts: 0, reach: "—", engagement: "—",
            budget: parseInt(newCampaign.budget) || 0, spent: 0,
            startDate: newCampaign.startDate || "TBD", endDate: newCampaign.endDate || "TBD",
        }
        setCampaigns(prev => [...prev, campaign])
        setIsCreateOpen(false)
        setNewCampaign({ name: "", brand: "", budget: "", startDate: "", endDate: "" })
        toast.success(`Campaign "${campaign.name}" created`)
    }

    const toggleStatus = (campaign: Campaign) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id !== campaign.id) return c
            const newStatus = c.status === "Active" ? "Paused" : c.status === "Paused" ? "Active" : c.status
            return { ...c, status: newStatus }
        }))
        setSelectedCampaign(null)
        toast.success(`Campaign status updated`)
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between border-b border-border/40 px-8 py-5">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">Campaigns</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">Influencer campaigns across all brands.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}>
                                <Plus className="h-4 w-4" /> New Campaign
                            </Button>
                        </div>
                    </header>

                    <div className="px-8 py-5 border-b border-border/40">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="rounded-xl border border-border/60 bg-card p-4">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Campaigns</span>
                                <p className="text-2xl font-bold mt-1">{activeCampaigns}</p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-card p-4">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Budget</span>
                                <p className="text-2xl font-bold mt-1">{formatETB(totalBudget)} <span className="text-sm font-normal text-muted-foreground">ETB</span></p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-card p-4">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Spent</span>
                                <p className="text-2xl font-bold mt-1">{formatETB(totalSpent)} <span className="text-sm font-normal text-muted-foreground">ETB</span></p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-card p-4">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg Engagement</span>
                                <p className="text-2xl font-bold mt-1 flex items-center gap-1">4.0% <TrendUp className="h-4 w-4 text-emerald-500" /></p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-4 border-b border-border/40 flex items-center gap-4">
                        <div className="relative max-w-sm flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search campaigns..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setBrandFilter("all")} className={`flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium hover:bg-muted transition-colors ${brandFilter === "all" ? "bg-muted border-foreground/30" : ""}`}>
                                All
                            </button>
                            {BRANDS.map((b) => (
                                <button key={b.id} onClick={() => setBrandFilter(brandFilter === b.id ? "all" : b.id)} className={`flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium hover:bg-muted transition-colors ${brandFilter === b.id ? "bg-muted border-foreground/30" : ""}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${b.dotColor}`} />
                                    {b.shortName}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filtered.map((campaign) => {
                                const brand = BRAND_MAP[campaign.brand]
                                const budgetPercent = campaign.budget > 0 ? Math.round((campaign.spent / campaign.budget) * 100) : 0
                                return (
                                    <div key={campaign.id} onClick={() => setSelectedCampaign(campaign)} className="rounded-xl border border-border/60 bg-card p-5 hover:shadow-md hover:border-border transition-all cursor-pointer group active:scale-[0.98]">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${brand.dotColor}`} />
                                                <span className="text-[10px] font-semibold text-muted-foreground">{brand.shortName}</span>
                                            </div>
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor[campaign.status]}`}>
                                                {campaign.status}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-semibold mb-3 truncate">{campaign.name}</h3>
                                        <div className="grid grid-cols-3 gap-2 text-center mb-3">
                                            <div className="rounded-lg bg-muted/40 py-2">
                                                <p className="text-xs font-bold">{campaign.influencers}</p>
                                                <p className="text-[10px] text-muted-foreground">Influencers</p>
                                            </div>
                                            <div className="rounded-lg bg-muted/40 py-2">
                                                <p className="text-xs font-bold">{campaign.posts}</p>
                                                <p className="text-[10px] text-muted-foreground">Posts</p>
                                            </div>
                                            <div className="rounded-lg bg-muted/40 py-2">
                                                <p className="text-xs font-bold">{campaign.reach}</p>
                                                <p className="text-[10px] text-muted-foreground">Reach</p>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                                                <span>{formatETB(campaign.spent)} spent</span>
                                                <span>{formatETB(campaign.budget)} budget</span>
                                            </div>
                                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${brand.color} transition-all`} style={{ width: `${budgetPercent}%` }} />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
                                            <span>{campaign.startDate} → {campaign.endDate}</span>
                                            {campaign.engagement !== "—" && (
                                                <span className="font-semibold text-foreground">{campaign.engagement} eng.</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Campaign Detail Sheet */}
                <Sheet open={!!selectedCampaign} onOpenChange={(open) => !open && setSelectedCampaign(null)}>
                    <SheetContent className="sm:max-w-lg overflow-y-auto">
                        {selectedCampaign && (() => {
                            const brand = BRAND_MAP[selectedCampaign.brand]
                            const budgetPercent = selectedCampaign.budget > 0 ? Math.round((selectedCampaign.spent / selectedCampaign.budget) * 100) : 0
                            return (
                                <>
                                    <SheetHeader>
                                        <div className="flex items-center gap-2">
                                            <span className={`h-3 w-3 rounded-full ${brand.dotColor}`} />
                                            <SheetTitle className="text-lg">{selectedCampaign.name}</SheetTitle>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-muted-foreground">{brand.name}</span>
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor[selectedCampaign.status]}`}>{selectedCampaign.status}</span>
                                        </div>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-xl bg-muted/30 border border-border/40 p-4 text-center">
                                                <p className="text-2xl font-bold">{selectedCampaign.influencers}</p>
                                                <p className="text-xs text-muted-foreground">Influencers</p>
                                            </div>
                                            <div className="rounded-xl bg-muted/30 border border-border/40 p-4 text-center">
                                                <p className="text-2xl font-bold">{selectedCampaign.posts}</p>
                                                <p className="text-xs text-muted-foreground">Posts</p>
                                            </div>
                                            <div className="rounded-xl bg-muted/30 border border-border/40 p-4 text-center">
                                                <p className="text-2xl font-bold">{selectedCampaign.reach}</p>
                                                <p className="text-xs text-muted-foreground">Reach</p>
                                            </div>
                                            <div className="rounded-xl bg-muted/30 border border-border/40 p-4 text-center">
                                                <p className="text-2xl font-bold">{selectedCampaign.engagement}</p>
                                                <p className="text-xs text-muted-foreground">Engagement</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Budget</h4>
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span>{formatETB(selectedCampaign.spent)} spent</span>
                                                <span className="font-bold">{formatETB(selectedCampaign.budget)} ETB total</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${brand.color}`} style={{ width: `${budgetPercent}%` }} />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">{budgetPercent}% utilized · {formatETB(selectedCampaign.budget - selectedCampaign.spent)} ETB remaining</p>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Timeline</h4>
                                            <p className="text-sm">{selectedCampaign.startDate} → {selectedCampaign.endDate}</p>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            {(selectedCampaign.status === "Active" || selectedCampaign.status === "Paused") && (
                                                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => toggleStatus(selectedCampaign)}>
                                                    {selectedCampaign.status === "Active" ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Resume</>}
                                                </Button>
                                            )}
                                            <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => { toast.info("Edit mode (mock)"); setSelectedCampaign(null) }}>
                                                <Pencil className="h-4 w-4" /> Edit
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )
                        })()}
                    </SheetContent>
                </Sheet>

                {/* Create Campaign Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>New Campaign</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label>Campaign Name *</Label>
                                <Input value={newCampaign.name} onChange={(e) => setNewCampaign(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Spring Collection 2026" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Brand *</Label>
                                    <Select value={newCampaign.brand} onValueChange={(v) => setNewCampaign(p => ({ ...p, brand: v as BrandId }))}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            {BRANDS.map(b => <SelectItem key={b.id} value={b.id}><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${b.dotColor}`} />{b.shortName}</div></SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Budget (ETB)</Label>
                                    <Input type="number" value={newCampaign.budget} onChange={(e) => setNewCampaign(p => ({ ...p, budget: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input value={newCampaign.startDate} onChange={(e) => setNewCampaign(p => ({ ...p, startDate: e.target.value }))} placeholder="e.g. Mar 1" />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input value={newCampaign.endDate} onChange={(e) => setNewCampaign(p => ({ ...p, endDate: e.target.value }))} placeholder="e.g. Mar 31" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>Create Campaign</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    )
}
