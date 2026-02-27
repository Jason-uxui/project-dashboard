import { projects } from '@/lib/data/projects'

export type ClientStatus = 'prospect' | 'active' | 'on_hold' | 'completed' | 'archived'

export type Client = {
  id: string
  name: string
  status: ClientStatus
  industry?: string
  website?: string
  location?: string
  owner?: string
  primaryContactName?: string
  primaryContactEmail?: string
  notes?: string
  segment?: string
  lastActivityLabel?: string
}

export const clients: Client[] = []

export function getClientById(id: string): Client | undefined {
  return clients.find((c) => c.id === id)
}

export function getProjectCountForClient(clientName: string): number {
  return projects.filter((p) => p.client === clientName).length
}

export function getClientByName(name: string): Client | undefined {
  const normalized = name.trim().toLowerCase()
  return clients.find((c) => c.name.trim().toLowerCase() === normalized)
}

export function upsertClient(input: Client): Client {
  const existingIndex = clients.findIndex((c) => c.id === input.id)
  if (existingIndex >= 0) {
    clients[existingIndex] = { ...clients[existingIndex], ...input }
    return clients[existingIndex]
  }
  clients.push(input)
  return input
}
