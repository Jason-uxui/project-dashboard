export type Project = {
  id: string
  name: string
  taskCount: number
  progress: number
  startDate: Date
  endDate: Date
  status: "backlog" | "planned" | "active" | "cancelled" | "completed"
  priority: "urgent" | "high" | "medium" | "low"
  tags: string[]
  members: string[]
  // Optional subtitle fields for card/list view
  client?: string
  typeLabel?: string
  durationLabel?: string
  tasks: Array<{
    id: string
    name: string
    type: "bug" | "improvement" | "task"
    assignee: string
    status: "todo" | "in-progress" | "done"
    startDate: Date
    endDate: Date
  }>
}

// Fixed reference date so the demo timeline stays stable over time.
// Adjust this if you want to "re-snapshot" the projects around a new date.
const _today = new Date(2024, 0, 23) // 23 Jan 2024
const _base = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate() - 7)
const _d = (offsetDays: number) => new Date(_base.getFullYear(), _base.getMonth(), _base.getDate() + offsetDays)

export const projects: Project[] = [
  {
    id: "1",
    name: "Fintech Mobile App Redesign",
    taskCount: 4,
    progress: 35,
    startDate: _d(3),
    endDate: _d(27),
    status: "active",
    priority: "high",
    tags: ["frontend", "feature"],
    members: ["jason duong"],
    client: "Acme Corp",
    typeLabel: "MVP",
    durationLabel: "2 weeks",
    tasks: [
      {
        id: "1-1",
        name: "Discovery & IA",
        type: "task",
        assignee: "JD",
        status: "done",
        startDate: _d(3),
        endDate: _d(10),
      },
      {
        id: "1-2",
        name: "Wireframe layout",
        type: "task",
        assignee: "JD",
        status: "in-progress",
        startDate: _d(7),
        endDate: _d(12),
      },
      {
        id: "1-3",
        name: "UI kit & visual design",
        type: "task",
        assignee: "HP",
        status: "todo",
        startDate: _d(13),
        endDate: _d(19),
      },
      {
        id: "1-4",
        name: "Prototype & handoff",
        type: "task",
        assignee: "HP",
        status: "todo",
        startDate: _d(20),
        endDate: _d(27),
      },
    ],
  },
  {
    id: "2",
    name: "Internal PM System",
    taskCount: 6,
    progress: 20,
    startDate: _d(3),
    endDate: _d(24),
    status: "active",
    priority: "medium",
    tags: ["backend"],
    members: ["jason duong"],
    client: "Acme Corp",
    typeLabel: "Improvement",
    durationLabel: "2 weeks",
    tasks: [
      {
        id: "2-1",
        name: "Define MVP scope",
        type: "task",
        assignee: "PM",
        status: "done",
        startDate: _d(3),
        endDate: _d(5),
      },
      {
        id: "2-2",
        name: "Database schema",
        type: "task",
        assignee: "BE",
        status: "in-progress",
        startDate: _d(6),
        endDate: _d(10),
      },
      {
        id: "2-3",
        name: "API endpoints",
        type: "task",
        assignee: "BE",
        status: "todo",
        startDate: _d(11),
        endDate: _d(15),
      },
      {
        id: "2-4",
        name: "Roles & permissions",
        type: "task",
        assignee: "BE",
        status: "todo",
        startDate: _d(16),
        endDate: _d(18),
      },
      {
        id: "2-5",
        name: "UI implementation",
        type: "task",
        assignee: "FE",
        status: "todo",
        startDate: _d(19),
        endDate: _d(21),
      },
      {
        id: "2-6",
        name: "QA & rollout",
        type: "task",
        assignee: "QA",
        status: "todo",
        startDate: _d(22),
        endDate: _d(24),
      },
    ],
  },
  {
    id: "3",
    name: "AI Learning Platform",
    taskCount: 3,
    progress: 40,
    startDate: _d(14),
    endDate: _d(28),
    status: "active",
    priority: "urgent",
    tags: ["feature", "urgent"],
    members: ["jason duong"],
    client: "HealthPlus",
    typeLabel: "Revamp",
    durationLabel: "3 weeks",
    tasks: [
      {
        id: "3-1",
        name: "Course outline",
        type: "task",
        assignee: "JD",
        status: "done",
        startDate: _d(14),
        endDate: _d(16),
      },
      {
        id: "3-2",
        name: "Lesson player UI",
        type: "task",
        assignee: "HP",
        status: "in-progress",
        startDate: _d(17),
        endDate: _d(23),
      },
      {
        id: "3-3",
        name: "Payment integration",
        type: "task",
        assignee: "BE",
        status: "todo",
        startDate: _d(24),
        endDate: _d(28),
      },
    ],
  },
  {
    id: "4",
    name: "Internal CRM System",
    taskCount: 4,
    progress: 0,
    startDate: _d(18),
    endDate: _d(35),
    status: "backlog",
    priority: "low",
    tags: ["bug"],
    members: [],
    client: "Acme Corp Internal",
    typeLabel: "New",
    durationLabel: "—",
    tasks: [
      {
        id: "4-1",
        name: "Requirements gathering",
        type: "task",
        assignee: "PM",
        status: "todo",
        startDate: _d(18),
        endDate: _d(21),
      },
      {
        id: "4-2",
        name: "Data model",
        type: "task",
        assignee: "BE",
        status: "todo",
        startDate: _d(22),
        endDate: _d(25),
      },
      {
        id: "4-3",
        name: "Core screens",
        type: "task",
        assignee: "FE",
        status: "todo",
        startDate: _d(26),
        endDate: _d(31),
      },
      {
        id: "4-4",
        name: "QA & UAT",
        type: "task",
        assignee: "QA",
        status: "todo",
        startDate: _d(32),
        endDate: _d(35),
      },
    ],
  },
  {
    id: "5",
    name: "Ecommerce website",
    taskCount: 5,
    progress: 100,
    startDate: _d(-7),
    endDate: _d(0),
    status: "completed",
    priority: "medium",
    tags: ["frontend"],
    members: ["jason duong"],
    client: "Shopline Retail",
    typeLabel: "Audit",
    durationLabel: "1 week",
    tasks: [
      {
        id: "5-1",
        name: "IA & sitemap",
        type: "task",
        assignee: "JD",
        status: "done",
        startDate: _d(-7),
        endDate: _d(-5),
      },
      {
        id: "5-2",
        name: "Product listing UI",
        type: "task",
        assignee: "HP",
        status: "done",
        startDate: _d(-5),
        endDate: _d(-3),
      },
      {
        id: "5-3",
        name: "Cart & checkout flow",
        type: "task",
        assignee: "HP",
        status: "done",
        startDate: _d(-3),
        endDate: _d(-1),
      },
      {
        id: "5-4",
        name: "Payment gateway",
        type: "task",
        assignee: "BE",
        status: "done",
        startDate: _d(-1),
        endDate: _d(0),
      },
      {
        id: "5-5",
        name: "Launch checklist",
        type: "task",
        assignee: "QA",
        status: "done",
        startDate: _d(-2),
        endDate: _d(0),
      },
    ],
  },
  {
    id: "6",
    name: "Marketing Site Refresh",
    taskCount: 3,
    progress: 10,
    startDate: _d(5),
    endDate: _d(18),
    status: "planned",
    priority: "medium",
    tags: ["frontend", "feature"],
    members: ["jason duong"],
    client: "Atlas Logistics",
    typeLabel: "Phase 1",
    durationLabel: "2 weeks",
    tasks: [
      {
        id: "6-1",
        name: "Landing page layout",
        type: "task",
        assignee: "JD",
        status: "todo",
        startDate: _d(5),
        endDate: _d(9),
      },
      {
        id: "6-2",
        name: "Hero illustrations",
        type: "task",
        assignee: "HP",
        status: "todo",
        startDate: _d(10),
        endDate: _d(14),
      },
      {
        id: "6-3",
        name: "Content QA",
        type: "task",
        assignee: "QA",
        status: "todo",
        startDate: _d(15),
        endDate: _d(18),
      },
    ],
  },
  {
    id: "7",
    name: "Design System Cleanup",
    taskCount: 4,
    progress: 0,
    startDate: _d(8),
    endDate: _d(20),
    status: "planned",
    priority: "low",
    tags: ["backend"],
    members: ["jason duong"],
    client: "Acme Corp Internal",
    typeLabel: "Refactor",
    durationLabel: "1 week",
    tasks: [
      {
        id: "7-1",
        name: "Token audit",
        type: "task",
        assignee: "JD",
        status: "todo",
        startDate: _d(8),
        endDate: _d(10),
      },
      {
        id: "7-2",
        name: "Component inventory",
        type: "task",
        assignee: "JD",
        status: "todo",
        startDate: _d(11),
        endDate: _d(13),
      },
      {
        id: "7-3",
        name: "Deprecation plan",
        type: "task",
        assignee: "PM",
        status: "todo",
        startDate: _d(14),
        endDate: _d(17),
      },
      {
        id: "7-4",
        name: "Docs update",
        type: "task",
        assignee: "JD",
        status: "todo",
        startDate: _d(18),
        endDate: _d(20),
      },
    ],
  },
  {
    id: "8",
    name: "Onboarding Flow A/B Test",
    taskCount: 3,
    progress: 100,
    startDate: _d(-10),
    endDate: _d(-3),
    status: "completed",
    priority: "high",
    tags: ["feature", "urgent"],
    members: ["jason duong"],
    client: "HealthPlus",
    typeLabel: "Experiment",
    durationLabel: "1 week",
    tasks: [
      {
        id: "8-1",
        name: "Hypothesis setup",
        type: "task",
        assignee: "PM",
        status: "done",
        startDate: _d(-10),
        endDate: _d(-8),
      },
      {
        id: "8-2",
        name: "Variant design",
        type: "task",
        assignee: "JD",
        status: "done",
        startDate: _d(-8),
        endDate: _d(-5),
      },
      {
        id: "8-3",
        name: "Analysis & rollout",
        type: "task",
        assignee: "Data",
        status: "done",
        startDate: _d(-5),
        endDate: _d(-3),
      },
    ],
  },
  {
    id: "9",
    name: "Client Success Dashboard",
    taskCount: 5,
    progress: 55,
    startDate: _d(6),
    endDate: _d(24),
    status: "active",
    priority: "medium",
    tags: ["dashboard", "feature"],
    members: ["jason duong"],
    client: "Acme Corp",
    typeLabel: "Enhancement",
    durationLabel: "3 weeks",
    tasks: [
      {
        id: "9-1",
        name: "Data audit",
        type: "task",
        assignee: "Data",
        status: "done",
        startDate: _d(6),
        endDate: _d(8),
      },
      {
        id: "9-2",
        name: "Chart library spike",
        type: "task",
        assignee: "FE",
        status: "in-progress",
        startDate: _d(9),
        endDate: _d(13),
      },
      {
        id: "9-3",
        name: "Dashboard layout",
        type: "task",
        assignee: "JD",
        status: "todo",
        startDate: _d(14),
        endDate: _d(18),
      },
      {
        id: "9-4",
        name: "Stakeholder review",
        type: "task",
        assignee: "PM",
        status: "todo",
        startDate: _d(19),
        endDate: _d(21),
      },
      {
        id: "9-5",
        name: "QA & rollout",
        type: "task",
        assignee: "QA",
        status: "todo",
        startDate: _d(22),
        endDate: _d(24),
      },
    ],
  },
  {
    id: "10",
    name: "Operations Automation Toolkit",
    taskCount: 4,
    progress: 15,
    startDate: _d(12),
    endDate: _d(32),
    status: "planned",
    priority: "high",
    tags: ["automation"],
    members: ["jason duong"],
    client: "Acme Corp",
    typeLabel: "Phase 2",
    durationLabel: "4 weeks",
    tasks: [
      {
        id: "10-1",
        name: "Workflow mapping",
        type: "task",
        assignee: "PM",
        status: "todo",
        startDate: _d(12),
        endDate: _d(15),
      },
      {
        id: "10-2",
        name: "Automation scripts",
        type: "task",
        assignee: "BE",
        status: "todo",
        startDate: _d(16),
        endDate: _d(22),
      },
      {
        id: "10-3",
        name: "UX polish",
        type: "task",
        assignee: "JD",
        status: "todo",
        startDate: _d(23),
        endDate: _d(28),
      },
      {
        id: "10-4",
        name: "Pilot rollout",
        type: "task",
        assignee: "Ops",
        status: "todo",
        startDate: _d(29),
        endDate: _d(32),
      },
    ],
  },
  {
    id: "11",
    name: "Support Center Revamp",
    taskCount: 4,
    progress: 100,
    startDate: _d(-15),
    endDate: _d(-5),
    status: "completed",
    priority: "medium",
    tags: ["frontend"],
    members: ["jason duong"],
    client: "Atlas Logistics",
    typeLabel: "Revamp",
    durationLabel: "2 weeks",
    tasks: [
      {
        id: "9-1",
        name: "Content IA",
        type: "task",
        assignee: "JD",
        status: "done",
        startDate: _d(-15),
        endDate: _d(-13),
      },
      {
        id: "9-2",
        name: "Search UX",
        type: "task",
        assignee: "JD",
        status: "done",
        startDate: _d(-13),
        endDate: _d(-10),
      },
      {
        id: "9-3",
        name: "Article template",
        type: "task",
        assignee: "HP",
        status: "done",
        startDate: _d(-10),
        endDate: _d(-7),
      },
      {
        id: "9-4",
        name: "Rollout & feedback",
        type: "task",
        assignee: "PM",
        status: "done",
        startDate: _d(-7),
        endDate: _d(-5),
      },
    ],
  },
  {
    id: "12",
    name: "Billing Dashboard Polish",
    taskCount: 2,
    progress: 100,
    startDate: _d(-6),
    endDate: _d(-1),
    status: "completed",
    priority: "low",
    tags: ["bug"],
    members: ["jason duong"],
    client: "Northwind Bank",
    typeLabel: "Polish",
    durationLabel: "3 days",
    tasks: [
      {
        id: "10-1",
        name: "Error state review",
        type: "bug",
        assignee: "QA",
        status: "done",
        startDate: _d(-6),
        endDate: _d(-4),
      },
      {
        id: "10-2",
        name: "Charts clean-up",
        type: "task",
        assignee: "JD",
        status: "done",
        startDate: _d(-3),
        endDate: _d(-1),
      },
    ],
  },
]

export type FilterCounts = {
  status?: Record<string, number>
  priority?: Record<string, number>
  tags?: Record<string, number>
  members?: Record<string, number>
}

export function computeFilterCounts(list: Project[]): FilterCounts {
  const res: FilterCounts = {
    status: {},
    priority: {},
    tags: {},
    members: {},
  }
  for (const p of list) {
    // status
    res.status![p.status] = (res.status![p.status] || 0) + 1
    // priority
    res.priority![p.priority] = (res.priority![p.priority] || 0) + 1
    // tags
    for (const t of p.tags) {
      const id = t.toLowerCase()
      res.tags![id] = (res.tags![id] || 0) + 1
    }
    // members buckets
    if (p.members.length === 0) {
      res.members!["no-member"] = (res.members!["no-member"] || 0) + 1
    }
    if (p.members.length > 0) {
      res.members!["current"] = (res.members!["current"] || 0) + 1
    }
    if (p.members.some((m) => m.toLowerCase() === "jason duong")) {
      res.members!["jason"] = (res.members!["jason"] || 0) + 1
    }
  }
  return res
}
