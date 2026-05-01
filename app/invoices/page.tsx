"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Plus, MagnifyingGlass, PaperPlaneTilt, Check, WarningCircle } from "@phosphor-icons/react/dist/ssr"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BRANDS, BRAND_MAP, type BrandId } from "@/lib/data/brands"
import { toast } from "sonner"

type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue"

type Invoice = {
    id: string
    client: string
    brand: BrandId
    amount: number
    status: InvoiceStatus
    date: string
    dueDate: string
    items: { desc: string; amount: number }[]
}

const initialInvoices: Invoice[] = [
    { id: "INV-001", client: "Ethio Telecom", brand: "berhan", amount: 45000, status: "Paid", date: "Jan 15", dueDate: "Feb 15", items: [{ desc: "Social Media Management — January", amount: 15000 }, { desc: "Content Creation (12 posts)", amount: 18000 }, { desc: "Analytics Report", amount: 12000 }] },
    { id: "INV-002", client: "BlueMoon Hotel", brand: "tirat", amount: 65000, status: "Sent", date: "Feb 1", dueDate: "Mar 1", items: [{ desc: "Brand Identity Package", amount: 40000 }, { desc: "Brand Guidelines Document", amount: 15000 }, { desc: "Stationery Design", amount: 10000 }] },
    { id: "INV-003", client: "Ride Ethiopia", brand: "debo", amount: 40000, status: "Draft", date: "Feb 10", dueDate: "Mar 10", items: [{ desc: "Website Dev — Milestone 1", amount: 40000 }] },
    { id: "INV-004", client: "Habesha Breweries", brand: "ethio-influencers", amount: 35000, status: "Paid", date: "Jan 20", dueDate: "Feb 20", items: [{ desc: "Valentine Campaign — Full Package", amount: 35000 }] },
    { id: "INV-005", client: "Anbessa Shoe", brand: "tirat", amount: 15000, status: "Overdue", date: "Jan 10", dueDate: "Feb 10", items: [{ desc: "Logo Design Package", amount: 15000 }] },
    { id: "INV-006", client: "Dashen Bank", brand: "ethiobot", amount: 12500, status: "Draft", date: "Feb 14", dueDate: "Mar 14", items: [{ desc: "Bot Setup — Discovery Phase", amount: 12500 }] },
    { id: "INV-007", client: "Awash Bank", brand: "berhan", amount: 15000, status: "Sent", date: "Feb 10", dueDate: "Mar 10", items: [{ desc: "Content Strategy — Phase 1", amount: 15000 }] },
    { id: "INV-008", client: "Commercial Bank", brand: "berhan", amount: 15000, status: "Paid", date: "Feb 1", dueDate: "Feb 28", items: [{ desc: "Social Media — February", amount: 15000 }] },
]

const statusColors: Record<InvoiceStatus, string> = {
    Draft: "bg-zinc-500/10 text-zinc-400",
    Sent: "bg-blue-500/10 text-blue-500",
    Paid: "bg-emerald-500/10 text-emerald-500",
    Overdue: "bg-red-500/10 text-red-400",
}

function formatETB(v: number) { return v.toLocaleString("en-US") }

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState(initialInvoices)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [brandFilter, setBrandFilter] = useState<string>("all")
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newInvoice, setNewInvoice] = useState({ client: "", brand: "" as BrandId | "", amount: "", description: "" })

    const filtered = invoices.filter((inv) => {
        const matchesSearch = search === "" || inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === "all" || inv.status === statusFilter
        const matchesBrand = brandFilter === "all" || inv.brand === brandFilter
        return matchesSearch && matchesStatus && matchesBrand
    })

    const totalPaid = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0)
    const totalOutstanding = invoices.filter(i => i.status === "Sent" || i.status === "Overdue").reduce((s, i) => s + i.amount, 0)
    const overdueCount = invoices.filter(i => i.status === "Overdue").length

    const handleCreate = () => {
        if (!newInvoice.client || !newInvoice.brand) { toast.error("Client and brand required"); return }
        const inv: Invoice = {
            id: `INV-${Date.now().toString().slice(-3)}`,
            client: newInvoice.client, brand: newInvoice.brand as BrandId,
            amount: parseInt(newInvoice.amount) || 0, status: "Draft",
            date: "Feb 16", dueDate: "Mar 16",
            items: [{ desc: newInvoice.description || "Service", amount: parseInt(newInvoice.amount) || 0 }],
        }
        setInvoices(prev => [...prev, inv])
        setIsCreateOpen(false)
        setNewInvoice({ client: "", brand: "", amount: "", description: "" })
        toast.success(`Invoice ${inv.id} created`)
    }

    const updateStatus = (inv: Invoice, newStatus: InvoiceStatus) => {
        setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: newStatus } : i))
        setSelectedInvoice(null)
        toast.success(`${inv.id} marked as ${newStatus}`)
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between border-b border-border/40 px-8 py-5">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">Invoices</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">Client invoices across all brands.</p>
                        </div>
                        <Button size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}><Plus className="h-4 w-4" /> New Invoice</Button>
                    </header>

                    <div className="px-8 py-5 border-b border-border/40">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="rounded-xl border border-border/60 bg-card p-4">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Paid</span>
                                <p className="text-2xl font-bold mt-1 text-emerald-500">{formatETB(totalPaid)} <span className="text-sm font-normal text-muted-foreground">ETB</span></p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-card p-4">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Outstanding</span>
                                <p className="text-2xl font-bold mt-1 text-blue-500">{formatETB(totalOutstanding)} <span className="text-sm font-normal text-muted-foreground">ETB</span></p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-card p-4">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Overdue</span>
                                <p className="text-2xl font-bold mt-1 text-red-400 flex items-center gap-1">{overdueCount} {overdueCount > 0 && <WarningCircle className="h-5 w-5" />}</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-4 border-b border-border/40 flex items-center gap-4">
                        <div className="relative max-w-sm flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search invoices..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            {(["all", "Draft", "Sent", "Paid", "Overdue"] as const).map(s => (
                                <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors ${statusFilter === s ? "bg-muted border-foreground/30" : "border-border hover:bg-muted"}`}>
                                    {s === "all" ? "All" : s}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            {BRANDS.map((b) => (
                                <button key={b.id} onClick={() => setBrandFilter(brandFilter === b.id ? "all" : b.id)} className={`flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium hover:bg-muted transition-colors ${brandFilter === b.id ? "bg-muted border-foreground/30" : ""}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${b.dotColor}`} />{b.shortName}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/40 text-xs text-muted-foreground">
                                    <th className="text-left font-medium px-8 py-3">Invoice</th>
                                    <th className="text-left font-medium px-4 py-3">Client</th>
                                    <th className="text-left font-medium px-4 py-3">Status</th>
                                    <th className="text-left font-medium px-4 py-3">Date</th>
                                    <th className="text-left font-medium px-4 py-3">Due</th>
                                    <th className="text-right font-medium px-8 py-3">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((inv) => {
                                    const brand = BRAND_MAP[inv.brand]
                                    return (
                                        <tr key={inv.id} onClick={() => setSelectedInvoice(inv)} className="border-b border-border/20 hover:bg-muted/30 transition-colors cursor-pointer">
                                            <td className="px-8 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${brand.dotColor}`} />
                                                    <span className="text-sm font-mono font-semibold">{inv.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-sm">{inv.client}</td>
                                            <td className="px-4 py-3.5">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[inv.status]}`}>{inv.status}</span>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-muted-foreground">{inv.date}</td>
                                            <td className={`px-4 py-3.5 text-xs ${inv.status === "Overdue" ? "text-red-400 font-semibold" : "text-muted-foreground"}`}>{inv.dueDate}</td>
                                            <td className="px-8 py-3.5 text-sm font-bold text-right">{formatETB(inv.amount)} <span className="text-xs font-normal text-muted-foreground">ETB</span></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Invoice Detail Sheet */}
                <Sheet open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
                    <SheetContent className="sm:max-w-lg overflow-y-auto">
                        {selectedInvoice && (() => {
                            const brand = BRAND_MAP[selectedInvoice.brand]
                            return (
                                <>
                                    <SheetHeader>
                                        <SheetTitle className="font-mono text-lg">{selectedInvoice.id}</SheetTitle>
                                        <p className="text-sm text-muted-foreground">{selectedInvoice.client} · <span className={`${brand.textColor}`}>{brand.shortName}</span></p>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[selectedInvoice.status]}`}>{selectedInvoice.status}</span>
                                            <p className="text-2xl font-bold">{formatETB(selectedInvoice.amount)} <span className="text-sm font-normal text-muted-foreground">ETB</span></p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><span className="text-xs text-muted-foreground">Issued</span><p className="font-medium">{selectedInvoice.date}</p></div>
                                            <div><span className="text-xs text-muted-foreground">Due Date</span><p className={`font-medium ${selectedInvoice.status === "Overdue" ? "text-red-400" : ""}`}>{selectedInvoice.dueDate}</p></div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Line Items</h4>
                                            <div className="space-y-2">
                                                {selectedInvoice.items.map((item, i) => (
                                                    <div key={i} className="flex justify-between text-sm p-2 rounded-lg bg-muted/30">
                                                        <span>{item.desc}</span>
                                                        <span className="font-semibold">{formatETB(item.amount)}</span>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between text-sm font-bold pt-2 border-t border-border/40">
                                                    <span>Total</span>
                                                    <span>{formatETB(selectedInvoice.amount)} ETB</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            {selectedInvoice.status === "Draft" && (
                                                <Button size="sm" className="flex-1 gap-1" onClick={() => updateStatus(selectedInvoice, "Sent")}>
                                                    <PaperPlaneTilt className="h-4 w-4" /> Send Invoice
                                                </Button>
                                            )}
                                            {(selectedInvoice.status === "Sent" || selectedInvoice.status === "Overdue") && (
                                                <Button size="sm" className="flex-1 gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => updateStatus(selectedInvoice, "Paid")}>
                                                    <Check className="h-4 w-4" /> Mark Paid
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )
                        })()}
                    </SheetContent>
                </Sheet>

                {/* Create Invoice Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>New Invoice</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Client *</Label><Input value={newInvoice.client} onChange={(e) => setNewInvoice(p => ({ ...p, client: e.target.value }))} /></div>
                                <div className="space-y-2">
                                    <Label>Brand *</Label>
                                    <Select value={newInvoice.brand} onValueChange={(v) => setNewInvoice(p => ({ ...p, brand: v as BrandId }))}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>{BRANDS.map(b => <SelectItem key={b.id} value={b.id}>{b.shortName}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2"><Label>Description</Label><Input value={newInvoice.description} onChange={(e) => setNewInvoice(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Social Media Management — March" /></div>
                            <div className="space-y-2"><Label>Amount (ETB)</Label><Input type="number" value={newInvoice.amount} onChange={(e) => setNewInvoice(p => ({ ...p, amount: e.target.value }))} /></div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>Create Invoice</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    )
}
