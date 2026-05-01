"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { MagnifyingGlass, Download, Copy, Eye } from "@phosphor-icons/react/dist/ssr"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { BRANDS, BRAND_MAP, type BrandId } from "@/lib/data/brands"
import { toast } from "sonner"

type AssetType = "Logo" | "Color Palette" | "Typography" | "Template" | "Guidelines" | "Photography" | "Icon Set" | "Social Kit"

type BrandAsset = {
    id: string
    name: string
    brand: BrandId
    type: AssetType
    format: string
    size: string
    lastUpdated: string
    description: string
}

const brandAssets: BrandAsset[] = [
    { id: "BA-001", name: "Berhan Digital — Primary Logo", brand: "berhan", type: "Logo", format: "SVG, PNG, PDF", size: "2.4 MB", lastUpdated: "Jan 15", description: "Primary horizontal logo with tagline variations." },
    { id: "BA-002", name: "Berhan — Color System", brand: "berhan", type: "Color Palette", format: "Figma, PDF", size: "480 KB", lastUpdated: "Jan 15", description: "Full color palette with primary, secondary, and accent colors." },
    { id: "BA-003", name: "Berhan — Social Media Kit", brand: "berhan", type: "Social Kit", format: "PSD, Figma", size: "18 MB", lastUpdated: "Feb 1", description: "Templates for Instagram posts, stories, Facebook, and LinkedIn." },
    { id: "BA-004", name: "Tirat Studio — Logo Suite", brand: "tirat", type: "Logo", format: "AI, SVG, PNG", size: "3.1 MB", lastUpdated: "Jan 20", description: "Full logo suite: horizontal, vertical, icon, and monochrome variants." },
    { id: "BA-005", name: "Tirat — Typography Guide", brand: "tirat", type: "Typography", format: "PDF, OTF", size: "5.2 MB", lastUpdated: "Jan 20", description: "Font families: Inter for headings, DM Sans for body. Usage guidelines." },
    { id: "BA-006", name: "Tirat — Brand Guidelines", brand: "tirat", type: "Guidelines", format: "PDF", size: "12 MB", lastUpdated: "Jan 20", description: "Complete brand guidelines including voice, tone, visual identity, etc." },
    { id: "BA-007", name: "Debo Tools — Logo Package", brand: "debo", type: "Logo", format: "SVG, PNG", size: "1.8 MB", lastUpdated: "Feb 5", description: "Developer-focused logo with code bracket motif." },
    { id: "BA-008", name: "Debo — Icon Set v2", brand: "debo", type: "Icon Set", format: "SVG, Figma", size: "820 KB", lastUpdated: "Feb 10", description: "Custom icon set for Debo products and marketing." },
    { id: "BA-009", name: "Ethio Influencers — Logo", brand: "ethio-influencers", type: "Logo", format: "SVG, PNG", size: "1.2 MB", lastUpdated: "Dec 15", description: "Vibrant gradient logo for social media presence." },
    { id: "BA-010", name: "Ethio Influencers — Social Templates", brand: "ethio-influencers", type: "Template", format: "Canva, PSD", size: "22 MB", lastUpdated: "Feb 1", description: "200+ social media templates for campaigns and content." },
    { id: "BA-011", name: "EthioBot — Logo + Icon", brand: "ethiobot", type: "Logo", format: "SVG, PNG", size: "980 KB", lastUpdated: "Jan 10", description: "Bot mascot logo and app icon variants." },
    { id: "BA-012", name: "Photography — Corporate Shots", brand: "berhan", type: "Photography", format: "JPG", size: "145 MB", lastUpdated: "Feb 12", description: "Team photos, office shots, and event photography." },
]

const typeColors: Record<AssetType, string> = {
    Logo: "bg-blue-500/10 text-blue-500",
    "Color Palette": "bg-purple-500/10 text-purple-500",
    Typography: "bg-indigo-500/10 text-indigo-500",
    Template: "bg-emerald-500/10 text-emerald-500",
    Guidelines: "bg-amber-500/10 text-amber-500",
    Photography: "bg-pink-500/10 text-pink-500",
    "Icon Set": "bg-cyan-500/10 text-cyan-500",
    "Social Kit": "bg-orange-500/10 text-orange-500",
}

export default function BrandAssetsPage() {
    const [search, setSearch] = useState("")
    const [brandFilter, setBrandFilter] = useState<string>("all")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [selectedAsset, setSelectedAsset] = useState<BrandAsset | null>(null)

    const filtered = brandAssets.filter((a) => {
        const matchesSearch = search === "" || a.name.toLowerCase().includes(search.toLowerCase())
        const matchesBrand = brandFilter === "all" || a.brand === brandFilter
        const matchesType = typeFilter === "all" || a.type === typeFilter
        return matchesSearch && matchesBrand && matchesType
    })

    const assetTypes: AssetType[] = [...new Set(brandAssets.map(a => a.type))]

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between border-b border-border/40 px-8 py-5">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">Brand Arsenal</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">All brand assets, guidelines, and templates in one place.</p>
                        </div>
                    </header>

                    <div className="px-8 py-4 border-b border-border/40 flex items-center gap-4 flex-wrap">
                        <div className="relative max-w-sm flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search assets..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            {BRANDS.map((b) => (
                                <button key={b.id} onClick={() => setBrandFilter(brandFilter === b.id ? "all" : b.id)} className={`flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium hover:bg-muted transition-colors ${brandFilter === b.id ? "bg-muted border-foreground/30" : ""}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${b.dotColor}`} />{b.shortName}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setTypeFilter("all")} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors ${typeFilter === "all" ? "bg-muted border-foreground/30" : "border-border hover:bg-muted"}`}>All Types</button>
                            {assetTypes.slice(0, 4).map(t => (
                                <button key={t} onClick={() => setTypeFilter(typeFilter === t ? "all" : t)} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors ${typeFilter === t ? "bg-muted border-foreground/30" : "border-border hover:bg-muted"}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filtered.map((asset) => {
                                const brand = BRAND_MAP[asset.brand]
                                return (
                                    <div key={asset.id} onClick={() => setSelectedAsset(asset)} className="rounded-xl border border-border/60 bg-card p-5 hover:shadow-md hover:border-border transition-all cursor-pointer group">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`h-2.5 w-2.5 rounded-full ${brand.dotColor}`} />
                                                <span className="text-[10px] font-semibold text-muted-foreground">{brand.shortName}</span>
                                            </div>
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeColors[asset.type]}`}>{asset.type}</span>
                                        </div>
                                        <h3 className="text-sm font-semibold mb-1.5 truncate">{asset.name}</h3>
                                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{asset.description}</p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
                                            <span>{asset.format}</span>
                                            <span>{asset.size}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Asset Detail Sheet */}
                <Sheet open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
                    <SheetContent className="sm:max-w-lg overflow-y-auto">
                        {selectedAsset && (() => {
                            const brand = BRAND_MAP[selectedAsset.brand]
                            return (
                                <>
                                    <SheetHeader>
                                        <div className="flex items-center gap-2">
                                            <span className={`h-3 w-3 rounded-full ${brand.dotColor}`} />
                                            <SheetTitle>{selectedAsset.name}</SheetTitle>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{brand.name} · {selectedAsset.type}</p>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        <div className="rounded-xl bg-muted/20 border border-border/40 p-8 flex items-center justify-center">
                                            <span className={`h-16 w-16 rounded-2xl ${brand.color} flex items-center justify-center text-white text-2xl font-bold`}>
                                                {brand.shortName[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
                                            <p className="text-sm">{selectedAsset.description}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><span className="text-xs text-muted-foreground">Formats</span><p className="font-medium">{selectedAsset.format}</p></div>
                                            <div><span className="text-xs text-muted-foreground">File Size</span><p className="font-medium">{selectedAsset.size}</p></div>
                                            <div><span className="text-xs text-muted-foreground">Last Updated</span><p className="font-medium">{selectedAsset.lastUpdated}</p></div>
                                            <div><span className="text-xs text-muted-foreground">Asset ID</span><p className="font-medium font-mono">{selectedAsset.id}</p></div>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button size="sm" className="flex-1 gap-1" onClick={() => { toast.success("Download started (mock)"); setSelectedAsset(null) }}>
                                                <Download className="h-4 w-4" /> Download
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => { navigator.clipboard.writeText(`asset://${selectedAsset.id}`); toast.success("Link copied") }}>
                                                <Copy className="h-4 w-4" /> Copy Link
                                            </Button>
                                            <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.info("Preview (mock)")}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )
                        })()}
                    </SheetContent>
                </Sheet>
            </SidebarInset>
        </SidebarProvider>
    )
}
