"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import { ChartBar, DotsSixVertical, FolderSimple, Plus, Sparkle } from "@phosphor-icons/react/dist/ssr"
import {
  DndContext,
  type DragEndEvent,
  closestCenter,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { projects, type Project, type FilterCounts } from "@/lib/data/projects"
import { getProjectDetailsById, getProjectTasks, type ProjectTask } from "@/lib/data/project-details"
import { DEFAULT_VIEW_OPTIONS, type FilterChip as FilterChipType, type ViewOptions } from "@/lib/view-options"
import { TaskWeekBoardView } from "@/components/tasks/TaskWeekBoardView"
import {
  ProjectTaskGroup,
  ProjectTaskListView,
  filterTasksByChips,
  computeTaskFilterCounts,
  ProjectTasksSection,
} from "@/components/tasks/task-helpers"
import { TaskRowBase } from "@/components/tasks/TaskRowBase"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProgressCircle } from "@/components/progress-circle"
import { FilterPopover } from "@/components/filter-popover"
import { ChipOverflow } from "@/components/chip-overflow"
import { ViewOptionsPopover } from "@/components/view-options-popover"
import { cn } from "@/lib/utils"
import { TaskQuickCreateModal, type CreateTaskContext } from "@/components/tasks/TaskQuickCreateModal"

export function MyTasksPage() {
  const [groups, setGroups] = useState<ProjectTaskGroup[]>(() => {
    return projects
      .map((project) => {
        const details = getProjectDetailsById(project.id)
        const tasks = getProjectTasks(details)
        return { project, tasks }
      })
      .filter((group) => group.tasks.length > 0)
  })

  const [filters, setFilters] = useState<FilterChipType[]>([{ key: "members", value: "jason" }])
  const [viewOptions, setViewOptions] = useState<ViewOptions>(DEFAULT_VIEW_OPTIONS)

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [createContext, setCreateContext] = useState<CreateTaskContext | undefined>(undefined)
  const [editingTask, setEditingTask] = useState<ProjectTask | undefined>(undefined)

  const counts = useMemo<FilterCounts>(() => {
    const allTasks = groups.flatMap((g) => g.tasks)
    return computeTaskFilterCounts(allTasks)
  }, [groups])

  const visibleGroups = useMemo<ProjectTaskGroup[]>(() => {
    if (!filters.length) return groups

    return groups
      .map((group) => ({
        project: group.project,
        tasks: filterTasksByChips(group.tasks, filters),
      }))
      .filter((group) => group.tasks.length > 0)
  }, [groups, filters])

  const allVisibleTasks = useMemo<ProjectTask[]>(() => {
    return visibleGroups.flatMap((group) => group.tasks)
  }, [visibleGroups])

  const openCreateTask = (context?: CreateTaskContext) => {
    setEditingTask(undefined)
    setCreateContext(context)
    setIsCreateTaskOpen(true)
  }

  const openEditTask = (task: ProjectTask) => {
    setEditingTask(task)
    setCreateContext(undefined)
    setIsCreateTaskOpen(true)
  }

  const handleTaskCreated = (task: ProjectTask) => {
    setGroups((prev) => {
      const projectExists = prev.some((g) => g.project.id === task.projectId)
      const project = projects.find((p) => p.id === task.projectId)

      const ensureGroup = (current: ProjectTaskGroup[]): ProjectTaskGroup[] => {
        if (projectExists || !project) return current
        const details = getProjectDetailsById(project.id)
        const existingTasks = getProjectTasks(details)
        return [
          { project, tasks: [...existingTasks, task] },
          ...current,
        ]
      }

      const next = prev.map((group) => {
        if (group.project.id !== task.projectId) return group
        return {
          ...group,
          tasks: [...group.tasks, task],
        }
      })

      return ensureGroup(next)
    })
  }

  const toggleTask = (taskId: string) => {
    setGroups((prev) =>
      prev.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: task.status === "done" ? "todo" : "done",
              }
            : task,
        ),
      })),
    )
  }

  const changeTaskTag = (taskId: string, tagLabel?: string) => {
    setGroups((prev) =>
      prev.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                tag: tagLabel,
              }
            : task,
        ),
      })),
    )
  }

  const moveTaskDate = (taskId: string, newDate: Date) => {
    setGroups((prev) =>
      prev.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                startDate: newDate,
              }
            : task,
        ),
      })),
    )
  }

  const handleTaskUpdated = (updated: ProjectTask) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.project.id === updated.projectId
          ? {
              ...group,
              tasks: group.tasks.map((task) => (task.id === updated.id ? updated : task)),
            }
          : group,
      ),
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    // Find the group containing the active task
    const activeGroupIndex = groups.findIndex((group) =>
      group.tasks.some((task) => task.id === active.id)
    )

    if (activeGroupIndex === -1) return

    const activeGroup = groups[activeGroupIndex]

    // Find the group containing the over task
    const overGroupIndex = groups.findIndex((group) =>
      group.tasks.some((task) => task.id === over.id)
    )

    if (overGroupIndex === -1) return

    // For now, only allow reordering within the same group
    if (activeGroupIndex !== overGroupIndex) return

    const activeIndex = activeGroup.tasks.findIndex((task) => task.id === active.id)
    const overIndex = activeGroup.tasks.findIndex((task) => task.id === over.id)

    if (activeIndex === -1 || overIndex === -1) return

    const reorderedTasks = arrayMove(activeGroup.tasks, activeIndex, overIndex)

    setGroups((prev) =>
      prev.map((group, index) =>
        index === activeGroupIndex ? { ...group, tasks: reorderedTasks } : group
      )
    )
  }

  if (!visibleGroups.length) {
    return (
      <div className="flex flex-1 flex-col min-h-0 bg-background mx-2 my-2 border border-border rounded-lg min-w-0">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border/70">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight">Tasks</h1>
            <p className="text-xs text-muted-foreground">No tasks available yet.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col min-h-0 bg-background mx-2 my-2 border border-border rounded-lg min-w-0">
      <header className="flex flex-col border-b border-border/40">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/70">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-accent text-muted-foreground" />
            <p className="text-base font-medium text-foreground">Tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => openCreateTask()}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-3 pt-3">
          <div className="flex items-center gap-2">
            <FilterPopover
              initialChips={filters}
              onApply={setFilters}
              onClear={() => setFilters([])}
              counts={counts}
            />
            <ChipOverflow
              chips={filters}
              onRemove={(key, value) =>
                setFilters((prev) => prev.filter((chip) => !(chip.key === key && chip.value === value)))
              }
              maxVisible={6}
            />
          </div>
          <div className="flex items-center gap-2">
            <ViewOptionsPopover options={viewOptions} onChange={setViewOptions} allowedViewTypes={["list", "board"]} />
            <div className="relative">
              <div className="relative">
                <Button className="h-8 gap-2 shadow-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 relative z-10 px-3">
                  <Sparkle className="h-4 w-4" weight="fill" />
                  Ask AI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 space-y-4 overflow-y-auto px-4 py-4">
        {viewOptions.viewType === "list" && (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <ProjectTaskListView
              groups={visibleGroups}
              onToggleTask={toggleTask}
              onAddTask={(context) => openCreateTask(context)}
            />
          </DndContext>
        )}
        {viewOptions.viewType === "board" && (
          <TaskWeekBoardView
            tasks={allVisibleTasks}
            onAddTask={(context) => openCreateTask(context)}
            onToggleTask={toggleTask}
            onChangeTag={changeTaskTag}
            onMoveTaskDate={moveTaskDate}
            onOpenTask={openEditTask}
          />
        )}
      </div>

      <TaskQuickCreateModal
        open={isCreateTaskOpen}
        onClose={() => {
          setIsCreateTaskOpen(false)
          setEditingTask(undefined)
          setCreateContext(undefined)
        }}
        context={editingTask ? undefined : createContext}
        onTaskCreated={handleTaskCreated}
        editingTask={editingTask}
        onTaskUpdated={handleTaskUpdated}
      />
    </div>
  )
}
