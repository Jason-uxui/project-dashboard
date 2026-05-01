"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Plus, MagnifyingGlass, Funnel, Pencil } from "@phosphor-icons/react/dist/ssr"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BRAND_MAP, BRANDS, STAGE_COLORS, PROJECT_STAGES, type BrandId, type ProjectStage } from "@/lib/data/brands"
import { toast } from "sonner"

type Project = {
    id: string
    name: string
    brand: BrandId
    client: string
    stage: ProjectStage
    progress: number
    dueDate: string
    dueSoon: boolean
    overdue: boolean
    assignees: string[]
    revenue: number
    cost: number
    description: string
}

const initialProjects: Project[] = [
    { id: "PRJ-101", name: "Social Media Management — Q1", brand: "berhan", client: "Ethio Telecom", stage: "Execution", progress: 65, dueDate: "Mar 1", dueSoon: false, overdue: false, assignees: ["Abebe M.", "Sara T."], revenue: 45000, cost: 18000, description: "Full social media management across TikTok, Instagram, and Telegram for Q1 2026." },
    { id: "PRJ-102", name: "Full Brand Identity Refresh", brand: "tirat", client: "BlueMoon Hotel", stage: "QA", progress: 85, dueDate: "Feb 22", dueSoon: true, overdue: false, assignees: ["Hanna F.", "Liya B."], revenue: 65000, cost: 22000, description: "Complete brand overhaul including logo, color palette, typography, and brand guidelines." },
    { id: "PRJ-103", name: "Business Website + CMS", brand: "debo", client: "Ride Ethiopia", stage: "Execution", progress: 40, dueDate: "Mar 15", dueSoon: false, overdue: false, assignees: ["Abel K.", "Dawit S."], revenue: 80000, cost: 30000, description: "Custom Next.js website with headless CMS for content management." },
    { id: "PRJ-104", name: "Logo Design Package", brand: "tirat", client: "Anbessa Shoe", stage: "Delivery", progress: 95, dueDate: "Feb 18", dueSoon: false, overdue: false, assignees: ["Hanna F."], revenue: 15000, cost: 5000, description: "Modern logo refresh keeping heritage elements." },
    { id: "PRJ-105", name: "Valentine Campaign — Influencers", brand: "ethio-influencers", client: "Habesha Breweries", stage: "Delivery", progress: 100, dueDate: "Feb 14", dueSoon: false, overdue: false, assignees: ["Meron A.", "Kidist Y."], revenue: 35000, cost: 22000, description: "6-influencer Valentine's campaign across Instagram and TikTok." },
    { id: "PRJ-106", name: "Telegram Bot Setup", brand: "ethiobot", client: "Dashen Bank", stage: "Planning", progress: 15, dueDate: "Apr 1", dueSoon: false, overdue: false, assignees: ["Dawit S."], revenue: 25000, cost: 8000, description: "Customer service chatbot for Telegram with FAQ, balance inquiry, and branch locator." },
    { id: "PRJ-107", name: "Content Strategy + Calendar", brand: "berhan", client: "Awash Bank", stage: "Discovery", progress: 5, dueDate: "Mar 30", dueSoon: false, overdue: false, assignees: ["Sara T."], revenue: 30000, cost: 10000, description: "3-month content strategy with editorial calendar and content pillars." },
    { id: "PRJ-108", name: "E-commerce Platform", brand: "debo", client: "Ethiopian Airlines", stage: "Planning", progress: 20, dueDate: "May 1", dueSoon: false, overdue: false, assignees: ["Abel K.", "Dawit S.", "Selam H."], revenue: 120000, cost: 48000, description: "Full e-commerce platform with Amharic support, ETB payments, and inventory management." },
    { id: "PRJ-109", name: "Product Photography Set", brand: "tirat", client: "Zemen Bank", stage: "Execution", progress: 50, dueDate: "Feb 25", dueSoon: true, overdue: false, assignees: ["Yonas D."], revenue: 18000, cost: 7000, description: "Corporate and product photography for marketing materials." },
    { id: "PRJ-110", name: "Monthly Social — February", brand: "berhan", client: "Commercial Bank", stage: "Execution", progress: 70, dueDate: "Feb 28", dueSoon: true, overdue: false, assignees: ["Abebe M.", "Daniel G."], revenue: 15000, cost: 6000, description: "February social media content creation and scheduling." },
    { id: "PRJ-111", name: "Web App + API Integration", brand: "debo", client: "Varnero Tech", stage: "Discovery", progress: 10, dueDate: "Jun 1", dueSoon: false, overdue: false, assignees: ["Dawit S."], revenue: 85000, cost: 35000, description: "Custom web application with third-party API integrations." },
    { id: "PRJ-112", name: "Print Collateral — Menus + Signage", brand: "tirat", client: "BlueMoon Hotel", stage: "QA", progress: 80, dueDate: "Feb 20", dueSoon: true, overdue: false, assignees: ["Liya B."], revenue: 12000, cost: 4000, description: "Menu redesign and indoor/outdoor signage for hotel rebrand." },
]

function formatETB(value: number) {
    return value.toLocaleString("en-US")
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState(initialProjects)
    const [search, setSearch] = useState("")
    const [brandFilter, setBrandFilter] = useState<string>("all")
    const [stageFilter, setStageFilter] = useState<string>("all")
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newProject, setNewProject] = useState({ name: "", client: "", brand: "" as BrandId | "", description: "", revenue: "", dueDate: "" })

    const filtered = projects.filter((p) => {
        const matchesSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase())
        const matchesBrand = brandFilter === "all" || p.brand === brandFilter
        const matchesStage = stageFilter === "all" || p.stage === stageFilter
        return matchesSearch && matchesBrand && matchesStage
    })

    const totalRevenue = filtered.reduce((s, p) => s + p.revenue, 0)
    const totalCost = filtered.reduce((s, p) => s + p.cost, 0)
    const avgMargin = totalRevenue > 0 ? Math.round(((totalRevenue - totalCost) / totalRevenue) * 100) : 0

    const handleCreate = () => {
        if (!newProject.name || !newProject.brand) { toast.error("Name and brand are required"); return }
        const project: Project = {
            id: `PRJ-${Date.now().toString().slice(-3)}`,
            name: newProject.name, client: newProject.client, brand: newProject.brand as BrandId,
            stage: "Discovery", progress: 0, dueDate: newProject.dueDate || "TBD",
            dueSoon: false, overdue: false, assignees: [],
            revenue: parseInt(newProject.revenue) || 0, cost: 0, description: newProject.description,
        }
        setProjects(prev => [...prev, project])
        setIsCreateOpen(false)
        setNewProject({ name: "", client: "", brand: "", description: "", revenue: "", dueDate: "" })
        toast.success(`Project "${project.name}" created`)
    }

    const advanceStage = (project: Project) => {
        const stageOrder: ProjectStage[] = ["Discovery", "Planning", "Execution", "QA", "Delivery"]
        const currentIdx = stageOrder.indexOf(project.stage)
        if (currentIdx >= stageOrder.length - 1) return
        const nextStage = stageOrder[currentIdx + 1]
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, stage: nextStage, progress: Math.min(100, p.progress + 20) } : p))
        setSelectedProject(null)
        toast.success(`"${project.name}" advanced to ${nextStage}`)
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between border-b border-border/40 px-8 py-5">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">Active projects across all brands — {formatETB(totalRevenue)} ETB in pipeline, {avgMargin}% avg margin.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={stageFilter} onValueChange={setStageFilter}>
                                <SelectTrigger className="h-8 w-[130px] text-xs">
                                    <Funnel className="h-3.5 w-3.5 mr-1" />
                                    <SelectValue placeholder="Stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Stages</SelectItem>
                                    {PROJECT_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Button size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}><Plus className="h-4 w-4" /> New Project</Button>
                        </div>
                    </header>

                    <div className="px-8 py-4 border-b border-border/40 flex items-center gap-4">
                        <div className="relative max-w-sm flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search projects..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                                    <th className="text-left font-medium px-8 py-3">Project</th>
                                    <th className="text-left font-medium px-4 py-3">Stage</th>
                                    <th className="text-left font-medium px-4 py-3 w-[160px]">Progress</th>
                                    <th className="text-left font-medium px-4 py-3">Due</th>
                                    <th className="text-left font-medium px-4 py-3">Team</th>
                                    <th className="text-right font-medium px-4 py-3">Revenue</th>
                                    <th className="text-right font-medium px-4 py-3">Margin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((project) => {
                                    const brand = BRAND_MAP[project.brand]
                                    const margin = project.revenue > 0 ? Math.round(((project.revenue - project.cost) / project.revenue) * 100) : 0
                                    const marginColor = margin >= 60 ? "text-emerald-500" : margin >= 40 ? "text-amber-500" : "text-red-400"
                                    const dueDateColor = project.overdue ? "text-red-400 font-semibold" : project.dueSoon ? "text-amber-500" : "text-muted-foreground"

                                    return (
                                        <tr key={project.id} onClick={() => setSelectedProject(project)} className="border-b border-border/20 hover:bg-muted/30 transition-colors cursor-pointer">
                                            <td className="px-8 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <span className={`h-2 w-2 rounded-full shrink-0 ${brand.dotColor}`} />
                                                    <div>
                                                        <p className="text-sm font-medium">{project.name}</p>
                                                        <p className="text-[11px] text-muted-foreground">{project.client} · {project.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STAGE_COLORS[project.stage]}`}>
                                                    {project.stage}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${brand.color} transition-all`} style={{ width: `${project.progress}%` }} />
                                                    </div>
                                                    <span className="text-[11px] font-medium text-muted-foreground w-8 text-right">{project.progress}%</span>
                                                </div>
                                            </td>
                                            <td className={`px-4 py-3.5 text-xs ${dueDateColor}`}>{project.dueDate}</td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex -space-x-1.5">
                                                    {project.assignees.slice(0, 3).map((a) => (
                                                        <span key={a} className="h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[8px] font-bold text-muted-foreground" title={a}>
                                                            {a.split(" ").map(n => n[0]).join("")}
                                                        </span>
                                                    ))}
                                                    {project.assignees.length > 3 && (
                                                        <span className="h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                                                            +{project.assignees.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-sm font-semibold text-right">{formatETB(project.revenue)}</td>
                                            <td className={`px-4 py-3.5 text-sm font-bold text-right ${marginColor}`}>{margin}%</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Project Detail Sheet */}
                <Sheet open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
                    <SheetContent className="sm:max-w-lg overflow-y-auto">
                        {selectedProject && (() => {
                            const brand = BRAND_MAP[selectedProject.brand]
                            const margin = selectedProject.revenue > 0 ? Math.round(((selectedProject.revenue - selectedProject.cost) / selectedProject.revenue) * 100) : 0
                            return (
                                <>
                                    <SheetHeader>
                                        <div className="flex items-center gap-2">
                                            <span className={`h-3 w-3 rounded-full ${brand.dotColor}`} />
                                            <SheetTitle>{selectedProject.name}</SheetTitle>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{selectedProject.client} · {selectedProject.id} · {brand.name}</p>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
                                                <p className="text-lg font-bold">{formatETB(selectedProject.revenue)}</p>
                                                <p className="text-[10px] text-muted-foreground">Revenue (ETB)</p>
                                            </div>
                                            <div className="rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
                                                <p className="text-lg font-bold">{formatETB(selectedProject.cost)}</p>
                                                <p className="text-[10px] text-muted-foreground">Cost (ETB)</p>
                                            </div>
                                            <div className="rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
                                                <p className={`text-lg font-bold ${margin >= 60 ? "text-emerald-500" : margin >= 40 ? "text-amber-500" : "text-red-400"}`}>{margin}%</p>
                                                <p className="text-[10px] text-muted-foreground">Margin</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Stage</h4>
                                            <div className="flex items-center gap-1">
                                                {(["Discovery", "Planning", "Execution", "QA", "Delivery"] as ProjectStage[]).map((s) => (
                                                    <div key={s} className={`flex-1 h-2 rounded-full ${s === selectedProject.stage ? brand.color : PROJECT_STAGES.indexOf(s) < PROJECT_STAGES.indexOf(selectedProject.stage) ? "bg-emerald-500/40" : "bg-muted"}`} />
                                                ))}
                                            </div>
                                            <p className="text-sm mt-2"><span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STAGE_COLORS[selectedProject.stage]}`}>{selectedProject.stage}</span> · {selectedProject.progress}% complete</p>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
                                            <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Team</h4>
                                            <div className="space-y-2">
                                                {selectedProject.assignees.map((a) => (
                                                    <div key={a} className="flex items-center gap-3">
                                                        <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                                            {a.split(" ").map(n => n[0]).join("")}
                                                        </span>
                                                        <span className="text-sm">{a}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => { toast.info("Edit mode (mock)"); setSelectedProject(null) }}>
                                                <Pencil className="h-4 w-4" /> Edit
                                            </Button>
                                            {selectedProject.stage !== "Delivery" && (
                                                <Button size="sm" className="flex-1" onClick={() => advanceStage(selectedProject)}>
                                                    Advance Stage →
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )
                        })()}
                    </SheetContent>
                </Sheet>

                {/* Create Project Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label>Project Name *</Label>
                                <Input value={newProject.name} onChange={(e) => setNewProject(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Website Redesign" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Client</Label>
                                    <Input value={newProject.client} onChange={(e) => setNewProject(p => ({ ...p, client: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Brand *</Label>
                                    <Select value={newProject.brand} onValueChange={(v) => setNewProject(p => ({ ...p, brand: v as BrandId }))}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            {BRANDS.map(b => <SelectItem key={b.id} value={b.id}><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${b.dotColor}`} />{b.shortName}</div></SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Revenue (ETB)</Label>
                                    <Input type="number" value={newProject.revenue} onChange={(e) => setNewProject(p => ({ ...p, revenue: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Due Date</Label>
                                    <Input value={newProject.dueDate} onChange={(e) => setNewProject(p => ({ ...p, dueDate: e.target.value }))} placeholder="e.g. Apr 15" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={newProject.description} onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value }))} rows={3} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>Create Project</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    )
}
