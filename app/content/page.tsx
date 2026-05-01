"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Plus, MagnifyingGlass, Pencil, Check, X as XIcon } from "@phosphor-icons/react/dist/ssr"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BRANDS, BRAND_MAP, CONTENT_STATUS_COLORS, CONTENT_STATUSES, type BrandId, type ContentStatus } from "@/lib/data/brands"
import { toast } from "sonner"

type ContentPost = {
    id: string
    title: string
    brand: BrandId
    platform: string
    status: ContentStatus
    date: string
    assignee: string
    pillar: string
    caption: string
    hashtags: string[]
}

const initialPosts: ContentPost[] = [
    { id: "C-001", title: "New SIM Campaign — Carousel", brand: "berhan", platform: "Instagram", status: "Published", date: "Feb 10", assignee: "Sara T.", pillar: "Promotion", caption: "Introducing the new SIM plans from Ethio Telecom! 🚀", hashtags: ["#EthioTelecom", "#NewSIM", "#Ethiopia"] },
    { id: "C-002", title: "Ethio Telecom — Service Tips", brand: "berhan", platform: "Facebook", status: "Scheduled", date: "Feb 17", assignee: "Abebe M.", pillar: "Education", caption: "5 tips to get the most out of your telecom service", hashtags: ["#TelecomTips", "#EthioTelecom"] },
    { id: "C-003", title: "BlueMoon Hotel — Brand Reveal Reel", brand: "tirat", platform: "Instagram", status: "In Review", date: "Feb 18", assignee: "Liya B.", pillar: "Behind the Scenes", caption: "The big reveal is coming... ✨", hashtags: ["#BlueMoon", "#Rebrand", "#Hotel"] },
    { id: "C-004", title: "Ride Ethiopia — App Feature Demo", brand: "debo", platform: "TikTok", status: "Brief", date: "Feb 19", assignee: "Dawit S.", pillar: "Promotion", caption: "Check out the new booking feature!", hashtags: ["#RideEthiopia", "#TechInEthiopia"] },
    { id: "C-005", title: "Valentine Story Template Pack", brand: "ethio-influencers", platform: "Instagram Stories", status: "Published", date: "Feb 14", assignee: "Meron A.", pillar: "Entertainment", caption: "❤️ Love is in the air. Grab these free templates!", hashtags: ["#Valentine", "#Templates", "#Love"] },
    { id: "C-006", title: "Dashen Bank — Bot Demo Video", brand: "ethiobot", platform: "YouTube", status: "In Review", date: "Feb 20", assignee: "Hanna F.", pillar: "Education", caption: "See our Telegram bot in action for Dashen Bank", hashtags: ["#Chatbot", "#DashenBank", "#AI"] },
    { id: "C-007", title: "Monday Motivation — Team Spotlight", brand: "berhan", platform: "LinkedIn", status: "Idea", date: "Feb 24", assignee: "—", pillar: "Motivation", caption: "", hashtags: [] },
    { id: "C-008", title: "Anbessa Shoe — Logo Process Reel", brand: "tirat", platform: "Instagram Reels", status: "Scheduled", date: "Feb 21", assignee: "Liya B.", pillar: "Behind the Scenes", caption: "From sketch to final design — watch the process 🎨", hashtags: ["#LogoDesign", "#Process", "#AnbessaShoe"] },
    { id: "C-009", title: "Habesha Beer — Festival Recap", brand: "ethio-influencers", platform: "Facebook", status: "Published", date: "Feb 12", assignee: "Kidist Y.", pillar: "Recap", caption: "What a festival season! Here's the highlights 🍺", hashtags: ["#HabeshaBeer", "#Festival", "#Recap"] },
    { id: "C-010", title: "Weekly Automation Tip #7", brand: "ethiobot", platform: "Telegram", status: "Scheduled", date: "Feb 22", assignee: "Dawit S.", pillar: "Education", caption: "This week: auto-replies for common questions", hashtags: ["#Automation", "#Tips"] },
    { id: "C-011", title: "Client Onboarding — Welcome Email", brand: "berhan", platform: "Email", status: "Brief", date: "Feb 23", assignee: "Sara T.", pillar: "Community", caption: "Welcome to Caravan Digital — here's what to expect", hashtags: [] },
    { id: "C-012", title: "Behind-the-scenes — Studio Day", brand: "tirat", platform: "Instagram Stories", status: "Idea", date: "Feb 25", assignee: "—", pillar: "Behind the Scenes", caption: "", hashtags: [] },
    { id: "C-013", title: "Awash Bank — Social Kickoff Post", brand: "berhan", platform: "Facebook", status: "Brief", date: "Feb 26", assignee: "Abebe M.", pillar: "Promotion", caption: "Exciting things coming for Awash Bank customers!", hashtags: ["#AwashBank", "#Social"] },
    { id: "C-014", title: "Influencer Spotlight — Selam H.", brand: "ethio-influencers", platform: "Instagram", status: "Idea", date: "Feb 27", assignee: "—", pillar: "Community", caption: "", hashtags: [] },
    { id: "C-015", title: "Varnero Tech — Dev Progress Update", brand: "debo", platform: "LinkedIn", status: "Idea", date: "Feb 28", assignee: "—", pillar: "Behind the Scenes", caption: "", hashtags: [] },
]

const platformIcons: Record<string, string> = {
    Instagram: "📸", Facebook: "📘", TikTok: "🎵", LinkedIn: "💼", YouTube: "📹",
    Telegram: "✈️", Email: "✉️", "Instagram Stories": "📱", "Instagram Reels": "🎬",
}

export default function ContentPage() {
    const [posts, setPosts] = useState(initialPosts)
    const [search, setSearch] = useState("")
    const [brandFilter, setBrandFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newPost, setNewPost] = useState({ title: "", brand: "" as BrandId | "", platform: "", caption: "", date: "", pillar: "" })

    const filtered = posts.filter((p) => {
        const matchesSearch = search === "" || p.title.toLowerCase().includes(search.toLowerCase())
        const matchesBrand = brandFilter === "all" || p.brand === brandFilter
        const matchesStatus = statusFilter === "all" || p.status === statusFilter
        return matchesSearch && matchesBrand && matchesStatus
    })

    const statusCounts = CONTENT_STATUSES.map(s => ({ status: s, count: posts.filter(p => p.status === s).length }))

    const handleCreate = () => {
        if (!newPost.title || !newPost.brand) { toast.error("Title and brand are required"); return }
        const post: ContentPost = {
            id: `C-${Date.now().toString().slice(-3)}`,
            title: newPost.title, brand: newPost.brand as BrandId,
            platform: newPost.platform || "Instagram", status: "Idea",
            date: newPost.date || "TBD", assignee: "—", pillar: newPost.pillar || "Promotion",
            caption: newPost.caption, hashtags: [],
        }
        setPosts(prev => [...prev, post])
        setIsCreateOpen(false)
        setNewPost({ title: "", brand: "", platform: "", caption: "", date: "", pillar: "" })
        toast.success(`Post "${post.title}" created`)
    }

    const updateStatus = (post: ContentPost, newStatus: ContentStatus) => {
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: newStatus } : p))
        setSelectedPost(null)
        toast.success(`"${post.title}" → ${newStatus}`)
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between border-b border-border/40 px-8 py-5">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">Content Factory</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">Content pipeline across all brands and platforms.</p>
                        </div>
                        <Button size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}>
                            <Plus className="h-4 w-4" /> New Post
                        </Button>
                    </header>

                    {/* Status pipeline */}
                    <div className="px-8 py-4 border-b border-border/40 flex items-center gap-3">
                        <button onClick={() => setStatusFilter("all")} className={`rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${statusFilter === "all" ? "bg-foreground text-background border-foreground" : "border-border hover:bg-muted"}`}>
                            All ({posts.length})
                        </button>
                        {statusCounts.map(({ status, count }) => (
                            <button key={status} onClick={() => setStatusFilter(statusFilter === status ? "all" : status)} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${statusFilter === status ? "bg-muted border-foreground/30" : "border-border hover:bg-muted"}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${CONTENT_STATUS_COLORS[status].dot}`} />
                                {status} ({count})
                            </button>
                        ))}
                    </div>

                    <div className="px-8 py-4 border-b border-border/40 flex items-center gap-4">
                        <div className="relative max-w-sm flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search content..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            {BRANDS.map((b) => (
                                <button key={b.id} onClick={() => setBrandFilter(brandFilter === b.id ? "all" : b.id)} className={`flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium hover:bg-muted transition-colors ${brandFilter === b.id ? "bg-muted border-foreground/30" : ""}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${b.dotColor}`} />
                                    {b.shortName}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/40 text-xs text-muted-foreground">
                                    <th className="text-left font-medium px-8 py-3">Post</th>
                                    <th className="text-left font-medium px-4 py-3">Platform</th>
                                    <th className="text-left font-medium px-4 py-3">Status</th>
                                    <th className="text-left font-medium px-4 py-3">Pillar</th>
                                    <th className="text-left font-medium px-4 py-3">Date</th>
                                    <th className="text-left font-medium px-4 py-3">Assignee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((post) => {
                                    const brand = BRAND_MAP[post.brand]
                                    return (
                                        <tr key={post.id} onClick={() => setSelectedPost(post)} className="border-b border-border/20 hover:bg-muted/30 transition-colors cursor-pointer">
                                            <td className="px-8 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <span className={`h-2 w-2 rounded-full shrink-0 ${brand.dotColor}`} />
                                                    <div>
                                                        <p className="text-sm font-medium">{post.title}</p>
                                                        <p className="text-[11px] text-muted-foreground">{post.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs">
                                                <span className="flex items-center gap-1.5">{platformIcons[post.platform] || "📄"} {post.platform}</span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${CONTENT_STATUS_COLORS[post.status].bg} ${CONTENT_STATUS_COLORS[post.status].text}`}>{post.status}</span>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-muted-foreground">{post.pillar}</td>
                                            <td className="px-4 py-3.5 text-xs text-muted-foreground">{post.date}</td>
                                            <td className="px-4 py-3.5 text-xs text-muted-foreground">{post.assignee}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Post Detail Sheet */}
                <Sheet open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
                    <SheetContent className="sm:max-w-lg overflow-y-auto">
                        {selectedPost && (() => {
                            const brand = BRAND_MAP[selectedPost.brand]
                            const statusIdx = CONTENT_STATUSES.indexOf(selectedPost.status)
                            const nextStatus: ContentStatus | null = statusIdx < CONTENT_STATUSES.length - 1 ? CONTENT_STATUSES[statusIdx + 1] : null
                            return (
                                <>
                                    <SheetHeader>
                                        <div className="flex items-center gap-2">
                                            <span className={`h-3 w-3 rounded-full ${brand.dotColor}`} />
                                            <SheetTitle>{selectedPost.title}</SheetTitle>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{brand.shortName} · {selectedPost.platform} · {selectedPost.id}</p>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${CONTENT_STATUS_COLORS[selectedPost.status].bg} ${CONTENT_STATUS_COLORS[selectedPost.status].text}`}>{selectedPost.status}</span>
                                            <span className="text-xs text-muted-foreground">· {selectedPost.date}</span>
                                        </div>

                                        {/* Status pipeline */}
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pipeline</h4>
                                            <div className="flex items-center gap-1">
                                                {CONTENT_STATUSES.map((s, i) => (
                                                    <div key={s} className={`flex-1 h-2 rounded-full ${i <= statusIdx ? brand.color : "bg-muted"}`} />
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Caption</h4>
                                            <p className="text-sm bg-muted/30 rounded-lg p-3 border border-border/40">{selectedPost.caption || "No caption yet"}</p>
                                        </div>

                                        {selectedPost.hashtags.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hashtags</h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {selectedPost.hashtags.map(h => <span key={h} className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-[10px] font-medium">{h}</span>)}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><span className="text-xs text-muted-foreground">Pillar</span><p className="font-medium">{selectedPost.pillar}</p></div>
                                            <div><span className="text-xs text-muted-foreground">Assignee</span><p className="font-medium">{selectedPost.assignee}</p></div>
                                            <div><span className="text-xs text-muted-foreground">Platform</span><p className="font-medium">{platformIcons[selectedPost.platform]} {selectedPost.platform}</p></div>
                                            <div><span className="text-xs text-muted-foreground">Scheduled</span><p className="font-medium">{selectedPost.date}</p></div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            {selectedPost.status === "In Review" && (
                                                <>
                                                    <Button size="sm" className="flex-1 gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => updateStatus(selectedPost, "Scheduled")}>
                                                        <Check className="h-4 w-4" /> Approve
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="flex-1 gap-1 text-red-500 border-red-500/30 hover:bg-red-500/10" onClick={() => updateStatus(selectedPost, "Brief")}>
                                                        <XIcon className="h-4 w-4" /> Reject
                                                    </Button>
                                                </>
                                            )}
                                            {nextStatus && selectedPost.status !== "In Review" && (
                                                <Button size="sm" className="flex-1" onClick={() => updateStatus(selectedPost, nextStatus)}>
                                                    Move to {nextStatus} →
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )
                        })()}
                    </SheetContent>
                </Sheet>

                {/* Create Post Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>New Post</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label>Title *</Label>
                                <Input value={newPost.title} onChange={(e) => setNewPost(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Spring Campaign Post" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Brand *</Label>
                                    <Select value={newPost.brand} onValueChange={(v) => setNewPost(p => ({ ...p, brand: v as BrandId }))}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>{BRANDS.map(b => <SelectItem key={b.id} value={b.id}>{b.shortName}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Platform</Label>
                                    <Select value={newPost.platform} onValueChange={(v) => setNewPost(p => ({ ...p, platform: v }))}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(platformIcons).map(p => <SelectItem key={p} value={p}>{platformIcons[p]} {p}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Caption</Label>
                                <Textarea value={newPost.caption} onChange={(e) => setNewPost(p => ({ ...p, caption: e.target.value }))} rows={3} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input value={newPost.date} onChange={(e) => setNewPost(p => ({ ...p, date: e.target.value }))} placeholder="e.g. Mar 1" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Pillar</Label>
                                    <Select value={newPost.pillar} onValueChange={(v) => setNewPost(p => ({ ...p, pillar: v }))}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            {["Motivation", "Education", "Behind the Scenes", "Promotion", "Community", "Entertainment", "Recap"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>Create Post</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    )
}
