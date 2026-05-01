"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { MagnifyingGlass, BookOpen, Check, CaretRight } from "@phosphor-icons/react/dist/ssr"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { toast } from "sonner"

type PlaybookCategory = "Onboarding" | "Operations" | "Sales" | "Production" | "Finance" | "Compliance"

type PlaybookItem = {
    id: string
    title: string
    category: PlaybookCategory
    description: string
    steps: string[]
    lastUpdated: string
    owner: string
}

const playbookItems: PlaybookItem[] = [
    { id: "PB-001", title: "Client Onboarding Process", category: "Onboarding", description: "Step-by-step process for onboarding new clients, from initial meeting to project kickoff.", steps: ["Discovery call", "Send proposal", "Get contract signed", "Collect brand assets", "Setup project in CaravanOS", "Kick-off meeting", "Assign team members"], lastUpdated: "Feb 1", owner: "Haz" },
    { id: "PB-002", title: "New Brand Setup", category: "Onboarding", description: "How to properly set up a new brand entity across all systems.", steps: ["Register brand name", "Create brand identity brief", "Assign to Tirat for design", "Setup social accounts", "Add to CaravanOS", "Create service packages"], lastUpdated: "Jan 20", owner: "Haz" },
    { id: "PB-003", title: "Content Approval Workflow", category: "Production", description: "How content moves from ideation to publication across all brands.", steps: ["Idea submission", "Brief creation", "Assignment to creator", "First draft", "Internal review", "Client review", "Revisions", "Schedule in platform", "Publish", "Performance report"], lastUpdated: "Feb 5", owner: "Sara T." },
    { id: "PB-004", title: "Invoice & Payment Collection", category: "Finance", description: "Process for issuing invoices and collecting payments from clients.", steps: ["Generate invoice in CaravanOS", "Send via email/WA", "Follow up after 3 days", "Second follow-up at 7 days", "Escalate at 14 days", "Mark as paid when received"], lastUpdated: "Jan 15", owner: "Haz" },
    { id: "PB-005", title: "Freelancer Onboarding", category: "Onboarding", description: "How to bring new freelancers into the Caravan Digital network.", steps: ["Portfolio review", "Skills assessment", "Rate negotiation", "Contract signing", "Add to talent pool", "Brand assignment", "First project briefing"], lastUpdated: "Jan 25", owner: "Haz" },
    { id: "PB-006", title: "Campaign Execution — Influencer", category: "Production", description: "End-to-end process for running an influencer marketing campaign.", steps: ["Client brief", "Influencer shortlisting", "Rate negotiation", "Contract + NDA", "Content briefing", "Draft review", "Posting schedule", "Go live", "Performance tracking", "Client report"], lastUpdated: "Feb 10", owner: "Meron A." },
    { id: "PB-007", title: "Lead Qualification Process", category: "Sales", description: "How to qualify and score incoming leads across all brands.", steps: ["Initial contact captured", "Brand alignment check", "Budget assessment", "Timeline review", "Score assignment (1-100)", "Route to correct brand", "Follow up within 24hrs"], lastUpdated: "Feb 8", owner: "Haz" },
    { id: "PB-008", title: "Project Delivery Checklist", category: "Operations", description: "Checklist for delivering completed projects to clients.", steps: ["Final QA review", "Client presentation prep", "Deliverables packaged", "Handoff meeting", "Training session (if applicable)", "Feedback collection", "Invoice sent", "Case study created"], lastUpdated: "Jan 30", owner: "Haz" },
    { id: "PB-009", title: "Monthly Reporting Procedure", category: "Operations", description: "How to generate and deliver monthly performance reports.", steps: ["Collect analytics from all platforms", "Brand-level aggregation", "Revenue reconciliation", "Content performance summary", "Client report generation", "Internal team review", "Client presentation"], lastUpdated: "Feb 1", owner: "Sara T." },
    { id: "PB-010", title: "Tax & Compliance Checklist", category: "Compliance", description: "Monthly and quarterly compliance tasks for all brands.", steps: ["Revenue calculation per brand", "Tax withholding computation", "TIN renewal check", "Invoice audit", "Business license renewal tracking", "Annual filing prep"], lastUpdated: "Jan 5", owner: "Haz" },
]

const categoryColors: Record<PlaybookCategory, string> = {
    Onboarding: "bg-blue-500/10 text-blue-500",
    Operations: "bg-emerald-500/10 text-emerald-500",
    Sales: "bg-orange-500/10 text-orange-500",
    Production: "bg-purple-500/10 text-purple-500",
    Finance: "bg-amber-500/10 text-amber-500",
    Compliance: "bg-red-500/10 text-red-400",
}

export default function PlaybookPage() {
    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [selectedItem, setSelectedItem] = useState<PlaybookItem | null>(null)
    const [completedSteps, setCompletedSteps] = useState<Record<string, boolean[]>>({})

    const filtered = playbookItems.filter((p) => {
        const matchesSearch = search === "" || p.title.toLowerCase().includes(search.toLowerCase())
        const matchesCat = categoryFilter === "all" || p.category === categoryFilter
        return matchesSearch && matchesCat
    })

    const categories: PlaybookCategory[] = [...new Set(playbookItems.map(p => p.category))]

    const toggleStep = (itemId: string, stepIdx: number) => {
        setCompletedSteps(prev => {
            const current = prev[itemId] || new Array(playbookItems.find(p => p.id === itemId)!.steps.length).fill(false)
            const updated = [...current]
            updated[stepIdx] = !updated[stepIdx]
            return { ...prev, [itemId]: updated }
        })
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between border-b border-border/40 px-8 py-5">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">Operations Playbook</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">SOPs, checklists, and process documentation.</p>
                        </div>
                    </header>

                    <div className="px-8 py-4 border-b border-border/40 flex items-center gap-4">
                        <div className="relative max-w-sm flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search playbook..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCategoryFilter("all")} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors ${categoryFilter === "all" ? "bg-muted border-foreground/30" : "border-border hover:bg-muted"}`}>All</button>
                            {categories.map(c => (
                                <button key={c} onClick={() => setCategoryFilter(categoryFilter === c ? "all" : c)} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors ${categoryFilter === c ? "bg-muted border-foreground/30" : "border-border hover:bg-muted"}`}>{c}</button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filtered.map((item) => {
                                const steps = completedSteps[item.id] || []
                                const completedCount = steps.filter(Boolean).length
                                return (
                                    <div key={item.id} onClick={() => setSelectedItem(item)} className="rounded-xl border border-border/60 bg-card p-5 hover:shadow-md hover:border-border transition-all cursor-pointer group">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColors[item.category]}`}>{item.category}</span>
                                            <span className="text-[10px] text-muted-foreground">{item.steps.length} steps</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            <h3 className="text-sm font-semibold">{item.title}</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                                        {completedCount > 0 && (
                                            <div className="mb-3">
                                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.round((completedCount / item.steps.length) * 100)}%` }} />
                                                </div>
                                                <p className="text-[10px] text-muted-foreground mt-1">{completedCount}/{item.steps.length} completed</p>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
                                            <span>By {item.owner}</span>
                                            <span className="flex items-center gap-0.5 group-hover:text-foreground transition-colors">Open <CaretRight className="h-3 w-3" /></span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Playbook Item Detail Sheet */}
                <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                    <SheetContent className="sm:max-w-lg overflow-y-auto">
                        {selectedItem && (() => {
                            const steps = completedSteps[selectedItem.id] || new Array(selectedItem.steps.length).fill(false)
                            const completedCount = steps.filter(Boolean).length
                            return (
                                <>
                                    <SheetHeader>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                                            <SheetTitle>{selectedItem.title}</SheetTitle>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColors[selectedItem.category]}`}>{selectedItem.category}</span>
                                            <span className="text-xs text-muted-foreground">By {selectedItem.owner} · Updated {selectedItem.lastUpdated}</span>
                                        </div>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        <p className="text-sm text-muted-foreground">{selectedItem.description}</p>

                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steps ({completedCount}/{selectedItem.steps.length})</h4>
                                                {completedCount === selectedItem.steps.length && (
                                                    <span className="text-[10px] font-bold text-emerald-500">✓ All Complete</span>
                                                )}
                                            </div>
                                            <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
                                                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${selectedItem.steps.length > 0 ? Math.round((completedCount / selectedItem.steps.length) * 100) : 0}%` }} />
                                            </div>
                                            <div className="space-y-1">
                                                {selectedItem.steps.map((step, i) => (
                                                    <button key={i} onClick={(e) => { e.stopPropagation(); toggleStep(selectedItem.id, i) }} className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${steps[i] ? "bg-emerald-500/5" : "hover:bg-muted/50"}`}>
                                                        <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${steps[i] ? "bg-emerald-500 border-emerald-500" : "border-border"}`}>
                                                            {steps[i] && <Check className="h-3 w-3 text-white" />}
                                                        </span>
                                                        <span className={`text-sm ${steps[i] ? "line-through text-muted-foreground" : ""}`}>{step}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
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
