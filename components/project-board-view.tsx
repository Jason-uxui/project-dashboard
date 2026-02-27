"use client"

import React, { useEffect, useMemo, useState } from "react"
import type { Project } from "@/lib/data/projects"
import { ProjectCard } from "@/components/project-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  DotsThreeVertical,
  Plus,
  StackSimple,
  Spinner,
  CircleNotch,
  CheckCircle,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react/dist/ssr"

function columnStatusIcon(status: Project["status"]): React.JSX.Element {
  switch (status) {
    case "backlog":
      return <StackSimple className="h-4 w-4 text-muted-foreground" />
    case "planned":
      return <Spinner className="h-4 w-4 text-muted-foreground" />
    case "active":
      return <CircleNotch className="h-4 w-4 text-muted-foreground" />
    case "completed":
      return <CheckCircle className="h-4 w-4 text-muted-foreground" />
    default:
      return <StackSimple className="h-4 w-4 text-muted-foreground" />
  }
}

type ProjectBoardViewProps = {
  projects: Project[]
  loading?: boolean
  onAddProject?: () => void
  onProjectStatusChange?: (projectId: string, status: Project["status"]) => Promise<void> | void
  onRenameProject?: (projectId: string, currentName: string) => Promise<void> | void
  onDeleteProject?: (projectId: string, currentName: string) => Promise<void> | void
}

const COLUMN_ORDER: Array<Project["status"]> = ["backlog", "planned", "active", "completed"]

function columnStatusLabel(status: Project["status"]): string {
  switch (status) {
    case "backlog":
      return "Backlog"
    case "planned":
      return "Planned"
    case "active":
      return "Active"
    case "completed":
      return "Completed"
    case "cancelled":
      return "Cancelled"
    default:
      return status
  }
}

export function ProjectBoardView({
  projects,
  loading = false,
  onAddProject,
  onProjectStatusChange,
  onRenameProject,
  onDeleteProject,
}: ProjectBoardViewProps) {
  const [items, setItems] = useState<Project[]>(projects)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  useEffect(() => {
    setItems(projects)
  }, [projects])

  const groups = useMemo(() => {
    const m = new Map<Project["status"], Project[]>()
    for (const s of COLUMN_ORDER) m.set(s, [])
    for (const p of items) m.get(p.status)!.push(p)
    return m
  }, [items])

  const onDropTo = (status: Project["status"]) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/id")
    if (!id) return
    setDraggingId(null)
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
    void onProjectStatusChange?.(id, status)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const draggableCard = (p: Project) => (
    <div
      key={p.id}
      draggable
      className={`transition-all ${
        draggingId === p.id
          ? "cursor-grabbing opacity-70 shadow-lg shadow-lg/20 scale-[0.98]"
          : "cursor-grab"
      }`}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/id", p.id)
        setDraggingId(p.id)
      }}
      onDragEnd={() => setDraggingId(null)}
    >
      <ProjectCard
        project={p}
        variant="board"
        actions={
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                <DotsThreeVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2" align="end">
              <div className="space-y-1">
                {COLUMN_ORDER.map((s) => (
                  <button
                    key={s}
                    className="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-accent"
                    onClick={() => {
                      setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: s } : x)))
                      void onProjectStatusChange?.(p.id, s)
                    }}
                  >
                    Move to {columnStatusLabel(s)}
                  </button>
                ))}
                <div className="my-1 h-px bg-border" />
                <button
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent"
                  onClick={() => void onRenameProject?.(p.id, p.name)}
                >
                  <PencilSimple className="h-4 w-4" />
                  Rename
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm text-red-600 hover:bg-red-50"
                  onClick={() => void onDeleteProject?.(p.id, p.name)}
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </PopoverContent>
          </Popover>
        }
      />
    </div>
  )

  if (loading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {COLUMN_ORDER.map((s) => (
            <div key={s} className="rounded-xl bg-background/60">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/60">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-6" />
              </div>
              <div className="p-3 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const total = items.length
  if (total === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">No projects found</div>
    )
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {COLUMN_ORDER.map((status) => (
          <div
            key={status}
            className="rounded-xl bg-muted"
            onDragOver={onDragOver}
            onDrop={onDropTo(status)}
          >
            <div className="flex items-center justify-between px-3 py-3">
              <div className="flex items-center gap-2">
                {columnStatusIcon(status)}
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  {columnStatusLabel(status)}
                </span>
                <span className="text-xs text-muted-foreground">{groups.get(status)?.length ?? 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg"
                  type="button"
                  onClick={onAddProject}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg"
                  type="button"
                >
                  <DotsThreeVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="px-3 pb-3 space-y-3 min-h-[120px]">
              {(groups.get(status) ?? []).map(draggableCard)}
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={onAddProject}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add project
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
