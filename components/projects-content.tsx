"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { ProjectHeader } from "@/components/project-header"
import { ProjectTimeline } from "@/components/project-timeline"
import { ProjectCardsView } from "@/components/project-cards-view"
import { ProjectBoardView } from "@/components/project-board-view"
import { ProjectWizard } from "@/components/project-wizard/ProjectWizard"
import { computeFilterCounts, type Project } from "@/lib/data/projects"
import { DEFAULT_VIEW_OPTIONS, type FilterChip, type ViewOptions } from "@/lib/view-options"
import { chipsToParams, paramsToChips } from "@/lib/url/filters"
import { useProjectsCrud, type CreateProjectInput } from "@/hooks/use-projects-crud"
import { Button } from "@/components/ui/button"

export function ProjectsContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {
    projects,
    isLoading,
    isMutating,
    error,
    refetch,
    createProject,
    updateProject,
    deleteProject,
    updateTask,
  } = useProjectsCrud()

  const [viewOptions, setViewOptions] = useState<ViewOptions>(DEFAULT_VIEW_OPTIONS)

  const [filters, setFilters] = useState<FilterChip[]>([])

  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const isSyncingRef = useRef(false)
  const prevParamsRef = useRef<string>("")

  const openWizard = () => {
    setIsWizardOpen(true)
  }

  const closeWizard = () => {
    setIsWizardOpen(false)
  }

  const handleProjectCreated = async (input: CreateProjectInput) => {
    await createProject(input)
    setIsWizardOpen(false)
    toast.success("Project created successfully")
  }

  const removeFilter = (key: string, value: string) => {
    const next = filters.filter((f) => !(f.key === key && f.value === value))
    setFilters(next)
    replaceUrlFromChips(next)
  }

  const applyFilters = (chips: FilterChip[]) => {
    setFilters(chips)
    replaceUrlFromChips(chips)
  }

  useEffect(() => {
    const currentParams = searchParams.toString()

    // Only sync if this is the first load or if params actually changed (not from our own update)
    if (prevParamsRef.current === currentParams) return

    // If we just made an update, skip this sync to avoid feedback loop
    if (isSyncingRef.current) {
      isSyncingRef.current = false
      return
    }

    prevParamsRef.current = currentParams
    const params = new URLSearchParams(searchParams.toString())
    const chips = paramsToChips(params)
    setFilters(chips)
  }, [searchParams])

  const replaceUrlFromChips = (chips: FilterChip[]) => {
    const params = chipsToParams(chips)
    const qs = params.toString()
    const url = qs ? `${pathname}?${qs}` : pathname

    isSyncingRef.current = true
    prevParamsRef.current = qs
    router.replace(url, { scroll: false })
  }
  const filteredProjects = useMemo(() => {
    let list = projects.slice()

    // Apply showClosedProjects toggle
    if (!viewOptions.showClosedProjects) {
      list = list.filter((p) => p.status !== "completed" && p.status !== "cancelled")
    }

    // Build filter buckets from chips
    const statusSet = new Set<string>()
    const prioritySet = new Set<string>()
    const tagSet = new Set<string>()
    const memberSet = new Set<string>()

    for (const { key, value } of filters) {
      const k = key.trim().toLowerCase()
      const v = value.trim().toLowerCase()
      if (k.startsWith("status")) statusSet.add(v)
      else if (k.startsWith("priority")) prioritySet.add(v)
      else if (k.startsWith("tag")) tagSet.add(v)
      else if (k === "pic" || k.startsWith("member")) memberSet.add(v)
    }

    if (statusSet.size) list = list.filter((p) => statusSet.has(p.status.toLowerCase()))
    if (prioritySet.size) list = list.filter((p) => prioritySet.has(p.priority.toLowerCase()))
    if (tagSet.size) list = list.filter((p) => p.tags.some((t) => tagSet.has(t.toLowerCase())))
    if (memberSet.size) {
      const members = Array.from(memberSet)
      list = list.filter((p) => p.members.some((m) => members.some((mv) => m.toLowerCase().includes(mv))))
    }

    // Ordering
    const sorted = list.slice()
    if (viewOptions.ordering === "alphabetical") sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (viewOptions.ordering === "date") sorted.sort((a, b) => (a.endDate?.getTime() || 0) - (b.endDate?.getTime() || 0))
    return sorted
  }, [filters, viewOptions, projects])

  const handleProjectStatusChange = async (projectId: string, status: Project["status"]) => {
    try {
      await updateProject(projectId, { status })
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : "Failed to update project status.")
      await refetch()
    }
  }

  const handleTaskStatusChange = async (
    _projectId: string,
    taskId: string,
    status: Project["tasks"][number]["status"]
  ) => {
    try {
      await updateTask(taskId, { status })
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : "Failed to update task status.")
      await refetch()
    }
  }

  const handleTaskDatesChange = async (
    _projectId: string,
    taskId: string,
    startDate: Date,
    endDate: Date
  ) => {
    try {
      await updateTask(taskId, { startDate, endDate })
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : "Failed to update task dates.")
      await refetch()
    }
  }

  const handleProjectDatesChange = async (projectId: string, startDate: Date, endDate: Date) => {
    try {
      await updateProject(projectId, { startDate, endDate })
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : "Failed to update project dates.")
      await refetch()
    }
  }

  const handleRenameProject = async (projectId: string, currentName: string) => {
    const nextName = window.prompt("Rename project", currentName)
    const normalizedName = nextName?.trim()
    if (!normalizedName || normalizedName === currentName) return

    try {
      await updateProject(projectId, { name: normalizedName })
      toast.success("Project renamed")
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : "Failed to rename project.")
    }
  }

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    const shouldDelete = window.confirm(`Delete "${projectName}"? This action cannot be undone.`)
    if (!shouldDelete) return

    try {
      await deleteProject(projectId)
      toast.success("Project deleted")
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : "Failed to delete project.")
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-background mx-2 my-2 border border-border rounded-lg min-w-0">
      <ProjectHeader
        filters={filters}
        onRemoveFilter={removeFilter}
        onFiltersChange={applyFilters}
        counts={computeFilterCounts(filteredProjects)}
        viewOptions={viewOptions}
        onViewOptionsChange={setViewOptions}
        onAddProject={openWizard}
      />
      {error && (
        <div className="mx-4 mt-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="h-7"
            onClick={() => void refetch()}
            disabled={isLoading || isMutating}
          >
            Retry
          </Button>
        </div>
      )}
      {viewOptions.viewType === "timeline" && (
        <ProjectTimeline
          projects={filteredProjects}
          loading={isLoading}
          onTaskStatusChange={handleTaskStatusChange}
          onTaskDatesChange={handleTaskDatesChange}
          onProjectDatesChange={handleProjectDatesChange}
        />
      )}
      {viewOptions.viewType === "list" && (
        <ProjectCardsView
          projects={filteredProjects}
          loading={isLoading}
          onCreateProject={openWizard}
          onProjectStatusChange={handleProjectStatusChange}
          onRenameProject={handleRenameProject}
          onDeleteProject={handleDeleteProject}
        />
      )}
      {viewOptions.viewType === "board" && (
        <ProjectBoardView
          projects={filteredProjects}
          loading={isLoading}
          onAddProject={openWizard}
          onProjectStatusChange={handleProjectStatusChange}
          onRenameProject={handleRenameProject}
          onDeleteProject={handleDeleteProject}
        />
      )}
      {isWizardOpen && (
        <ProjectWizard onClose={closeWizard} onCreate={handleProjectCreated} />
      )}
    </div>
  )
}
