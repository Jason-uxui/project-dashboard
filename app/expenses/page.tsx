"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Plus, MagnifyingGlass, Receipt, Check } from "@phosphor-icons/react/dist/ssr"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BRANDS, BRAND_MAP, type BrandId } from "@/lib/data/brands"
import { toast } from "sonner"

type ExpenseCategory = "Software" | "Freelancer" | "Ads" | "Equipment" | "Office" | "Travel" | "Legal" | "Other"
type Expense = {
    id: string
    description: string
    brand: BrandId
    category: ExpenseCategory
    amount: number
    date: string
    receipt: boolean
    approved: boolean
    vendor: string
}

const initialExpenses: Expense[] = [
    { id: "EXP-001", description: "Adobe Creative Cloud — Monthly", brand: "tirat", category: "Software", amount: 4500, date: "Feb 1", receipt: true, approved: true, vendor: "Adobe" },
    { id: "EXP-002", description: "Facebook Ads — Ethio Telecom Campaign", brand: "berhan", category: "Ads", amount: 12000, date: "Feb 5", receipt: true, approved: true, vendor: "Meta" },
    { id: "EXP-003", description: "Liya B. — Logo Design (Anbessa Shoe)", brand: "tirat", category: "Freelancer", amount: 5000, date: "Feb 8", receipt: false, approved: true, vendor: "Liya Bekele" },
    { id: "EXP-004", description: "Vercel Pro Plan — Monthly", brand: "debo", category: "Software", amount: 2800, date: "Feb 1", receipt: true, approved: true, vendor: "Vercel" },
    { id: "EXP-005", description: "TikTok Ads — Valentine Campaign", brand: "ethio-influencers", category: "Ads", amount: 8000, date: "Feb 10", receipt: true, approved: true, vendor: "TikTok" },
    { id: "EXP-006", description: "Studio Lighting Equipment", brand: "tirat", category: "Equipment", amount: 15000, date: "Feb 12", receipt: true, approved: false, vendor: "Local Vendor" },
    { id: "EXP-007", description: "Dawit S. — Website Dev (Ride Ethiopia)", brand: "debo", category: "Freelancer", amount: 20000, date: "Feb 14", receipt: false, approved: true, vendor: "Dawit Solomon" },
    { id: "EXP-008", description: "Google Workspace — Team", brand: "berhan", category: "Software", amount: 3200, date: "Feb 1", receipt: true, approved: true, vendor: "Google" },
    { id: "EXP-009", description: "Canva Pro — Annual", brand: "berhan", category: "Software", amount: 1200, date: "Jan 15", receipt: true, approved: true, vendor: "Canva" },
    { id: "EXP-010", description: "Hanna F. — Video Editing (Dashen Bank)", brand: "ethiobot", category: "Freelancer", amount: 8000, date: "Feb 15", receipt: false, approved: false, vendor: "Hanna Fikru" },
]

const categoryColors: Record<ExpenseCategory, string> = {
    Software: "bg-purple-500/10 text-purple-500",
    Freelancer: "bg-blue-500/10 text-blue-500",
    Ads: "bg-orange-500/10 text-orange-500",
    Equipment: "bg-zinc-500/10 text-zinc-400",
    Office: "bg-emerald-500/10 text-emerald-500",
    Travel: "bg-amber-500/10 text-amber-500",
    Legal: "bg-red-500/10 text-red-400",
    Other: "bg-zinc-500/10 text-zinc-400",
}

function formatETB(v: number) { return v.toLocaleString("en-US") }

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState(initialExpenses)
    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [brandFilter, setBrandFilter] = useState<string>("all")
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newExpense, setNewExpense] = useState({ description: "", brand: "" as BrandId | "", category: "" as ExpenseCategory | "", amount: "", vendor: "" })

    const filtered = expenses.filter((e) => {
        const matchesSearch = search === "" || e.description.toLowerCase().includes(search.toLowerCase()) || e.vendor.toLowerCase().includes(search.toLowerCase())
        const matchesCat = categoryFilter === "all" || e.category === categoryFilter
        const matchesBrand = brandFilter === "all" || e.brand === brandFilter
        return matchesSearch && matchesCat && matchesBrand
    })

    const totalExpenses = filtered.reduce((s, e) => s + e.amount, 0)
    const pendingApproval = expenses.filter(e => !e.approved).length
    const missingReceipts = expenses.filter(e => !e.receipt).length

    const categoryBreakdown = Object.entries(
        expenses.reduce<Record<string, number>>((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc }, {})
    ).sort((a, b) => b[1] - a[1])

    const handleCreate = () => {
        if (!newExpense.description || !newExpense.brand) { toast.error("Description and brand required"); return }
        const expense: Expense = {
            id: `EXP-${Date.now().toString().slice(-3)}`,
            description: newExpense.description, brand: newExpense.brand as BrandId,
            category: (newExpense.category as ExpenseCategory) || "Other",
            amount: parseInt(newExpense.amount) || 0, date: "Feb 16",
            receipt: false, approved: false, vendor: newExpense.vendor,
        }
        setExpenses(prev => [...prev, expense])
        setIsCreateOpen(false)
        setNewExpense({ description: "", brand: "", category: "", amount: "", vendor: "" })
        toast.success("Expense recorded")
    }

    const approveExpense = (exp: Expense) => {
        setExpenses(prev => prev.map(e => e.id === exp.id ? { ...e, approved: true } : e))
        setSelectedExpense(null)
        toast.success(`${exp.id} approved`)
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between border-b border-border/40 px-8 py-5">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">Expenses</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">Track operational costs across all brands.</p>
                        </div>
                        <Button size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}><Plus className="h-4 w-4" /> Log Expense</Button>
                    </header>

                    <div className="px-8 py-5 border-b border-border/40">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="rounded-xl border border-border/60 bg-card p-4">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</span>
                                <p className="text-2xl font-bold mt-1">{formatETB(totalExpenses)} <span className="text-sm font-normal text-muted-foreground">ETB</span></p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-card p-4">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pending Approval</span>
                                <p className="text-2xl font-bold mt-1 text-amber-500">{pendingApproval}</p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-card p-4">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Missing Receipts</span>
                                <p className="text-2xl font-bold mt-1 text-red-400">{missingReceipts}</p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-card p-4">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Top Category</span>
                                <p className="text-sm font-bold mt-1">{categoryBreakdown[0]?.[0]}</p>
                                <p className="text-xs text-muted-foreground">{formatETB(categoryBreakdown[0]?.[1] || 0)} ETB</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-4 border-b border-border/40 flex items-center gap-4">
                        <div className="relative max-w-sm flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search expenses..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <button onClick={() => setCategoryFilter("all")} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors ${categoryFilter === "all" ? "bg-muted border-foreground/30" : "border-border hover:bg-muted"}`}>All</button>
                            {(["Software", "Freelancer", "Ads", "Equipment"] as ExpenseCategory[]).map(c => (
                                <button key={c} onClick={() => setCategoryFilter(categoryFilter === c ? "all" : c)} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors ${categoryFilter === c ? "bg-muted border-foreground/30" : "border-border hover:bg-muted"}`}>{c}</button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/40 text-xs text-muted-foreground">
                                    <th className="text-left font-medium px-8 py-3">Expense</th>
                                    <th className="text-left font-medium px-4 py-3">Category</th>
                                    <th className="text-left font-medium px-4 py-3">Vendor</th>
                                    <th className="text-left font-medium px-4 py-3">Date</th>
                                    <th className="text-center font-medium px-4 py-3">Receipt</th>
                                    <th className="text-center font-medium px-4 py-3">Approved</th>
                                    <th className="text-right font-medium px-8 py-3">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((exp) => {
                                    const brand = BRAND_MAP[exp.brand]
                                    return (
                                        <tr key={exp.id} onClick={() => setSelectedExpense(exp)} className="border-b border-border/20 hover:bg-muted/30 transition-colors cursor-pointer">
                                            <td className="px-8 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <span className={`h-2 w-2 rounded-full ${brand.dotColor}`} />
                                                    <div>
                                                        <p className="text-sm font-medium truncate max-w-[280px]">{exp.description}</p>
                                                        <p className="text-[11px] text-muted-foreground">{exp.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5"><span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColors[exp.category]}`}>{exp.category}</span></td>
                                            <td className="px-4 py-3.5 text-xs text-muted-foreground">{exp.vendor}</td>
                                            <td className="px-4 py-3.5 text-xs text-muted-foreground">{exp.date}</td>
                                            <td className="px-4 py-3.5 text-center">{exp.receipt ? <Receipt className="h-4 w-4 text-emerald-500 mx-auto" /> : <span className="text-red-400 text-[10px]">Missing</span>}</td>
                                            <td className="px-4 py-3.5 text-center">{exp.approved ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <span className="text-amber-500 text-[10px]">Pending</span>}</td>
                                            <td className="px-8 py-3.5 text-sm font-bold text-right">{formatETB(exp.amount)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expense Detail Sheet */}
                <Sheet open={!!selectedExpense} onOpenChange={(open) => !open && setSelectedExpense(null)}>
                    <SheetContent className="sm:max-w-lg overflow-y-auto">
                        {selectedExpense && (() => {
                            const brand = BRAND_MAP[selectedExpense.brand]
                            return (
                                <>
                                    <SheetHeader>
                                        <SheetTitle>{selectedExpense.description}</SheetTitle>
                                        <p className="text-sm text-muted-foreground">{selectedExpense.id} · <span className={brand.textColor}>{brand.shortName}</span></p>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        <p className="text-3xl font-bold">{formatETB(selectedExpense.amount)} <span className="text-sm font-normal text-muted-foreground">ETB</span></p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><span className="text-xs text-muted-foreground">Category</span><p className="font-medium">{selectedExpense.category}</p></div>
                                            <div><span className="text-xs text-muted-foreground">Vendor</span><p className="font-medium">{selectedExpense.vendor}</p></div>
                                            <div><span className="text-xs text-muted-foreground">Date</span><p className="font-medium">{selectedExpense.date}</p></div>
                                            <div><span className="text-xs text-muted-foreground">Receipt</span><p className={`font-medium ${selectedExpense.receipt ? "text-emerald-500" : "text-red-400"}`}>{selectedExpense.receipt ? "Attached" : "Missing"}</p></div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
                                            <span className="text-sm">Approval Status</span>
                                            <span className={`text-sm font-semibold ${selectedExpense.approved ? "text-emerald-500" : "text-amber-500"}`}>{selectedExpense.approved ? "Approved" : "Pending"}</span>
                                        </div>
                                        {!selectedExpense.approved && (
                                            <Button size="sm" className="w-full gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => approveExpense(selectedExpense)}>
                                                <Check className="h-4 w-4" /> Approve Expense
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )
                        })()}
                    </SheetContent>
                </Sheet>

                {/* Create Expense Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>Log Expense</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2"><Label>Description *</Label><Input value={newExpense.description} onChange={(e) => setNewExpense(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Adobe CC subscription" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Brand *</Label>
                                    <Select value={newExpense.brand} onValueChange={(v) => setNewExpense(p => ({ ...p, brand: v as BrandId }))}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>{BRANDS.map(b => <SelectItem key={b.id} value={b.id}>{b.shortName}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={newExpense.category} onValueChange={(v) => setNewExpense(p => ({ ...p, category: v as ExpenseCategory }))}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>{(["Software", "Freelancer", "Ads", "Equipment", "Office", "Travel", "Legal", "Other"] as ExpenseCategory[]).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Vendor</Label><Input value={newExpense.vendor} onChange={(e) => setNewExpense(p => ({ ...p, vendor: e.target.value }))} /></div>
                                <div className="space-y-2"><Label>Amount (ETB)</Label><Input type="number" value={newExpense.amount} onChange={(e) => setNewExpense(p => ({ ...p, amount: e.target.value }))} /></div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>Log Expense</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    )
}
