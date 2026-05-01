"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  MagnifyingGlass,
  CheckCircle,
  Circle,
  Clock,
  FlagBanner,
  CalendarBlank,
  Funnel,
  FolderOpen,
  NotePencil,
  Receipt,
  UserList,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS } from "@/lib/data/brands"

type TaskPriority = "Urgent" | "High" | "Normal" | "Low"
type TaskStatus = "To Do" | "In Progress" | "Done"
type TaskModule = "Projects" | "Content" | "Pipeline" | "Payouts" | "QA" | "Admin"

type Task = {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  module: TaskModule
  brand?: string
  dueDate: string
  assignedTo: string
}

const PRIORITY_COLORS: Record<TaskPriority, { dot: string; text: string; bg: string }> = {
  Urgent: { dot: "bg-red-500", text: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  High: { dot: "bg-orange-500", text: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  Normal: { dot: "bg-blue-500", text: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  Low: { dot: "bg-slate-500", text: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" },
}

const MODULE_ICONS: Record<TaskModule, React.ComponentType<{ className?: string }>> = {
  Projects: FolderOpen,
  Content: NotePencil,
  Pipeline: Funnel,
  Payouts: Receipt,
  QA: FlagBanner,
  Admin: CalendarBlank,
}

const MOCK_TASKS: Task[] = [
  { id: "T-001", title: "Review Merkato Restaurant Logo (3 concepts)", description: "QA review of logo designs submitted by Dawit. Check brand colors, scalability, and typography.", priority: "Urgent", status: "To Do", module: "QA", brand: "tirat", dueDate: "2026-02-16", assignedTo: "Meana" },
  { id: "T-002", title: "Follow up with Habesha Brewing lead", description: "Dawit Tessema requested social media management + influencer campaign. Call back to schedule discovery session.", priority: "High", status: "To Do", module: "Pipeline", brand: "berhan", dueDate: "2026-02-17", assignedTo: "Salim" },
  { id: "T-003", title: "Approve February content batch — Berhan", description: "15 posts ready for review. Check brand voice, visuals, and hashtag strategy before scheduling.", priority: "High", status: "To Do", module: "Content", brand: "berhan", dueDate: "2026-02-17", assignedTo: "Meana" },
  { id: "T-004", title: "Process overdue freelancer payouts", description: "2 payouts overdue: Dawit (8,000 ETB) and Hana (12,000 ETB). Need to process via Telebirr and CBE Birr.", priority: "Urgent", status: "In Progress", module: "Payouts", dueDate: "2026-02-16", assignedTo: "Haz" },
  { id: "T-005", title: "Send asset request to Addis Pharma", description: "New project kicked off. Need client brand assets, product photos, and content for website.", priority: "Normal", status: "To Do", module: "Projects", brand: "debo", dueDate: "2026-02-18", assignedTo: "Meana" },
  { id: "T-006", title: "QA review — EthioShop payment integration", description: "Code review for payment gateway integration. Test Telebirr, CBE Birr, and card payment flows.", priority: "High", status: "In Progress", module: "QA", brand: "debo", dueDate: "2026-02-19", assignedTo: "Haz" },
  { id: "T-007", title: "Schedule Tirat Studio Instagram posts", description: "8 portfolio showcase posts ready. Schedule via Buffer for optimal engagement times.", priority: "Normal", status: "To Do", module: "Content", brand: "tirat", dueDate: "2026-02-19", assignedTo: "Meana" },
  { id: "T-008", title: "Prepare Lucy Airlines proposal", description: "Enterprise chatbot proposal — include ManyChat automation flow, pricing tiers, and timeline.", priority: "High", status: "In Progress", module: "Pipeline", brand: "ethiobot", dueDate: "2026-02-20", assignedTo: "Salim" },
  { id: "T-009", title: "Review influencer content — Valentine's campaign", description: "8 influencer-generated posts for Habesha Brewing. Check brand alignment and engagement quality.", priority: "Normal", status: "To Do", module: "QA", brand: "ethio-influencers", dueDate: "2026-02-20", assignedTo: "Meana" },
  { id: "T-010", title: "Monthly tax reconciliation", description: "Reconcile all February invoices for VAT filing. Export transaction report.", priority: "Low", status: "To Do", module: "Admin", dueDate: "2026-02-22", assignedTo: "Haz" },
  { id: "T-011", title: "Onboard new freelancer — Kidist Haile", description: "ManyChat specialist. Send NDA, set up in system, assign trial project.", priority: "Normal", status: "Done", module: "Admin", dueDate: "2026-02-14", assignedTo: "Meana" },
  { id: "T-012", title: "Debo Code weekly sprint review", description: "Review sprint progress on EthioShop MVP. Check velocity and upcoming blockers.", priority: "Normal", status: "Done", module: "Projects", brand: "debo", dueDate: "2026-02-15", assignedTo: "Haz" },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS)
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "All">("All")
  const [moduleFilter, setModuleFilter] = useState<TaskModule | "All">("All")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "All">("All")
  const [brandFilter, setBrandFilter] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (priorityFilter !== "All" && t.priority !== priorityFilter) return false
      if (moduleFilter !== "All" && t.module !== moduleFilter) return false
      if (statusFilter !== "All" && t.status !== statusFilter) return false
      if (brandFilter && t.brand !== brandFilter) return false
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }).sort((a, b) => {
      const pOrder: Record<TaskPriority, number> = { Urgent: 0, High: 1, Normal: 2, Low: 3 }
      const sOrder: Record<TaskStatus, number> = { "To Do": 0, "In Progress": 1, Done: 2 }
      return sOrder[a.status] - sOrder[b.status] || pOrder[a.priority] - pOrder[b.priority]
    })
  }, [tasks, search, priorityFilter, moduleFilter, statusFilter, brandFilter])

  const toggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const next: Record<TaskStatus, TaskStatus> = { "To Do": "In Progress", "In Progress": "Done", Done: "To Do" }
      return { ...t, status: next[t.status] }
    }))
  }

  const stats = {
    total: tasks.filter(t => t.status !== "Done").length,
    urgent: tasks.filter(t => t.priority === "Urgent" && t.status !== "Done").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    done: tasks.filter(t => t.status === "Done").length,
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col gap-6 p-6 max-w-[1200px]">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
            <p className="text-sm text-muted-foreground mt-1">Personal task list — everything that needs your attention across all modules.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-xl border border-border/60 p-4 bg-muted/20"><p className="text-xs text-muted-foreground">Open Tasks</p><p className="text-xl font-bold mt-1">{stats.total}</p></div>
            <div className="rounded-xl border border-red-500/20 p-4 bg-red-500/5"><p className="text-xs text-muted-foreground">Urgent</p><p className="text-xl font-bold mt-1 text-red-400">{stats.urgent}</p></div>
            <div className="rounded-xl border border-blue-500/20 p-4 bg-blue-500/5"><p className="text-xs text-muted-foreground">In Progress</p><p className="text-xl font-bold mt-1 text-blue-400">{stats.inProgress}</p></div>
            <div className="rounded-xl border border-emerald-500/20 p-4 bg-emerald-500/5"><p className="text-xs text-muted-foreground">Completed</p><p className="text-xl font-bold mt-1 text-emerald-400">{stats.done}</p></div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-1.5">
              {(["All", "Urgent", "High", "Normal", "Low"] as const).map(p => (
                <button key={p} onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${priorityFilter === p ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {p !== "All" && <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1 ${PRIORITY_COLORS[p].dot}`} />}{p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {(["All", "To Do", "In Progress", "Done"] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${statusFilter === s ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(["All", "Projects", "Content", "Pipeline", "Payouts", "QA", "Admin"] as const).map(m => (
              <button key={m} onClick={() => setModuleFilter(m)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${moduleFilter === m ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {m}
              </button>
            ))}
            <span className="mx-2 text-border">|</span>
            {BRANDS.map(b => (
              <button key={b.id} onClick={() => setBrandFilter(brandFilter === b.id ? null : b.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${brandFilter === b.id ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                <span className={`h-2 w-2 rounded-full ${b.dotColor}`} />{b.shortName}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="space-y-1.5">
            {filtered.map(task => {
              const pc = PRIORITY_COLORS[task.priority]
              const ModuleIcon = MODULE_ICONS[task.module]
              const brand = BRANDS.find(b => b.id === task.brand)
              const dueDate = new Date(task.dueDate + "T00:00:00")
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const isOverdue = task.status !== "Done" && dueDate < today
              const isDone = task.status === "Done"

              return (
                <div key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all group ${isDone ? "border-border/30 opacity-60" : isOverdue ? "border-red-500/30 bg-red-500/3" : "border-border/50 hover:bg-accent/30"}`}>
                  {/* Status Toggle */}
                  <button onClick={() => toggleStatus(task.id)} className="mt-0.5 shrink-0">
                    {isDone ? <CheckCircle className="h-5 w-5 text-emerald-400" weight="fill" />
                      : task.status === "In Progress" ? <Clock className="h-5 w-5 text-blue-400" />
                        : <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}>{task.title}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${pc.bg} ${pc.text}`}>{task.priority}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <ModuleIcon className="h-3 w-3" />{task.module}
                      </span>
                      {brand && <span className={`inline-flex items-center gap-1 text-[10px] ${brand.textColor}`}><span className={`h-1.5 w-1.5 rounded-full ${brand.dotColor}`} />{brand.shortName}</span>}
                      <span className="text-[10px] text-muted-foreground">·</span>
                      <span className={`text-[10px] ${isOverdue ? "text-red-400 font-medium" : "text-muted-foreground"}`}>
                        {isOverdue ? "Overdue — " : ""}{dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span className="text-[10px] text-muted-foreground">·</span>
                      <span className="text-[10px] text-muted-foreground">{task.assignedTo}</span>
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
