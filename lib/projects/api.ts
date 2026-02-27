import type { Project } from '@/lib/data/projects'

type ProjectTask = Project['tasks'][number]

type ProjectRow = {
  id: string
  name: string
  status: Project['status']
  priority: Project['priority']
  progress: number
  start_date: string
  end_date: string
  client: string | null
  type_label: string | null
  duration_label: string | null
  tags: string[] | null
  members: string[] | null
  created_at: string
  tasks?: TaskRow[]
}

type TaskRow = {
  id: string
  project_id: string
  name: string
  type: ProjectTask['type']
  assignee: string
  status: ProjectTask['status']
  start_date: string
  end_date: string
  created_at: string
}

const PROJECT_SELECT = [
  'id',
  'name',
  'status',
  'priority',
  'progress',
  'start_date',
  'end_date',
  'client',
  'type_label',
  'duration_label',
  'tags',
  'members',
  'created_at',
  'tasks(id,project_id,name,type,assignee,status,start_date,end_date,created_at)',
].join(',')

const TASK_SELECT = [
  'id',
  'project_id',
  'name',
  'type',
  'assignee',
  'status',
  'start_date',
  'end_date',
  'created_at',
].join(',')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function assertSupabaseConfig(): void {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  prefer?: string
}

async function supabaseRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  assertSupabaseConfig()

  const url = `${SUPABASE_URL}/rest/v1/${path}`
  const response = await fetch(url, {
    method: options.method ?? 'GET',
    cache: 'no-store',
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${SUPABASE_ANON_KEY!}`,
      'Content-Type': 'application/json',
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  const json = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message =
      json?.message || json?.error_description || json?.error || 'Supabase request failed.'
    throw new Error(message)
  }

  return json as T
}

function toDate(dateValue: string): Date {
  return new Date(`${dateValue}T00:00:00`)
}

function toIsoDate(dateValue: Date): string {
  const year = dateValue.getFullYear()
  const month = String(dateValue.getMonth() + 1).padStart(2, '0')
  const day = String(dateValue.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function calculateProgressFromTasks(tasks: ProjectTask[]): number {
  if (tasks.length === 0) return 0
  const doneCount = tasks.filter((task) => task.status === 'done').length
  return Math.round((doneCount / tasks.length) * 100)
}

function mapTaskRowToProjectTask(task: TaskRow): ProjectTask {
  return {
    id: task.id,
    name: task.name,
    type: task.type,
    assignee: task.assignee,
    status: task.status,
    startDate: toDate(task.start_date),
    endDate: toDate(task.end_date),
  }
}

function mapProjectRowToProject(project: ProjectRow): Project {
  const tasks = (project.tasks ?? []).map(mapTaskRowToProjectTask)
  return {
    id: project.id,
    name: project.name,
    taskCount: tasks.length,
    progress: tasks.length > 0 ? calculateProgressFromTasks(tasks) : project.progress,
    startDate: toDate(project.start_date),
    endDate: toDate(project.end_date),
    status: project.status,
    priority: project.priority,
    tags: project.tags ?? [],
    members: project.members ?? [],
    client: project.client ?? undefined,
    typeLabel: project.type_label ?? undefined,
    durationLabel: project.duration_label ?? undefined,
    tasks,
  }
}

function mapTaskRowToTaskRecord(task: TaskRow): TaskRecord {
  return {
    projectId: task.project_id,
    id: task.id,
    name: task.name,
    type: task.type,
    assignee: task.assignee,
    status: task.status,
    startDate: toDate(task.start_date),
    endDate: toDate(task.end_date),
  }
}

function getDefaultEndDate(startDate: Date): Date {
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 14)
  return endDate
}

export type CreateProjectInput = {
  name: string
  status?: Project['status']
  priority?: Project['priority']
  progress?: number
  startDate?: Date
  endDate?: Date
  client?: string
  typeLabel?: string
  durationLabel?: string
  tags?: string[]
  members?: string[]
}

export type UpdateProjectInput = Partial<CreateProjectInput>

export type TaskRecord = ProjectTask & {
  projectId: string
}

export type CreateTaskInput = {
  projectId: string
  name: string
  type?: ProjectTask['type']
  assignee?: string
  status?: ProjectTask['status']
  startDate?: Date
  endDate?: Date
}

export type UpdateTaskInput = Partial<Omit<CreateTaskInput, 'projectId'>> & {
  projectId?: string
}

export async function listProjects(): Promise<Project[]> {
  const rows = await supabaseRequest<ProjectRow[]>(
    `projects?select=${encodeURIComponent(PROJECT_SELECT)}&order=created_at.desc&tasks.order=created_at.asc`
  )
  return rows.map(mapProjectRowToProject)
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const now = new Date()
  const startDate = input.startDate ?? now
  const endDate = input.endDate ?? getDefaultEndDate(startDate)

  const rows = await supabaseRequest<ProjectRow[]>(
    `projects?select=${encodeURIComponent(PROJECT_SELECT)}`,
    {
      method: 'POST',
      prefer: 'return=representation',
      body: {
        name: input.name,
        status: input.status ?? 'planned',
        priority: input.priority ?? 'medium',
        progress: input.progress ?? 0,
        start_date: toIsoDate(startDate),
        end_date: toIsoDate(endDate),
        client: input.client ?? null,
        type_label: input.typeLabel ?? null,
        duration_label: input.durationLabel ?? null,
        tags: input.tags ?? [],
        members: input.members ?? [],
      },
    }
  )

  if (!rows.length) {
    throw new Error('Project was not created.')
  }

  return mapProjectRowToProject(rows[0])
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput
): Promise<Project> {
  const payload: Record<string, unknown> = {}

  if (typeof input.name === 'string') payload.name = input.name
  if (input.status) payload.status = input.status
  if (input.priority) payload.priority = input.priority
  if (typeof input.progress === 'number') payload.progress = input.progress
  if (input.startDate) payload.start_date = toIsoDate(input.startDate)
  if (input.endDate) payload.end_date = toIsoDate(input.endDate)
  if (typeof input.client === 'string') payload.client = input.client
  if (typeof input.typeLabel === 'string') payload.type_label = input.typeLabel
  if (typeof input.durationLabel === 'string') payload.duration_label = input.durationLabel
  if (Array.isArray(input.tags)) payload.tags = input.tags
  if (Array.isArray(input.members)) payload.members = input.members

  const rows = await supabaseRequest<ProjectRow[]>(
    `projects?id=eq.${encodeURIComponent(projectId)}&select=${encodeURIComponent(PROJECT_SELECT)}`,
    {
      method: 'PATCH',
      prefer: 'return=representation',
      body: payload,
    }
  )

  if (!rows.length) {
    throw new Error('Project was not found.')
  }

  return mapProjectRowToProject(rows[0])
}

export async function deleteProject(projectId: string): Promise<void> {
  await supabaseRequest<void>(`projects?id=eq.${encodeURIComponent(projectId)}`, {
    method: 'DELETE',
    prefer: 'return=minimal',
  })
}

export async function createTask(input: CreateTaskInput): Promise<TaskRecord> {
  const now = new Date()
  const startDate = input.startDate ?? now
  const endDate = input.endDate ?? startDate

  const rows = await supabaseRequest<TaskRow[]>(
    `tasks?select=${encodeURIComponent(TASK_SELECT)}`,
    {
      method: 'POST',
      prefer: 'return=representation',
      body: {
        project_id: input.projectId,
        name: input.name,
        type: input.type ?? 'task',
        assignee: input.assignee ?? 'Unassigned',
        status: input.status ?? 'todo',
        start_date: toIsoDate(startDate),
        end_date: toIsoDate(endDate),
      },
    }
  )

  if (!rows.length) {
    throw new Error('Task was not created.')
  }

  return mapTaskRowToTaskRecord(rows[0])
}

export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<TaskRecord> {
  const payload: Record<string, unknown> = {}

  if (input.projectId) payload.project_id = input.projectId
  if (typeof input.name === 'string') payload.name = input.name
  if (input.type) payload.type = input.type
  if (typeof input.assignee === 'string') payload.assignee = input.assignee
  if (input.status) payload.status = input.status
  if (input.startDate) payload.start_date = toIsoDate(input.startDate)
  if (input.endDate) payload.end_date = toIsoDate(input.endDate)

  const rows = await supabaseRequest<TaskRow[]>(
    `tasks?id=eq.${encodeURIComponent(taskId)}&select=${encodeURIComponent(TASK_SELECT)}`,
    {
      method: 'PATCH',
      prefer: 'return=representation',
      body: payload,
    }
  )

  if (!rows.length) {
    throw new Error('Task was not found.')
  }

  return mapTaskRowToTaskRecord(rows[0])
}

export async function deleteTask(taskId: string): Promise<void> {
  await supabaseRequest<void>(`tasks?id=eq.${encodeURIComponent(taskId)}`, {
    method: 'DELETE',
    prefer: 'return=minimal',
  })
}
