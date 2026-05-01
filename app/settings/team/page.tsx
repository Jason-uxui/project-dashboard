"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    MagnifyingGlass,
    Plus,
    PencilSimple,
    Trash,
    Key,
    ShieldCheck,
    TrendUp,
    Envelope,
    DotsThreeVertical,
    CheckCircle,
    WarningCircle,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS } from "@/lib/data/brands"

type Role = "Owner" | "Admin" | "Manager" | "Editor" | "Freelancer"
type TeamMember = {
    id: string
    name: string
    email: string
    role: Role
    status: "Active" | "Invited" | "Inactive"
    brands: string[]
    lastActive: string
}

const ROLE_COLORS: Record<Role, string> = {
    Owner: "bg-red-500/10 text-red-400 border-red-500/20",
    Admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Manager: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Editor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Freelancer: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

const MOCK_TEAM: TeamMember[] = [
    { id: "U-001", name: "Hazat Adane", email: "haz@caravandigital.com", role: "Owner", status: "Active", brands: ["tirat", "debo", "berhan", "ethio-influencers", "ethiobot"], lastActive: "Active now" },
    { id: "U-002", name: "Meana Melaku", email: "meana@caravandigital.com", role: "Admin", status: "Active", brands: ["tirat", "berhan"], lastActive: "2 hours ago" },
    { id: "U-003", name: "Dawit Mengistu", email: "dawit@caravandigital.com", role: "Manager", status: "Active", brands: ["tirat", "debo"], lastActive: "1 day ago" },
    { id: "U-004", name: "Hana Tadesse", email: "hana.t@gmail.com", role: "Freelancer", status: "Active", brands: ["tirat"], lastActive: "3 days ago" },
    { id: "U-005", name: "Salim Omar", email: "salim@caravandigital.com", role: "Editor", status: "Active", brands: ["ethiobot"], lastActive: "15 mins ago" },
    { id: "U-006", name: "Bethelhem Yared", email: "bethy@caravandigital.com", role: "Admin", status: "Invited", brands: ["debo", "ethio-influencers"], lastActive: "N/A" },
]

export default function TeamSettingsPage() {
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState<Role | "All">("All")

    const filtered = useMemo(() => {
        return MOCK_TEAM.filter(m => {
            if (roleFilter !== "All" && m.role !== roleFilter) return false
            if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.email.toLowerCase().includes(search.toLowerCase())) return false
            return true
        })
    }, [search, roleFilter])

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1400px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Team & Permissions</h1>
                            <p className="text-sm text-muted-foreground mt-1">Manage workspace members, assign roles, and control cross-brand access.</p>
                        </div>
                        <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-3.5 w-3.5" />Invite Member
                        </Button>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
                            <p className="text-xs text-muted-foreground">Total Members</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Users className="h-5 w-5 text-blue-400" />
                                <p className="text-xl font-bold">{MOCK_TEAM.length}</p>
                            </div>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 p-4 bg-emerald-500/5">
                            <p className="text-xs text-muted-foreground">Active Seats</p>
                            <div className="flex items-center gap-2 mt-1">
                                <CheckCircle className="h-5 w-5 text-emerald-400" />
                                <p className="text-xl font-bold text-emerald-400">5 / 10</p>
                            </div>
                        </div>
                        <div className="rounded-xl border border-blue-500/20 p-4 bg-blue-500/5">
                            <p className="text-xs text-muted-foreground">Pending Invites</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Envelope className="h-5 w-5 text-blue-400" />
                                <p className="text-xl font-bold text-blue-400">1</p>
                            </div>
                        </div>
                        <div className="rounded-xl border border-purple-500/20 p-4 bg-purple-500/5">
                            <p className="text-xs text-muted-foreground">Security Audits</p>
                            <div className="flex items-center gap-2 mt-1">
                                <ShieldCheck className="h-5 w-5 text-purple-400" />
                                <p className="text-xl font-bold text-purple-400">100%</p>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search by name or email..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-1.5">
                            {(["All", "Owner", "Admin", "Manager", "Editor", "Freelancer"] as const).map(r => (
                                <button key={r} onClick={() => setRoleFilter(r as any)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${roleFilter === r ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Team List Table */}
                    <div className="rounded-xl border border-border/60 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/30 border-b border-border/60 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Member</th>
                                    <th className="px-4 py-4">Role</th>
                                    <th className="px-4 py-4">Brands</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4 text-right">Activity</th>
                                    <th className="w-12 px-4 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {filtered.map(member => (
                                    <tr key={member.id} className="hover:bg-accent/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold tracking-tight">{member.name}</span>
                                                <span className="text-[11px] text-muted-foreground">{member.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border-0 shadow-sm ${ROLE_COLORS[member.role]}`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-0.5 max-w-[120px] flex-wrap">
                                                {member.brands.map(bId => {
                                                    const b = BRANDS.find(x => x.id === bId)
                                                    return b ? <span key={bId} className={`h-2.5 w-2.5 rounded-full ${b.dotColor}`} /> : null
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {member.status === "Active" ? (
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                ) : (
                                                    <WarningCircle className="h-3.5 w-3.5 text-amber-500" />
                                                )}
                                                <span className={`text-xs ${member.status === "Invited" ? "text-amber-500 italic font-medium" : ""}`}>{member.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <span className="text-xs text-muted-foreground font-medium">{member.lastActive}</span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                <DotsThreeVertical className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Role Legend / Quick Help */}
                    <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                        <div className="flex items-start gap-4">
                            <Key className="h-5 w-5 text-blue-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-blue-400">About Roles</h4>
                                <div className="grid grid-cols-5 gap-6 mt-3">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase text-red-400 tracking-wider">Owner</p>
                                        <p className="text-[11px] text-muted-foreground leading-snug tracking-tight">Full administrative control, billing & global deletes.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase text-purple-400 tracking-wider">Admin</p>
                                        <p className="text-[11px] text-muted-foreground leading-snug tracking-tight">System configuration, user management & team inv.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">Manager</p>
                                        <p className="text-[11px] text-muted-foreground leading-snug tracking-tight">Approval workflows, client & project level management.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Editor</p>
                                        <p className="text-[11px] text-muted-foreground leading-snug tracking-tight">Content creation, task updates & limited data view.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">Freelancer</p>
                                        <p className="text-[11px] text-muted-foreground leading-snug tracking-tight">Internal task view only, no client or finance access.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
