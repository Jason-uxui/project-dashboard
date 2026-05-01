"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    MagnifyingGlass,
    Layout,
    Eye,
    DownloadSimple,
    CalendarBlank,
    FileText,
    Envelope,
    Receipt,
    PencilLine,
    UserList,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS } from "@/lib/data/brands"

type TemplateType = "Deliverable" | "Proposal" | "Email" | "Brief" | "Invoice" | "Contract" | "Report"

type Template = {
    id: string
    name: string
    type: TemplateType
    brands: string[]
    lastUpdated: string
    description: string
    format: string
}

const TYPE_ICONS: Record<TemplateType, React.ComponentType<{ className?: string }>> = {
    Deliverable: Layout,
    Proposal: FileText,
    Email: Envelope,
    Brief: PencilLine,
    Invoice: Receipt,
    Contract: FileText,
    Report: FileText,
}

const TYPE_COLORS: Record<TemplateType, string> = {
    Deliverable: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Proposal: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Email: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Brief: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Invoice: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Contract: "bg-red-500/10 text-red-400 border-red-500/20",
    Report: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
}

const MOCK_TEMPLATES: Template[] = [
    { id: "TMP-001", name: "Logo Design Brief", type: "Brief", brands: ["tirat"], lastUpdated: "2026-02-10", description: "Standard brief for logo design projects. Includes questionnaire, mood board template, and deliverable specs.", format: "Google Docs" },
    { id: "TMP-002", name: "Website Development Proposal", type: "Proposal", brands: ["debo"], lastUpdated: "2026-02-08", description: "Complete proposal template for web dev projects. Package tiers, timeline, tech stack details.", format: "Google Docs" },
    { id: "TMP-003", name: "Social Media Management Proposal", type: "Proposal", brands: ["berhan"], lastUpdated: "2026-02-05", description: "Monthly social media management proposal. Platform strategy, content calendar, performance KPIs.", format: "Google Slides" },
    { id: "TMP-004", name: "Welcome Email — New Client", type: "Email", brands: ["berhan", "tirat", "debo", "ethio-influencers", "ethiobot"], lastUpdated: "2026-01-28", description: "Branded welcome email sent after project kickoff. Per-brand versions with custom logos and colors.", format: "HTML" },
    { id: "TMP-005", name: "Client Invoice — Standard", type: "Invoice", brands: ["berhan", "tirat", "debo", "ethio-influencers", "ethiobot"], lastUpdated: "2026-02-01", description: "Standard invoice template. Auto-populates client info, project details, and payment terms.", format: "PDF" },
    { id: "TMP-006", name: "Freelancer NDA", type: "Contract", brands: ["berhan", "tirat", "debo", "ethio-influencers", "ethiobot"], lastUpdated: "2025-12-15", description: "Non-disclosure agreement for all freelancers. Covers IP rights, confidentiality, and non-compete.", format: "PDF" },
    { id: "TMP-007", name: "Brand Identity Deliverable Spec", type: "Deliverable", brands: ["tirat"], lastUpdated: "2026-01-20", description: "Complete spec for brand identity deliverables: logo variations, color palette, typography, guidelines PDF.", format: "Google Docs" },
    { id: "TMP-008", name: "Monthly Performance Report", type: "Report", brands: ["berhan", "tirat", "debo", "ethio-influencers", "ethiobot"], lastUpdated: "2026-02-12", description: "Client-facing monthly report. Social media metrics, campaign performance, project status updates.", format: "Google Slides" },
    { id: "TMP-009", name: "Chatbot Flow Brief", type: "Brief", brands: ["ethiobot"], lastUpdated: "2026-01-25", description: "ManyChat automation flow brief. Conversation tree template, trigger definitions, response templates.", format: "Google Docs" },
    { id: "TMP-010", name: "Influencer Campaign Brief", type: "Brief", brands: ["ethio-influencers"], lastUpdated: "2026-02-03", description: "Brief template for influencer campaigns. Brand guidelines, content requirements, hashtag strategy.", format: "Google Docs" },
    { id: "TMP-011", name: "Follow-Up Email — 7 Day", type: "Email", brands: ["berhan", "tirat", "debo", "ethio-influencers", "ethiobot"], lastUpdated: "2026-01-15", description: "Automated follow-up email sent 7 days after proposal. Per-brand variations.", format: "HTML" },
    { id: "TMP-012", name: "Client Agreement — Standard", type: "Contract", brands: ["berhan", "tirat", "debo", "ethio-influencers", "ethiobot"], lastUpdated: "2025-11-20", description: "Standard client services agreement. Scope, deliverables, payment terms, IP transfer clause.", format: "PDF" },
    { id: "TMP-013", name: "E-commerce Site Deliverable Spec", type: "Deliverable", brands: ["debo"], lastUpdated: "2026-02-08", description: "Full spec for e-commerce website deliverables: pages, features, integrations, responsive breakpoints.", format: "Google Docs" },
    { id: "TMP-014", name: "Satisfaction Survey Email", type: "Email", brands: ["berhan", "tirat", "debo", "ethio-influencers", "ethiobot"], lastUpdated: "2026-01-10", description: "Post-project satisfaction survey. 1-5 rating, feedback text, cross-referral ask.", format: "HTML" },
    { id: "TMP-015", name: "Content Calendar Template", type: "Deliverable", brands: ["berhan"], lastUpdated: "2026-02-14", description: "Monthly content calendar. 30 slots per brand, content pillar mapping, hashtag sets.", format: "Google Sheets" },
]

export default function TemplatesPage() {
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState<TemplateType | "All">("All")
    const [brandFilter, setBrandFilter] = useState<string | null>(null)

    const filtered = useMemo(() => {
        return MOCK_TEMPLATES.filter(t => {
            if (typeFilter !== "All" && t.type !== typeFilter) return false
            if (brandFilter && !t.brands.includes(brandFilter)) return false
            if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
            return true
        })
    }, [search, typeFilter, brandFilter])

    const typeCounts = MOCK_TEMPLATES.reduce((acc, t) => { acc[t.type] = (acc[t.type] || 0) + 1; return acc }, {} as Record<string, number>)

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1400px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Template Library</h1>
                            <p className="text-sm text-muted-foreground mt-1">{MOCK_TEMPLATES.length} templates — deliverables, proposals, emails, briefs, invoices, contracts, and reports.</p>
                        </div>
                        <Button size="sm" className="gap-1.5"><Layout className="h-3.5 w-3.5" />Create Template</Button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search templates..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setTypeFilter("All")}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${typeFilter === "All" ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                All Types
                            </button>
                            {(Object.keys(TYPE_COLORS) as TemplateType[]).map(t => (
                                <button key={t} onClick={() => setTypeFilter(t)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${typeFilter === t ? TYPE_COLORS[t] : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {t} ({typeCounts[t] || 0})
                                </button>
                            ))}
                        </div>
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

                    {/* Template Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {filtered.map(template => {
                            const Icon = TYPE_ICONS[template.type]
                            return (
                                <div key={template.id} className="rounded-xl border border-border/50 p-4 hover:bg-accent/30 transition-all group cursor-pointer">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-0.5">{template.brands.slice(0, 3).map(bId => { const b = BRANDS.find(x => x.id === bId); return b ? <span key={bId} className={`h-2 w-2 rounded-full ${b.dotColor}`} /> : null })}{template.brands.length > 3 && <span className="text-[10px] text-muted-foreground ml-0.5">+{template.brands.length - 3}</span>}</div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${TYPE_COLORS[template.type]}`}>
                                            <Icon className="h-3 w-3" />{template.type}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-semibold">{template.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                            <span>{template.format}</span>
                                            <span>·</span>
                                            <span>{new Date(template.lastUpdated + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 rounded hover:bg-muted"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
                                            <button className="p-1 rounded hover:bg-muted"><DownloadSimple className="h-3.5 w-3.5 text-muted-foreground" /></button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
