'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Project } from '@/lib/data/projects'
import {
  createProject as createProjectRequest,
  createTask as createTaskRequest,
  deleteProject as deleteProjectRequest,
  deleteTask as deleteTaskRequest,
  listProjects,
  updateProject as updateProjectRequest,
  updateTask as updateTaskRequest,
  type CreateProjectInput,
  type CreateTaskInput,
  type TaskRecord,
  type UpdateProjectInput,
  type UpdateTaskInput,
} from '@/lib/projects/api'

type UseProjectsCrudReturn = {
  projects: Project[]
  isLoading: boolean
  isMutating: boolean
  error: string | null
  refetch: () => Promise<void>
  createProject: (input: CreateProjectInput) => Promise<Project>
  updateProject: (projectId: string, input: UpdateProjectInput) => Promise<Project>
  deleteProject: (projectId: string) => Promise<void>
  createTask: (input: CreateTaskInput) => Promise<TaskRecord>
  updateTask: (taskId: string, input: UpdateTaskInput) => Promise<TaskRecord>
  deleteTask: (taskId: string) => Promise<void>
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong while syncing projects.'
}

function calculateProgressFromTasks(tasks: Project['tasks']): number {
  if (tasks.length === 0) return 0
  const doneCount = tasks.filter((task) => task.status === 'done').length
  return Math.round((doneCount / tasks.length) * 100)
}

function mergeTaskIntoProject(project: Project, task: TaskRecord): Project {
  if (project.id !== task.projectId) return project

  const existingIndex = project.tasks.findIndex((projectTask) => projectTask.id === task.id)
  const updatedTask = {
    id: task.id,
    name: task.name,
    type: task.type,
    assignee: task.assignee,
    status: task.status,
    startDate: task.startDate,
    endDate: task.endDate,
  }

  const nextTasks =
    existingIndex === -1
      ? [...project.tasks, updatedTask]
      : project.tasks.map((projectTask) =>
          projectTask.id === task.id ? updatedTask : projectTask
        )

  return {
    ...project,
    tasks: nextTasks,
    taskCount: nextTasks.length,
    progress: calculateProgressFromTasks(nextTasks),
  }
}

export function useProjectsCrud(): UseProjectsCrudReturn {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    try {
      setError(null)
      const nextProjects = await listProjects()
      setProjects(nextProjects)
    } catch (nextError) {
      setError(getErrorMessage(nextError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const createProject = useCallback(async (input: CreateProjectInput) => {
    setIsMutating(true)
    try {
      setError(null)
      const createdProject = await createProjectRequest(input)
      setProjects((prev) => [createdProject, ...prev])
      return createdProject
    } catch (nextError) {
      const nextMessage = getErrorMessage(nextError)
      setError(nextMessage)
      throw new Error(nextMessage)
    } finally {
      setIsMutating(false)
    }
  }, [])

  const updateProject = useCallback(async (projectId: string, input: UpdateProjectInput) => {
    setIsMutating(true)
    try {
      setError(null)
      const updatedProject = await updateProjectRequest(projectId, input)
      setProjects((prev) =>
        prev.map((project) => (project.id === projectId ? updatedProject : project))
      )
      return updatedProject
    } catch (nextError) {
      const nextMessage = getErrorMessage(nextError)
      setError(nextMessage)
      throw new Error(nextMessage)
    } finally {
      setIsMutating(false)
    }
  }, [])

  const deleteProject = useCallback(async (projectId: string) => {
    setIsMutating(true)
    try {
      setError(null)
      await deleteProjectRequest(projectId)
      setProjects((prev) => prev.filter((project) => project.id !== projectId))
    } catch (nextError) {
      const nextMessage = getErrorMessage(nextError)
      setError(nextMessage)
      throw new Error(nextMessage)
    } finally {
      setIsMutating(false)
    }
  }, [])

  const createTask = useCallback(async (input: CreateTaskInput) => {
    setIsMutating(true)
    try {
      setError(null)
      const createdTask = await createTaskRequest(input)
      setProjects((prev) => prev.map((project) => mergeTaskIntoProject(project, createdTask)))
      return createdTask
    } catch (nextError) {
      const nextMessage = getErrorMessage(nextError)
      setError(nextMessage)
      throw new Error(nextMessage)
    } finally {
      setIsMutating(false)
    }
  }, [])

  const updateTask = useCallback(async (taskId: string, input: UpdateTaskInput) => {
    setIsMutating(true)
    try {
      setError(null)
      const updatedTask = await updateTaskRequest(taskId, input)
      setProjects((prev) => {
        const removedFromOldProject = prev.map((project) => {
          const nextTasks = project.tasks.filter((projectTask) => projectTask.id !== updatedTask.id)
          if (nextTasks.length === project.tasks.length) return project
          return {
            ...project,
            tasks: nextTasks,
            taskCount: nextTasks.length,
            progress: calculateProgressFromTasks(nextTasks),
          }
        })
        return removedFromOldProject.map((project) => mergeTaskIntoProject(project, updatedTask))
      })
      return updatedTask
    } catch (nextError) {
      const nextMessage = getErrorMessage(nextError)
      setError(nextMessage)
      throw new Error(nextMessage)
    } finally {
      setIsMutating(false)
    }
  }, [])

  const deleteTask = useCallback(async (taskId: string) => {
    setIsMutating(true)
    try {
      setError(null)
      await deleteTaskRequest(taskId)
      setProjects((prev) =>
        prev.map((project) => {
          const nextTasks = project.tasks.filter((task) => task.id !== taskId)
          if (nextTasks.length === project.tasks.length) return project
          return {
            ...project,
            tasks: nextTasks,
            taskCount: nextTasks.length,
            progress: calculateProgressFromTasks(nextTasks),
          }
        })
      )
    } catch (nextError) {
      const nextMessage = getErrorMessage(nextError)
      setError(nextMessage)
      throw new Error(nextMessage)
    } finally {
      setIsMutating(false)
    }
  }, [])

  return {
    projects,
    isLoading,
    isMutating,
    error,
    refetch,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    updateTask,
    deleteTask,
  }
}

export type {
  CreateProjectInput,
  CreateTaskInput,
  UpdateProjectInput,
  UpdateTaskInput,
}
