"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Plus, MagnifyingGlass, Star, Envelope, Phone } from "@phosphor-icons/react/dist/ssr"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BRANDS, BRAND_MAP, type BrandId } from "@/lib/data/brands"
import { toast } from "sonner"

type FreelancerTier = "Platinum" | "Gold" | "Silver" | "Bronze"

const TIER_COLORS: Record<FreelancerTier, string> = {
    Platinum: "bg-cyan-500/10 text-cyan-500",
    Gold: "bg-amber-500/10 text-amber-500",
    Silver: "bg-slate-400/10 text-slate-400",
    Bronze: "bg-orange-600/10 text-orange-600",
}

type Freelancer = {
    id: string
    name: string
    role: string
    tier: FreelancerTier
    brands: BrandId[]
    rate: number
    rating: number
    projects: number
    available: boolean
    email: string
    phone: string
    specialties: string[]
    portfolio: string
}

const initialFreelancers: Freelancer[] = [
    { id: "F001", name: "Sara Tesfaye", role: "Social Media Manager", tier: "Gold", brands: ["berhan"], rate: 180, rating: 4.8, projects: 12, available: true, email: "sara@gmail.com", phone: "+251 911 234 567", specialties: ["Instagram", "Content Strategy", "Analytics"], portfolio: "behance.net/sara" },
    { id: "F002", name: "Abebe Mulugeta", role: "Content Creator", tier: "Silver", brands: ["berhan", "ethio-influencers"], rate: 140, rating: 4.5, projects: 8, available: true, email: "abebe@gmail.com", phone: "+251 911 345 678", specialties: ["Copywriting", "Facebook", "Email"], portfolio: "portfolio.abebe.com" },
    { id: "F003", name: "Liya Bekele", role: "Graphic Designer", tier: "Platinum", brands: ["tirat"], rate: 250, rating: 4.9, projects: 22, available: false, email: "liya@tirat.com", phone: "+251 911 456 789", specialties: ["Brand Identity", "Print", "Illustration"], portfolio: "dribbble.com/liya" },
    { id: "F004", name: "Dawit Solomon", role: "Full-Stack Developer", tier: "Platinum", brands: ["debo", "ethiobot"], rate: 280, rating: 4.9, projects: 15, available: true, email: "dawit@debo.dev", phone: "+251 911 567 890", specialties: ["Next.js", "Node.js", "PostgreSQL", "Telegram Bots"], portfolio: "github.com/dawit" },
    { id: "F005", name: "Hanna Fikru", role: "Video Editor", tier: "Gold", brands: ["ethio-influencers", "tirat"], rate: 200, rating: 4.7, projects: 18, available: true, email: "hanna@gmail.com", phone: "+251 911 678 901", specialties: ["Premiere Pro", "After Effects", "YouTube"], portfolio: "youtube.com/hanna" },
    { id: "F006", name: "Meron Assefa", role: "Influencer Manager", tier: "Silver", brands: ["ethio-influencers"], rate: 150, rating: 4.4, projects: 6, available: true, email: "meron@ei.com", phone: "+251 911 789 012", specialties: ["Talent Relations", "Campaign Management"], portfolio: "" },
    { id: "F007", name: "Kidist Yohannes", role: "Content Creator", tier: "Gold", brands: ["ethio-influencers"], rate: 170, rating: 4.6, projects: 10, available: false, email: "kidist@gmail.com", phone: "+251 911 890 123", specialties: ["TikTok", "Instagram Reels", "Photography"], portfolio: "instagram.com/kidist" },
    { id: "F008", name: "Abel Kebede", role: "Frontend Developer", tier: "Silver", brands: ["debo"], rate: 160, rating: 4.3, projects: 5, available: true, email: "abel@dev.com", phone: "+251 911 901 234", specialties: ["React", "TailwindCSS", "TypeScript"], portfolio: "abel.dev" },
    { id: "F009", name: "Yonas Desta", role: "Photographer", tier: "Bronze", brands: ["tirat"], rate: 100, rating: 4.0, projects: 3, available: true, email: "yonas@photo.com", phone: "+251 911 012 345", specialties: ["Product Photography", "Corporate"], portfolio: "yonas.photo" },
    { id: "F010", name: "Daniel Girma", role: "Social Media Assistant", tier: "Bronze", brands: ["berhan"], rate: 80, rating: 3.8, projects: 2, available: true, email: "daniel@gmail.com", phone: "+251 911 123 456", specialties: ["Scheduling", "Community Mgmt"], portfolio: "" },
]

const tierOrder: FreelancerTier[] = ["Platinum", "Gold", "Silver", "Bronze"]

function formatETB(v: number) { return v.toLocaleString("en-US") }

export default function TalentPage() {
    const [freelancers, setFreelancers] = useState(initialFreelancers)
    const [search, setSearch] = useState("")
    const [tierFilter, setTierFilter] = useState<string>("all")
    const [brandFilter, setBrandFilter] = useState<string>("all")
    const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newFreelancer, setNewFreelancer] = useState({ name: "", role: "", tier: "" as FreelancerTier | "", rate: "", email: "" })

    const filtered = freelancers.filter((f) => {
        const matchesSearch = search === "" || f.name.toLowerCase().includes(search.toLowerCase()) || f.role.toLowerCase().includes(search.toLowerCase())
        const matchesTier = tierFilter === "all" || f.tier === tierFilter
        const matchesBrand = brandFilter === "all" || f.brands.includes(brandFilter as BrandId)
        return matchesSearch && matchesTier && matchesBrand
    })

    const handleCreate = () => {
        if (!newFreelancer.name || !newFreelancer.role) { toast.error("Name and role are required"); return }
        const fl: Freelancer = {
            id: `F${Date.now().toString().slice(-3)}`,
            name: newFreelancer.name, role: newFreelancer.role,
            tier: (newFreelancer.tier as FreelancerTier) || "Bronze",
            brands: [], rate: parseInt(newFreelancer.rate) || 0,
            rating: 0, projects: 0, available: true,
            email: newFreelancer.email, phone: "", specialties: [], portfolio: "",
        }
        setFreelancers(prev => [...prev, fl])
        setIsCreateOpen(false)
        setNewFreelancer({ name: "", role: "", tier: "", rate: "", email: "" })
        toast.success(`${fl.name} added to talent pool`)
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between border-b border-border/40 px-8 py-5">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">Talent Network</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">{freelancers.length} freelancers across all brands.</p>
                        </div>
                        <Button size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}><Plus className="h-4 w-4" /> Add Freelancer</Button>
                    </header>

                    <div className="px-8 py-4 border-b border-border/40">
                        <div className="grid grid-cols-4 gap-4">
                            {tierOrder.map(tier => {
                                const count = freelancers.filter(f => f.tier === tier).length
                                return (
                                    <button key={tier} onClick={() => setTierFilter(tierFilter === tier ? "all" : tier)} className={`rounded-xl border border-border/60 bg-card p-4 text-left transition-all hover:shadow-md ${tierFilter === tier ? "ring-1 ring-foreground/30" : ""}`}>
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${TIER_COLORS[tier]}`}>{tier}</span>
                                        <p className="text-2xl font-bold mt-2">{count}</p>
                                        <p className="text-[10px] text-muted-foreground">freelancers</p>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="px-8 py-4 border-b border-border/40 flex items-center gap-4">
                        <div className="relative max-w-sm flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search talent..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            {BRANDS.map((b) => (
                                <button key={b.id} onClick={() => setBrandFilter(brandFilter === b.id ? "all" : b.id)} className={`flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium hover:bg-muted transition-colors ${brandFilter === b.id ? "bg-muted border-foreground/30" : ""}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${b.dotColor}`} />{b.shortName}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filtered.map((fl) => (
                                <div key={fl.id} onClick={() => setSelectedFreelancer(fl)} className="rounded-xl border border-border/60 bg-card p-5 hover:shadow-md hover:border-border transition-all cursor-pointer">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                                                {fl.name.split(" ").map(n => n[0]).join("")}
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold">{fl.name}</p>
                                                <p className="text-xs text-muted-foreground">{fl.role}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${TIER_COLORS[fl.tier]}`}>{fl.tier}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mb-3">
                                        {fl.brands.map(bid => {
                                            const b = BRAND_MAP[bid]
                                            return <span key={bid} className={`h-2 w-2 rounded-full ${b.dotColor}`} title={b.shortName} />
                                        })}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center mb-3">
                                        <div className="rounded-lg bg-muted/40 py-2">
                                            <p className="text-xs font-bold">{formatETB(fl.rate)}</p>
                                            <p className="text-[10px] text-muted-foreground">ETB/hr</p>
                                        </div>
                                        <div className="rounded-lg bg-muted/40 py-2">
                                            <p className="text-xs font-bold flex items-center justify-center gap-0.5">{fl.rating} <Star className="h-3 w-3 text-amber-500" /></p>
                                            <p className="text-[10px] text-muted-foreground">Rating</p>
                                        </div>
                                        <div className="rounded-lg bg-muted/40 py-2">
                                            <p className="text-xs font-bold">{fl.projects}</p>
                                            <p className="text-[10px] text-muted-foreground">Projects</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs pt-2 border-t border-border/30">
                                        <span className={`font-semibold ${fl.available ? "text-emerald-500" : "text-red-400"}`}>
                                            {fl.available ? "● Available" : "● Busy"}
                                        </span>
                                        <span className="text-muted-foreground">{fl.specialties.slice(0, 2).join(", ")}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Freelancer Detail Sheet */}
                <Sheet open={!!selectedFreelancer} onOpenChange={(open) => !open && setSelectedFreelancer(null)}>
                    <SheetContent className="sm:max-w-lg overflow-y-auto">
                        {selectedFreelancer && (
                            <>
                                <SheetHeader>
                                    <div className="flex items-center gap-3">
                                        <span className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                                            {selectedFreelancer.name.split(" ").map(n => n[0]).join("")}
                                        </span>
                                        <div>
                                            <SheetTitle>{selectedFreelancer.name}</SheetTitle>
                                            <p className="text-sm text-muted-foreground">{selectedFreelancer.role}</p>
                                        </div>
                                    </div>
                                </SheetHeader>
                                <div className="mt-6 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${TIER_COLORS[selectedFreelancer.tier]}`}>{selectedFreelancer.tier}</span>
                                        <span className={`text-sm font-semibold ${selectedFreelancer.available ? "text-emerald-500" : "text-red-400"}`}>
                                            {selectedFreelancer.available ? "Available" : "Currently Busy"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="rounded-xl bg-muted/30 border border-border/40 p-4 text-center">
                                            <p className="text-xl font-bold">{formatETB(selectedFreelancer.rate)}</p>
                                            <p className="text-[10px] text-muted-foreground">ETB/hr</p>
                                        </div>
                                        <div className="rounded-xl bg-muted/30 border border-border/40 p-4 text-center">
                                            <p className="text-xl font-bold flex items-center justify-center gap-1">{selectedFreelancer.rating} <Star className="h-4 w-4 text-amber-500" /></p>
                                            <p className="text-[10px] text-muted-foreground">Rating</p>
                                        </div>
                                        <div className="rounded-xl bg-muted/30 border border-border/40 p-4 text-center">
                                            <p className="text-xl font-bold">{selectedFreelancer.projects}</p>
                                            <p className="text-[10px] text-muted-foreground">Projects</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Brand Associations</h4>
                                        <div className="flex gap-2">
                                            {selectedFreelancer.brands.map(bid => {
                                                const b = BRAND_MAP[bid]
                                                return (
                                                    <span key={bid} className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-lg text-xs font-medium">
                                                        <span className={`h-2 w-2 rounded-full ${b.dotColor}`} />{b.shortName}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Specialties</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedFreelancer.specialties.map(s => <span key={s} className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-[10px] font-medium">{s}</span>)}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contact</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm"><Envelope className="h-4 w-4 text-muted-foreground" /> {selectedFreelancer.email}</div>
                                            <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {selectedFreelancer.phone}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button size="sm" className="flex-1" onClick={() => { toast.success("Message sent (mock)"); setSelectedFreelancer(null) }}>Send Message</Button>
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                                            setFreelancers(prev => prev.map(f => f.id === selectedFreelancer.id ? { ...f, available: !f.available } : f))
                                            setSelectedFreelancer(null)
                                            toast.success("Availability toggled")
                                        }}>Toggle Availability</Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </SheetContent>
                </Sheet>

                {/* Add Freelancer Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>Add Freelancer</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Name *</Label><Input value={newFreelancer.name} onChange={(e) => setNewFreelancer(p => ({ ...p, name: e.target.value }))} /></div>
                                <div className="space-y-2"><Label>Role *</Label><Input value={newFreelancer.role} onChange={(e) => setNewFreelancer(p => ({ ...p, role: e.target.value }))} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tier</Label>
                                    <Select value={newFreelancer.tier} onValueChange={(v) => setNewFreelancer(p => ({ ...p, tier: v as FreelancerTier }))}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>{tierOrder.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2"><Label>Rate (ETB/hr)</Label><Input type="number" value={newFreelancer.rate} onChange={(e) => setNewFreelancer(p => ({ ...p, rate: e.target.value }))} /></div>
                            </div>
                            <div className="space-y-2"><Label>Email</Label><Input value={newFreelancer.email} onChange={(e) => setNewFreelancer(p => ({ ...p, email: e.target.value }))} /></div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>Add Freelancer</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    )
}
