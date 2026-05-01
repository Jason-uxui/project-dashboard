"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Flag,
    MagnifyingGlass,
    Plus,
    PencilSimple,
    Trash,
    Image as ImageIcon,
    Palette,
    Globe,
    InstagramLogo,
    TwitterLogo,
    LinkedinLogo,
    DotsThreeVertical,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS } from "@/lib/data/brands"

export default function BrandsSettingsPage() {
    const [activeBrand, setActiveBrand] = useState(BRANDS[0])

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1200px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Brand Configuration</h1>
                            <p className="text-sm text-muted-foreground mt-1">Manage brand identities, assets, and social profiles.</p>
                        </div>
                        <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-3.5 w-3.5" />New Brand
                        </Button>
                    </div>

                    <div className="flex gap-8 mt-4">
                        {/* Sidebar List */}
                        <div className="w-64 shrink-0 space-y-1">
                            {BRANDS.map(brand => (
                                <button key={brand.id}
                                    onClick={() => setActiveBrand(brand)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${activeBrand.id === brand.id ? "bg-accent/50 border-white/10 shadow-sm" : "border-transparent hover:bg-accent/30 text-muted-foreground hover:text-foreground"}`}>
                                    <span className={`h-2.5 w-2.5 rounded-full ${brand.dotColor}`} />
                                    <span className="text-sm font-semibold">{brand.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 space-y-8">
                            {/* Brand Header Card */}
                            <div className="p-6 rounded-2xl border border-border/60 bg-muted/20 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 bg-${activeBrand.name.toLowerCase().includes('berhan') ? 'amber' : activeBrand.name.toLowerCase().includes('tirat') ? 'blue' : 'emerald'}-500 sm:-mr-8 sm:-mt-8`} />

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className="h-20 w-20 rounded-2xl bg-background border flex items-center justify-center p-3">
                                            <ImageIcon className="h-10 w-10 text-muted-foreground opacity-50" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{activeBrand.name}</h2>
                                            <p className="text-sm text-muted-foreground mt-1 truncate max-w-[300px]">{activeBrand.id === "tirat" ? "Creative Content & Interactive Marketing" : activeBrand.id === "debo" ? "Cloud-Native Software Development" : "Visual Identity & Motion Design"}</p>
                                            <div className="flex gap-2 mt-3">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase tracking-wide">ID: {activeBrand.id}</span>
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${activeBrand.color} ${activeBrand.textColor}`}>Primary Brand</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                                            <PencilSimple className="h-3.5 w-3.5" />Edit Profile
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground">
                                            <DotsThreeVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Sections Container */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* Identity Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Palette className="h-4 w-4 text-blue-400" />
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Visual Identity</h3>
                                    </div>
                                    <div className="space-y-4 p-5 rounded-xl border border-border/40">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Primary Color</label>
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-8 w-12 rounded border bg-${activeBrand.name.toLowerCase().includes('berhan') ? 'amber' : activeBrand.name.toLowerCase().includes('tirat') ? 'blue' : 'emerald'}-400`} />
                                                    <span className="text-xs font-mono">#3B82F6</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Accent Color</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-12 rounded border bg-slate-800" />
                                                    <span className="text-xs font-mono">#1E293B</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Typography</label>
                                            <div className="flex items-center justify-between p-2 rounded bg-muted/40 border text-xs">
                                                <span>Instrument Sans / Inter</span>
                                                <Button variant="ghost" size="sm" className="h-6 text-[10px] uppercase">Edit</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Connectivity Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className="h-4 w-4 text-emerald-400" />
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Connectivity</h3>
                                    </div>
                                    <div className="space-y-4 p-5 rounded-xl border border-border/40">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <InstagramLogo className="h-5 w-5 text-pink-400" />
                                                    <div>
                                                        <p className="text-xs font-semibold">Instagram</p>
                                                        <p className="text-[10px] text-muted-foreground">@caravandigital</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-7 w-7"><PencilSimple className="h-3.5 w-3.5" /></Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <TwitterLogo className="h-5 w-5 text-blue-400" />
                                                    <div>
                                                        <p className="text-xs font-semibold">Twitter / X</p>
                                                        <p className="text-[10px] text-muted-foreground">@caravandigital_et</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-7 w-7"><PencilSimple className="h-3.5 w-3.5" /></Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <LinkedinLogo className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="text-xs font-semibold">LinkedIn</p>
                                                        <p className="text-[10px] text-muted-foreground">/company/caravan-digital</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-7 w-7"><PencilSimple className="h-3.5 w-3.5" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Team Members for this Brand */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Flag className="h-4 w-4 text-purple-400" />
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Associated Team</h3>
                                    </div>
                                    <Button variant="link" size="sm" className="text-xs p-0 h-auto">Manage Team Permissions</Button>
                                </div>
                                <div className="p-1 rounded-xl border border-border/40 overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-muted/30 border-b border-border/40 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                                            <tr>
                                                <th className="px-4 py-2">Member</th>
                                                <th className="px-4 py-2">Role</th>
                                                <th className="px-4 py-2 text-right">Access Level</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-border/20 last:border-0 hover:bg-accent/20 transition-colors">
                                                <td className="px-4 py-3 font-semibold">Hazat Adane</td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">Owner</td>
                                                <td className="px-4 py-3 text-right">Full Admin</td>
                                            </tr>
                                            <tr className="border-b border-border/20 last:border-0 hover:bg-accent/20 transition-colors">
                                                <td className="px-4 py-3 font-semibold">Meana Melaku</td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">Content Manager</td>
                                                <td className="px-4 py-3 text-right">Manager</td>
                                            </tr>
                                            <tr className="border-b border-border/20 last:border-0 hover:bg-accent/20 transition-colors">
                                                <td className="px-4 py-3 font-semibold">Dawit Mengistu</td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">Lead Designer</td>
                                                <td className="px-4 py-3 text-right">Editor</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
