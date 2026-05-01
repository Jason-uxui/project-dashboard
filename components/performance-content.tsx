"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { format } from "date-fns"
import {
  ArrowDown,
  ArrowUp,
  CalendarBlank,
  ChartBar,
  CheckCircle,
  Clock,
  Funnel,
  Info,
  WarningOctagon,
} from "@phosphor-icons/react/dist/ssr"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ChipOverflow } from "@/components/chip-overflow"
import { ProgressCircle } from "@/components/progress-circle"
import { cn } from "@/lib/utils"
import { projects, type Project } from "@/lib/data/projects"

const REFERENCE_TODAY = new Date(2024, 0, 23)
const MS_DAY = 1000 * 60 * 60 * 24

const RANGE_OPTIONS = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
  { id: "custom", label: "Custom range" },
] as const

type RangeId = (typeof RANGE_OPTIONS)[number]["id"]

type HealthTone = "positive" | "warning" | "danger" | "neutral" | "muted"

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function diffInDays(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / MS_DAY)
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function toISODate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}


function getProgressColor(percent: number): string {
  if (percent >= 80) return "var(--chart-3)"
  if (percent >= 50) return "var(--chart-4)"
  if (percent > 0) return "var(--chart-5)"
  return "var(--chart-2)"
}

function getStatusLabel(status: string) {
  if (status === "active") return "Active"
  if (status === "planned") return "Planned"
  if (status === "backlog") return "Backlog"
  if (status === "completed") return "Completed"
  if (status === "cancelled") return "Cancelled"
  return "Unknown"
}

function getStatusBadgeClass(status: string) {
  if (status === "active") return "bg-teal-50 text-teal-700 border-transparent"
  if (status === "planned") return "bg-amber-50 text-amber-700 border-transparent"
  if (status === "backlog") return "bg-slate-100 text-slate-600 border-transparent"
  if (status === "completed") return "bg-emerald-50 text-emerald-700 border-transparent"
  if (status === "cancelled") return "bg-slate-200 text-slate-600 border-transparent"
  return "bg-muted text-muted-foreground border-transparent"
}

function getHealthBadgeClass(tone: HealthTone) {
  if (tone === "positive") return "bg-emerald-50 text-emerald-700 border-transparent"
  if (tone === "warning") return "bg-amber-50 text-amber-700 border-transparent"
  if (tone === "danger") return "bg-rose-50 text-rose-700 border-transparent"
  if (tone === "muted") return "bg-slate-100 text-slate-600 border-transparent"
  return "bg-blue-50 text-blue-700 border-transparent"
}

function getHealthLabel({ status, variance }: { status: string; variance: number }) {
  if (status === "completed") return { label: "Completed", tone: "positive" as const }
  if (status === "cancelled") return { label: "Cancelled", tone: "muted" as const }
  if (variance >= 8) return { label: "Ahead", tone: "positive" as const }
  if (variance <= -12) return { label: "Behind", tone: "danger" as const }
  if (variance <= -4) return { label: "At risk", tone: "warning" as const }
  return { label: "On track", tone: "neutral" as const }
}

function getDueLabel(daysToDue: number) {
  if (daysToDue === 0) return "Due today"
  if (daysToDue < 0) return `Overdue ${Math.abs(daysToDue)}d`
  return `Due in ${daysToDue}d`
}

type MetricCardProps = {
  title: string
  value: string
  description: string
  icon: ReactNode
  tooltip: string
  tone?: "positive" | "warning" | "danger" | "neutral"
}

function MetricCard({ title, value, description, icon, tooltip, tone = "neutral" }: MetricCardProps) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "warning"
        ? "text-amber-600"
        : tone === "danger"
          ? "text-rose-600"
          : "text-muted-foreground"

  return (
    <Card className="border-border/60 bg-card/70">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                aria-label={`Info about ${title}`}
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[220px] text-xs">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className={cn("h-8 w-8 rounded-full bg-muted/40 flex items-center justify-center", toneClass)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-semibold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

type PerformanceFilterValue = {
  projectId: string
  member: string
}

type PerformanceFilterPopoverProps = {
  projects: Project[]
  value: PerformanceFilterValue
  onApply: (next: PerformanceFilterValue) => void
  onClear: () => void
}

function PerformanceFilterPopover({
  projects,
  value,
  onApply,
  onClear,
}: PerformanceFilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [tempProjectId, setTempProjectId] = useState(value.projectId)
  const [tempMember, setTempMember] = useState(value.member)
  const [active, setActive] = useState<"project" | "member">("project")

  useEffect(() => {
    if (!open) return
    setTempProjectId(value.projectId)
    setTempMember(value.member)
    setActive("project")
  }, [open, value.member, value.projectId])

  const availableMembers = useMemo(() => {
    const scopedProjects =
      tempProjectId === "all"
        ? projects
        : projects.filter((project) => project.id === tempProjectId)
    const members = new Set<string>()
    scopedProjects.forEach((project) => {
      project.tasks.forEach((task) => members.add(task.assignee))
    })
    return Array.from(members).sort((a, b) => a.localeCompare(b))
  }, [projects, tempProjectId])

  useEffect(() => {
    if (tempMember === "all") return
    if (!availableMembers.includes(tempMember)) {
      setTempMember("all")
    }
  }, [availableMembers, tempMember])

  const handleApply = () => {
    onApply({ projectId: tempProjectId, member: tempMember })
    setOpen(false)
  }

  const handleClear = () => {
    setTempProjectId("all")
    setTempMember("all")
    onClear()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg border-border/60 px-3 bg-transparent">
          <Funnel className="h-4 w-4" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[560px] p-0 rounded-xl">
        <div className="grid grid-cols-[220px_minmax(0,1fr)]">
          <div className="border-r border-border/40 p-3">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActive("project")}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-accent",
                  active === "project" && "bg-accent",
                )}
              >
                <span>Project</span>
                <span className="text-xs text-muted-foreground">{projects.length}</span>
              </button>
              <button
                type="button"
                onClick={() => setActive("member")}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-accent",
                  active === "member" && "bg-accent",
                )}
              >
                <span>Members</span>
                <span className="text-xs text-muted-foreground">{availableMembers.length}</span>
              </button>
            </div>
          </div>
          <div className="p-3">
            {active === "project" && (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Project</p>
                <div className="mt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => setTempProjectId("all")}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm",
                      tempProjectId === "all" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent",
                    )}
                  >
                    <span>All projects</span>
                    {tempProjectId === "all" && <CheckCircle className="h-4 w-4 text-primary" weight="fill" />}
                  </button>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setTempProjectId(project.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm",
                        tempProjectId === project.id
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent",
                      )}
                    >
                      <span className="truncate">{project.name}</span>
                      {tempProjectId === project.id && <CheckCircle className="h-4 w-4 text-primary" weight="fill" />}
                    </button>
                  ))}
                </div>
              </>
            )}
            {active === "member" && (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Member</p>
                <div className="mt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => setTempMember("all")}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm",
                      tempMember === "all" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent",
                    )}
                  >
                    <span>All members</span>
                    {tempMember === "all" && <CheckCircle className="h-4 w-4 text-primary" weight="fill" />}
                  </button>
                  {availableMembers.map((member) => (
                    <button
                      key={member}
                      type="button"
                      onClick={() => setTempMember(member)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm",
                        tempMember === member ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent",
                      )}
                    >
                      <span className="truncate">{member}</span>
                      {tempMember === member && <CheckCircle className="h-4 w-4 text-primary" weight="fill" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border/40 p-3">
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function PerformanceContent() {
  const [rangeId, setRangeId] = useState<RangeId>("30d")
  const [selectedProjectId, setSelectedProjectId] = useState("all")
  const [selectedMember, setSelectedMember] = useState("all")
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" })
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false)

  useEffect(() => {
    if (rangeId === "custom") return
    const range = RANGE_OPTIONS.find((option) => option.id === rangeId)
    const days = range && "days" in range ? range.days : 30
    const rangeStart = addDays(REFERENCE_TODAY, -(days - 1))
    setDateRange({
      start: toISODate(rangeStart),
      end: toISODate(REFERENCE_TODAY),
    })
  }, [rangeId])

  const memberOptions = useMemo(() => {
    const scopedProjects =
      selectedProjectId === "all"
        ? projects
        : projects.filter((project) => project.id === selectedProjectId)

    const members = new Set<string>()
    scopedProjects.forEach((project) => {
      project.tasks.forEach((task) => members.add(task.assignee))
    })

    return Array.from(members).sort((a, b) => a.localeCompare(b))
  }, [selectedProjectId])

  const selectedProject = useMemo(() => {
    if (selectedProjectId === "all") return null
    return projects.find((project) => project.id === selectedProjectId) ?? null
  }, [selectedProjectId])

  const filterChips = useMemo(() => {
    const chips: { key: string; value: string }[] = []
    if (selectedProject && selectedProjectId !== "all") {
      chips.push({ key: "Project", value: selectedProject.name })
    }
    if (selectedMember !== "all") {
      chips.push({ key: "Member", value: selectedMember })
    }
    return chips
  }, [selectedMember, selectedProject, selectedProjectId])

  const handleRemoveChip = (key: string, _value: string) => {
    if (key.toLowerCase() === "project") {
      setSelectedProjectId("all")
    }
    if (key.toLowerCase() === "member") {
      setSelectedMember("all")
    }
  }

  useEffect(() => {
    if (selectedMember === "all") return
    if (!memberOptions.includes(selectedMember)) {
      setSelectedMember("all")
    }
  }, [memberOptions, selectedMember])

  const {
    kpis,
    healthRows,
    riskProjects,
    workMix,
    workMixTotal,
    bugSeries,
    bugSummary,
    mixTrendSeries,
    mixTrendTotal,
    throughputSeries,
    rangeLabel,
    filteredProjectCount,
  } = useMemo(() => {
    const fallbackRange = RANGE_OPTIONS.find((option) => option.id === rangeId)
    const fallbackDays = fallbackRange && "days" in fallbackRange ? fallbackRange.days : 30
    const fallbackStart = addDays(REFERENCE_TODAY, -(fallbackDays - 1))

    const parsedStart = dateRange.start ? new Date(`${dateRange.start}T00:00:00`) : fallbackStart
    const parsedEnd = dateRange.end ? new Date(`${dateRange.end}T23:59:59`) : REFERENCE_TODAY
    const rangeStart = parsedStart.getTime() <= parsedEnd.getTime() ? parsedStart : parsedEnd
    const rangeEnd = parsedStart.getTime() <= parsedEnd.getTime() ? parsedEnd : parsedStart

    const scopedProjects = projects.filter((project) => {
      if (selectedProjectId !== "all" && project.id !== selectedProjectId) return false
      if (selectedMember === "all") return true
      return project.tasks.some((task) => task.assignee === selectedMember)
    })

    const allTasks = scopedProjects.flatMap((project) =>
      project.tasks
        .filter((task) => selectedMember === "all" || task.assignee === selectedMember)
        .map((task) => ({
          ...task,
          projectId: project.id,
          projectName: project.name,
        })),
    )

    const doneTasks = allTasks.filter((task) => task.status === "done")
    const tasksInRange = allTasks.filter(
      (task) =>
        task.startDate.getTime() <= rangeEnd.getTime() &&
        task.endDate.getTime() >= rangeStart.getTime(),
    )
    const overdueTasks = allTasks.filter(
      (task) =>
        task.status !== "done" &&
        task.endDate.getTime() < rangeEnd.getTime() &&
        task.endDate.getTime() >= rangeStart.getTime(),
    )

    const completedInRange = doneTasks.filter(
      (task) => task.endDate.getTime() >= rangeStart.getTime() && task.endDate.getTime() <= rangeEnd.getTime(),
    )

    const healthRows = scopedProjects.map((project) => {
      const duration = project.endDate.getTime() - project.startDate.getTime()
      const elapsed = rangeEnd.getTime() - project.startDate.getTime()
      const scheduleProgress = duration > 0 ? clamp((elapsed / duration) * 100, 0, 100) : 0
      const variance = Math.round(project.progress - scheduleProgress)
      const daysToDue = diffInDays(rangeEnd, project.endDate)
      const health = getHealthLabel({ status: project.status, variance })

      return {
        id: project.id,
        name: project.name,
        status: project.status,
        progress: project.progress,
        schedule: Math.round(scheduleProgress),
        variance,
        daysToDue,
        endDate: project.endDate,
        taskCount: project.tasks.length,
        health,
      }
    })

    const activeProjects = healthRows.filter((row) => row.status === "active" || row.status === "planned")
    const onTrackProjects = activeProjects.filter(
      (row) => row.health.label === "On track" || row.health.label === "Ahead",
    )
    const onTrackRate = activeProjects.length
      ? Math.round((onTrackProjects.length / activeProjects.length) * 100)
      : 0

    const riskProjectsAll = healthRows.filter(
      (row) => row.health.label === "Behind" || row.health.label === "At risk",
    )

    const riskProjects = riskProjectsAll
      .slice()
      .sort((a, b) => a.variance - b.variance)
      .slice(0, 4)

    const totalDays = Math.max(1, diffInDays(rangeStart, rangeEnd) + 1)
    const bucketCount = Math.min(6, totalDays)
    const baseBucketSize = Math.floor(totalDays / bucketCount)
    const remainder = totalDays % bucketCount
    let bucketOffset = 0
    const throughputBuckets = Array.from({ length: bucketCount }, (_, index) => {
      const size = baseBucketSize + (index < remainder ? 1 : 0)
      const start = addDays(rangeStart, bucketOffset)
      const end = addDays(rangeStart, bucketOffset + size - 1)
      bucketOffset += size
      return { start, end, count: 0 }
    })
    const bucketEnds = throughputBuckets.map((bucket) => diffInDays(rangeStart, bucket.end))

    const bugBuckets = throughputBuckets.map((bucket) => ({ ...bucket, count: 0 }))
    const mixBuckets = throughputBuckets.map((bucket) => ({
      ...bucket,
      total: 0,
      bug: 0,
      improvement: 0,
      task: 0,
    }))
    const completedBugsInRange = completedInRange.filter((task) => task.type === "bug")

    completedInRange.forEach((task) => {
      const offset = diffInDays(rangeStart, task.endDate)
      if (offset < 0 || offset >= totalDays) return
      const bucketMatch = bucketEnds.findIndex((end) => offset <= end)
      const bucketIndex = bucketMatch === -1 ? bucketCount - 1 : bucketMatch
      throughputBuckets[bucketIndex].count += 1
      const mixBucket = mixBuckets[bucketIndex]
      mixBucket.total += 1
      mixBucket[task.type] += 1
    })

    completedBugsInRange.forEach((task) => {
      const offset = diffInDays(rangeStart, task.endDate)
      if (offset < 0 || offset >= totalDays) return
      const bucketMatch = bucketEnds.findIndex((end) => offset <= end)
      const bucketIndex = bucketMatch === -1 ? bucketCount - 1 : bucketMatch
      bugBuckets[bucketIndex].count += 1
    })

    const maxThroughput = Math.max(...throughputBuckets.map((bucket) => bucket.count), 1)
    const maxBugThroughput = Math.max(...bugBuckets.map((bucket) => bucket.count), 1)
    const maxMixTotal = Math.max(...mixBuckets.map((bucket) => bucket.total), 1)

    const throughputSeries = throughputBuckets.map((bucket) => ({
      label: `${format(bucket.start, "MMM d")} - ${format(bucket.end, "MMM d")}`,
      count: bucket.count,
      height: Math.round((bucket.count / maxThroughput) * 100),
    }))

    const bugSeries = bugBuckets.map((bucket) => ({
      label: `${format(bucket.start, "MMM d")} - ${format(bucket.end, "MMM d")}`,
      count: bucket.count,
      height: Math.round((bucket.count / maxBugThroughput) * 100),
    }))

    const mixTrendSeries = mixBuckets.map((bucket) => ({
      label: `${format(bucket.start, "MMM d")} - ${format(bucket.end, "MMM d")}`,
      total: bucket.total,
      bug: bucket.bug,
      improvement: bucket.improvement,
      task: bucket.task,
      height: Math.round((bucket.total / maxMixTotal) * 100),
    }))
    const mixTrendTotal = mixBuckets.reduce((acc, bucket) => acc + bucket.total, 0)

    const workMix = tasksInRange.reduce(
      (acc, task) => {
        acc[task.type] += 1
        return acc
      },
      { bug: 0, improvement: 0, task: 0 },
    )

    const openBugs = tasksInRange.filter((task) => task.type === "bug" && task.status !== "done")
    const bugTotal = completedBugsInRange.length + openBugs.length
    const bugClearanceRate = bugTotal ? Math.round((completedBugsInRange.length / bugTotal) * 100) : 0

    const rangeLabelText = `${format(rangeStart, "MMM d")} - ${format(rangeEnd, "MMM d, yyyy")}`

    const kpis = [
      {
        title: "On-track projects",
        value: `${onTrackProjects.length}/${activeProjects.length}`,
        description: `${onTrackRate}% on schedule across active work`,
        tooltip: "Number of active or planned projects that are on track or ahead vs total active/planned projects.",
        icon: <CheckCircle className="h-4 w-4" weight="fill" />,
        tone: onTrackRate >= 70 ? "positive" : onTrackRate >= 50 ? "warning" : "danger",
      },
      {
        title: "Overdue tasks",
        value: String(overdueTasks.length),
        description: "Tasks past their planned end date",
        tooltip: "Tasks not done and whose end date is earlier than the selected end date.",
        icon: <Clock className="h-4 w-4" />,
        tone: overdueTasks.length > 6 ? "danger" : overdueTasks.length > 2 ? "warning" : "neutral",
      },
      {
        title: "Completed in range",
        value: String(completedInRange.length),
        description: rangeLabelText,
        tooltip: "Count of tasks completed within the selected date range.",
        icon: <ChartBar className="h-4 w-4" />,
        tone: completedInRange.length > 10 ? "positive" : "neutral",
      },
      {
        title: "Projects at risk",
        value: String(riskProjectsAll.length),
        description: "Projects behind or at risk vs schedule",
        tooltip: "Projects whose progress is behind schedule (Behind/At risk).",
        icon: <WarningOctagon className="h-4 w-4" weight="fill" />,
        tone: riskProjectsAll.length > 3 ? "danger" : riskProjectsAll.length > 1 ? "warning" : "neutral",
      },
    ] as const

    return {
      kpis,
      healthRows,
      riskProjects,
      workMix,
      workMixTotal: tasksInRange.length,
      bugSeries,
      bugSummary: {
        open: openBugs.length,
        completed: completedBugsInRange.length,
        clearanceRate: bugClearanceRate,
      },
      mixTrendSeries,
      mixTrendTotal,
      throughputSeries,
      rangeLabel: rangeLabelText,
      filteredProjectCount: scopedProjects.length,
    }
  }, [dateRange.end, dateRange.start, rangeId, selectedMember, selectedProjectId])

  const workMixPercent = {
    bug: workMixTotal ? (workMix.bug / workMixTotal) * 100 : 0,
    improvement: workMixTotal ? (workMix.improvement / workMixTotal) * 100 : 0,
    task: workMixTotal ? (workMix.task / workMixTotal) * 100 : 0,
  }

  const totalThroughput = throughputSeries.reduce((acc, item) => acc + item.count, 0)
  const totalBugThroughput = bugSeries.reduce((acc, item) => acc + item.count, 0)

  const handleResetFilters = () => {
    setSelectedProjectId("all")
    setSelectedMember("all")
    setRangeId("30d")
    setDateRange({ start: "", end: "" })
    setIsCustomRangeOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col bg-background mx-2 my-2 border border-border rounded-lg min-w-0">
      <header className="flex flex-col border-b border-border/40">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-accent text-muted-foreground" />
            <p className="text-base font-medium text-foreground">Performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8">
              Export
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-3 pt-3">
          <div className="flex items-center gap-2">
            <PerformanceFilterPopover
              projects={projects}
              value={{ projectId: selectedProjectId, member: selectedMember }}
              onApply={({ projectId, member }) => {
                setSelectedProjectId(projectId)
                setSelectedMember(member)
              }}
              onClear={() => {
                setSelectedProjectId("all")
                setSelectedMember("all")
              }}
            />
            <ChipOverflow chips={filterChips} onRemove={handleRemoveChip} maxVisible={6} />
          </div>
          <div className="flex items-center gap-2">
            <Select value={rangeId} onValueChange={(value) => setRangeId(value as RangeId)}>
              <SelectTrigger className="h-8 w-[170px] rounded-lg border-border/60 bg-transparent px-3">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {RANGE_OPTIONS.map((range) => (
                  <SelectItem key={range.id} value={range.id}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {rangeId === "custom" && (
              <Popover open={isCustomRangeOpen} onOpenChange={setIsCustomRangeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 rounded-lg border-border/60 bg-transparent px-3"
                  >
                    <CalendarBlank className="h-4 w-4" />
                    {rangeLabel}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 rounded-xl">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-muted-foreground">Start date</p>
                      <Input
                        type="date"
                        value={dateRange.start}
                        onChange={(event) => setDateRange((prev) => ({ ...prev, start: event.target.value }))}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-muted-foreground">End date</p>
                      <Input
                        type="date"
                        value={dateRange.end}
                        onChange={(event) => setDateRange((prev) => ({ ...prev, end: event.target.value }))}
                        className="h-9"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarBlank className="h-4 w-4" />
            <span>Showing performance for: {rangeLabel}</span>
          </div>
          <span>{filteredProjectCount} projects | {workMixTotal} tasks in range</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <MetricCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              description={kpi.description}
              tooltip={kpi.tooltip}
              icon={kpi.icon}
              tone={kpi.tone}
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Card className="border-border/60 bg-card/70 flex flex-col">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-base font-semibold">Throughput trend</CardTitle>
                <p className="text-xs text-muted-foreground">Completed tasks in range ({rangeLabel})</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                Total {totalThroughput} tasks
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col py-10">
              {totalThroughput === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                  No completed tasks available for the selected range.
                </div>
              ) : (
                <div className="flex flex-col flex-1">
                  <div
                    className="grid gap-3 items-end flex-1 min-h-[140px]"
                    style={{ gridTemplateColumns: `repeat(${throughputSeries.length}, minmax(0, 1fr))` }}
                  >
                    {throughputSeries.map((item) => (
                      <Tooltip key={item.label}>
                        <TooltipTrigger asChild>
                          <div className="flex h-full w-full items-end rounded-md p-1 transition-colors hover:bg-muted">
                            <div
                              className={cn(
                                "w-full rounded-md bg-primary/15",
                                item.count > 0 && "bg-primary/30",
                              )}
                              style={{ height: `${Math.max(8, item.height)}%` }}
                            >
                              <div className="h-full w-full rounded-md bg-primary/70" />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          {item.count} tasks
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                  <div
                    className="grid gap-3 mt-3"
                    style={{ gridTemplateColumns: `repeat(${throughputSeries.length}, minmax(0, 1fr))` }}
                  >
                    {throughputSeries.map((item) => (
                      <div key={item.label} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground text-center leading-tight">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border/60 bg-card/70">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-base font-semibold">Work mix</CardTitle>
                  <p className="text-xs text-muted-foreground">Distribution of work types in range</p>
                </div>
                <div className="text-xs text-muted-foreground">{workMixTotal} tasks</div>
              </CardHeader>
              <CardContent>
                {workMixTotal === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                    No tasks available for the selected filters.
                  </div>
                ) : (
                  <>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="flex h-full w-full">
                        <div className="h-full bg-rose-500" style={{ width: `${workMixPercent.bug}%` }} />
                        <div className="h-full bg-amber-500" style={{ width: `${workMixPercent.improvement}%` }} />
                        <div className="h-full bg-blue-500" style={{ width: `${workMixPercent.task}%` }} />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                          Bug
                        </span>
                        <span className="text-foreground">{workMix.bug}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                          Improvement
                        </span>
                        <span className="text-foreground">{workMix.improvement}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                          Task
                        </span>
                        <span className="text-foreground">{workMix.task}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/70 flex flex-col flex-1">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-base font-semibold">Bug clearance</CardTitle>
                  <p className="text-xs text-muted-foreground">Completed bugs in range</p>
                </div>
                <WarningOctagon className="h-4 w-4 text-rose-500" weight="fill" />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-3">
                {bugSummary.open === 0 && totalBugThroughput === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                    No bug data available for the selected filters.
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Open bugs</span>
                      <Badge variant="outline" className="rounded-full px-2 py-0.5 text-rose-600 border-rose-200">
                        {bugSummary.open}
                      </Badge>
                    </div>
                    <div className="flex flex-col flex-1">
                      <div
                        className="grid gap-3 items-end flex-1 min-h-[100px]"
                        style={{ gridTemplateColumns: `repeat(${bugSeries.length}, minmax(0, 1fr))` }}
                      >
                        {bugSeries.map((item) => (
                          <Tooltip key={item.label}>
                            <TooltipTrigger asChild>
                              <div className="flex h-full w-full items-end rounded-md p-1 transition-colors hover:bg-rose-500/10">
                                <div
                                  className="w-full rounded-md bg-rose-500/20"
                                  style={{ height: `${Math.max(6, item.height)}%` }}
                                >
                                  <div className="h-full w-full rounded-md bg-rose-500/70" />
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                              {item.count} bugs
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                      <div
                        className="grid gap-3 mt-2"
                        style={{ gridTemplateColumns: `repeat(${bugSeries.length}, minmax(0, 1fr))` }}
                      >
                        {bugSeries.map((item) => (
                          <div key={item.label} className="flex flex-col items-center gap-0.5">
                            <span className="text-[10px] text-muted-foreground text-center leading-tight">
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="space-y-4">
            <Card className="border-border/60 bg-card/70">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-base font-semibold">Delivery risk</CardTitle>
                  <p className="text-xs text-muted-foreground">Projects falling behind schedule</p>
                </div>
                <WarningOctagon className="h-4 w-4 text-rose-500" weight="fill" />
              </CardHeader>
              <CardContent className="space-y-4">
                {riskProjects.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                    No projects are currently flagged as at risk.
                  </div>
                )}
                {riskProjects.map((project) => (
                  <div key={project.id} className="rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{project.name}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge className={cn("rounded-full px-2 py-0.5", getStatusBadgeClass(project.status))}>
                            {getStatusLabel(project.status)}
                          </Badge>
                          <span>{project.taskCount} tasks</span>
                        </div>
                      </div>
                      <Badge className={cn("rounded-full px-2 py-0.5", getHealthBadgeClass(project.health.tone))}>
                        {project.health.label}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {project.variance < 0 ? (
                          <ArrowDown className="h-3 w-3 text-rose-500" />
                        ) : (
                          <ArrowUp className="h-3 w-3 text-emerald-500" />
                        )}
                        {Math.abs(project.variance)}% vs schedule
                      </div>
                      <span>{getDueLabel(project.daysToDue)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60 bg-card/70 flex flex-col">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-base font-semibold">Work mix trend</CardTitle>
                <p className="text-xs text-muted-foreground">Completed tasks by type over time ({rangeLabel})</p>
              </div>
              <div className="text-xs text-muted-foreground">{mixTrendTotal} tasks</div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-10">
              {mixTrendTotal === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                  No completed tasks available for the selected range.
                </div>
              ) : (
                <>
                  <div className="flex flex-col flex-1">
                    <div
                      className="grid items-end gap-3 flex-1 min-h-[140px]"
                      style={{ gridTemplateColumns: `repeat(${mixTrendSeries.length}, minmax(0, 1fr))` }}
                    >
                      {mixTrendSeries.map((item) => (
                        <Tooltip key={item.label}>
                          <TooltipTrigger asChild>
                            <div className="flex h-full w-full items-end rounded-md p-1 transition-colors hover:bg-muted">
                              <div
                                className="flex w-full flex-col justify-end overflow-hidden rounded-md bg-muted/40"
                                style={{ height: `${Math.max(8, item.height)}%` }}
                              >
                                {item.total > 0 ? (
                                  <>
                                    <div
                                      className="w-full bg-rose-500/80"
                                      style={{ height: `${(item.bug / item.total) * 100}%` }}
                                    />
                                    <div
                                      className="w-full bg-amber-500/80"
                                      style={{ height: `${(item.improvement / item.total) * 100}%` }}
                                    />
                                    <div
                                      className="w-full bg-blue-500/80"
                                      style={{ height: `${(item.task / item.total) * 100}%` }}
                                    />
                                  </>
                                ) : (
                                  <div className="h-full w-full rounded-md bg-muted/60" />
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            {item.total} tasks
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                    <div
                      className="grid gap-3 mt-3"
                      style={{ gridTemplateColumns: `repeat(${mixTrendSeries.length}, minmax(0, 1fr))` }}
                    >
                      {mixTrendSeries.map((item) => (
                        <div key={item.label} className="flex flex-col items-center gap-1">
                          <span className="text-[10px] text-muted-foreground text-center leading-tight">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                      Bug
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                      Improvement
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                      Task
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/60 bg-card/70">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold">Project health</CardTitle>
              <p className="text-xs text-muted-foreground">Actual progress vs schedule and delivery status</p>
            </div>
            <div className="text-xs text-muted-foreground">{filteredProjectCount} projects tracked</div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {healthRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                        No projects match the selected filters.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  healthRows.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ProgressCircle
                            progress={project.progress}
                            color={getProgressColor(project.progress)}
                            size={20}
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{project.name}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge className={cn("rounded-full px-2 py-0.5", getStatusBadgeClass(project.status))}>
                                {getStatusLabel(project.status)}
                              </Badge>
                              <span>{project.taskCount} tasks</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-[180px] space-y-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Actual</span>
                            <span className="text-foreground font-medium">{project.progress}%</span>
                          </div>
                          <Progress
                            value={project.progress}
                            className="h-2 [&_[data-slot=progress-indicator]]:bg-emerald-500"
                          />
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>Schedule</span>
                            <span>{project.schedule}%</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={cn("rounded-full px-2 py-0.5", getHealthBadgeClass(project.health.tone))}>
                            {project.health.label}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {project.variance < 0 ? (
                              <ArrowDown className="h-3 w-3 text-rose-500" />
                            ) : (
                              <ArrowUp className="h-3 w-3 text-emerald-500" />
                            )}
                            {Math.abs(project.variance)}% vs schedule
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm text-foreground">
                            {format(project.endDate, "MMM d")}
                          </div>
                          <div className={cn(
                            "text-xs",
                            project.daysToDue < 0 ? "text-rose-600" : "text-muted-foreground",
                          )}>
                            {getDueLabel(project.daysToDue)}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
