"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    CalendarBlank,
    CaretLeft,
    CaretRight,
    MagnifyingGlass,
    Clock,
    FlagBanner,
    CurrencyDollar,
    ArrowsClockwise,
    Plus,
} from "@phosphor-icons/react/dist/ssr"
import { BRANDS } from "@/lib/data/brands"

type EventType = "deadline" | "scheduled" | "payment" | "renewal"
type CalendarEvent = {
    id: string
    title: string
    date: string
    time?: string
    type: EventType
    brand?: string
    module: string
    description?: string
}

const EVENT_TYPE_CONFIG: Record<EventType, { label: string; color: string; dotColor: string; bgColor: string }> = {
    deadline: { label: "Deadline", color: "text-red-400", dotColor: "bg-red-400", bgColor: "bg-red-500/10 border-red-500/20" },
    scheduled: { label: "Scheduled", color: "text-blue-400", dotColor: "bg-blue-400", bgColor: "bg-blue-500/10 border-blue-500/20" },
    payment: { label: "Payment", color: "text-emerald-400", dotColor: "bg-emerald-400", bgColor: "bg-emerald-500/10 border-emerald-500/20" },
    renewal: { label: "Renewal", color: "text-amber-400", dotColor: "bg-amber-400", bgColor: "bg-amber-500/10 border-amber-500/20" },
}

const MOCK_EVENTS: CalendarEvent[] = [
    { id: "1", title: "Berhan — Logo Redesign Due", date: "2026-02-16", time: "17:00", type: "deadline", brand: "berhan", module: "Projects", description: "Final logo files due for Merkato Restaurant rebrand project" },
    { id: "2", title: "Tirat — Social Media Post", date: "2026-02-16", time: "10:00", type: "scheduled", brand: "tirat", module: "Content", description: "Portfolio showcase post — Instagram & Facebook" },
    { id: "3", title: "Freelancer Payouts Batch", date: "2026-02-17", type: "payment", module: "Payouts", description: "Semi-monthly freelancer payment cycle — 12 pending payouts totaling 48,500 ETB" },
    { id: "4", title: "Debo — Sprint Review", date: "2026-02-17", time: "14:00", type: "scheduled", brand: "debo", module: "Projects", description: "Sprint review for EthioShop e-commerce MVP" },
    { id: "5", title: "Berhan — Client Invoice Due", date: "2026-02-18", type: "payment", brand: "berhan", module: "Invoices", description: "INV-BH-2026-031 — Addis Pharma social media management — 35,000 ETB balance" },
    { id: "6", title: "tiratstudio.com SSL Renewal", date: "2026-02-19", type: "renewal", brand: "tirat", module: "Domains", description: "SSL certificate expiring — auto-renewal enabled via Cloudflare" },
    { id: "7", title: "EthioBot — Chatbot Demo", date: "2026-02-19", time: "11:00", type: "scheduled", brand: "ethiobot", module: "Projects", description: "Live demo of ManyChat automation flow for Addis Restaurant" },
    { id: "8", title: "Ethio Inf — Campaign Deadline", date: "2026-02-20", type: "deadline", brand: "ethio-influencers", module: "Campaigns", description: "Valentine's influencer campaign final deliverables due" },
    { id: "9", title: "Berhan — Discovery Call", date: "2026-02-20", time: "09:00", type: "scheduled", brand: "berhan", module: "Pipeline", description: "Discovery call with Habesha Brewing for social media management" },
    { id: "10", title: "Debo — Project Delivery", date: "2026-02-21", type: "deadline", brand: "debo", module: "Projects", description: "Final delivery of Addis Pharma website — all pages and QA complete" },
    { id: "11", title: "Tax Filing Deadline", date: "2026-02-22", type: "renewal", module: "Tax", description: "Monthly VAT filing deadline — ensure all invoices reconciled" },
    { id: "12", title: "Tirat — Brand Guide Review", date: "2026-02-22", time: "15:00", type: "scheduled", brand: "tirat", module: "Projects", description: "Internal review of updated Tirat Studio brand guidelines v2" },
    { id: "13", title: "berhandigital.com Domain Renewal", date: "2026-02-23", type: "renewal", brand: "berhan", module: "Domains", description: "Domain renewal due — registrar: GoDaddy" },
    { id: "14", title: "EthioBot — Milestone Payment", date: "2026-02-23", type: "payment", brand: "ethiobot", module: "Invoices", description: "50% milestone payment due from Addis Restaurant chatbot project" },
    { id: "15", title: "Content Planning — March", date: "2026-02-24", time: "10:00", type: "scheduled", module: "Content", description: "Monthly content planning session for all 5 brands — March calendar" },
    { id: "16", title: "Ethio Inf — Influencer QA", date: "2026-02-25", type: "deadline", brand: "ethio-influencers", module: "Content", description: "QA review for 8 influencer-generated posts for Habesha Brewing campaign" },
    { id: "17", title: "Canva Pro Subscription", date: "2026-02-26", type: "renewal", module: "Expenses", description: "Annual Canva Pro Teams subscription renewal — $120/year" },
    { id: "18", title: "Debo — Code Review", date: "2026-02-26", time: "13:00", type: "scheduled", brand: "debo", module: "Projects", description: "Senior developer code review for EthioShop payment integration" },
]

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(1) // February (0-indexed)
    const [currentYear, setCurrentYear] = useState(2026)
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [activeTypes, setActiveTypes] = useState<EventType[]>(["deadline", "scheduled", "payment", "renewal"])
    const [activeBrand, setActiveBrand] = useState<string | null>(null)
    const [search, setSearch] = useState("")

    const filteredEvents = useMemo(() => {
        return MOCK_EVENTS.filter(e => {
            if (!activeTypes.includes(e.type)) return false
            if (activeBrand && e.brand !== activeBrand) return false
            if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false
            return true
        })
    }, [activeTypes, activeBrand, search])

    const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
    const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay()

    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
        else setCurrentMonth(m => m - 1)
    }
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
        else setCurrentMonth(m => m + 1)
    }

    const getEventsForDay = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        return filteredEvents.filter(e => e.date === dateStr)
    }

    const toggleType = (type: EventType) => {
        setActiveTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
    }

    const today = new Date()
    const isToday = (day: number) => today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear

    const brandColorMap: Record<string, string> = {}
    BRANDS.forEach(b => { brandColorMap[b.id] = b.dotColor })

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col gap-6 p-6 max-w-[1400px]">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Master Calendar</h1>
                        <p className="text-sm text-muted-foreground mt-1">Deadlines, meetings, payments, and renewals across all brands.</p>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search events..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>

                        {/* Type filters */}
                        <div className="flex items-center gap-1.5">
                            {(Object.keys(EVENT_TYPE_CONFIG) as EventType[]).map(type => {
                                const cfg = EVENT_TYPE_CONFIG[type]
                                const active = activeTypes.includes(type)
                                return (
                                    <button key={type} onClick={() => toggleType(type)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? cfg.bgColor + " " + cfg.color : "border-border text-muted-foreground opacity-50 hover:opacity-75"}`}>
                                        <span className={`h-2 w-2 rounded-full ${active ? cfg.dotColor : "bg-muted-foreground"}`} />
                                        {cfg.label}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Brand filters */}
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setActiveBrand(null)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${!activeBrand ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                All Brands
                            </button>
                            {BRANDS.map(b => (
                                <button key={b.id} onClick={() => setActiveBrand(b.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activeBrand === b.id ? "bg-white/10 border-white/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    <span className={`h-2 w-2 rounded-full ${b.dotColor}`} />
                                    {b.shortName}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Calendar Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-accent"><CaretLeft className="h-4 w-4" /></button>
                            <h2 className="text-lg font-semibold min-w-[180px] text-center">{MONTHS[currentMonth]} {currentYear}</h2>
                            <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-accent"><CaretRight className="h-4 w-4" /></button>
                        </div>
                        <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Add Event</Button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="rounded-xl border border-border/60 overflow-hidden">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 border-b border-border/60">
                            {DAYS.map(d => (
                                <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
                            ))}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7">
                            {/* Empty cells for days before the 1st */}
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[110px] border-b border-r border-border/30 bg-muted/20" />
                            ))}

                            {/* Actual days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1
                                const events = getEventsForDay(day)
                                const dayIsToday = isToday(day)
                                return (
                                    <div key={day} className={`min-h-[110px] border-b border-r border-border/30 p-1.5 ${dayIsToday ? "bg-blue-500/5" : "hover:bg-accent/30"} transition-colors`}>
                                        <div className={`text-xs font-medium mb-1 flex items-center justify-center w-6 h-6 rounded-full ${dayIsToday ? "bg-blue-500 text-white" : "text-muted-foreground"}`}>
                                            {day}
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            {events.slice(0, 3).map(event => {
                                                const cfg = EVENT_TYPE_CONFIG[event.type]
                                                return (
                                                    <button key={event.id} onClick={() => setSelectedEvent(event)}
                                                        className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] leading-tight truncate border ${cfg.bgColor} ${cfg.color} hover:brightness-125 transition-all`}>
                                                        {event.time && <span className="font-medium">{event.time} </span>}
                                                        {event.title.length > 25 ? event.title.slice(0, 25) + "…" : event.title}
                                                    </button>
                                                )
                                            })}
                                            {events.length > 3 && <span className="text-[10px] text-muted-foreground pl-1">+{events.length - 3} more</span>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Upcoming Events List */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Upcoming Events</h3>
                        <div className="space-y-2">
                            {filteredEvents
                                .sort((a, b) => a.date.localeCompare(b.date))
                                .slice(0, 8)
                                .map(event => {
                                    const cfg = EVENT_TYPE_CONFIG[event.type]
                                    const brand = BRANDS.find(b => b.id === event.brand)
                                    return (
                                        <button key={event.id} onClick={() => setSelectedEvent(event)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-all text-left group">
                                            <div className={`h-8 w-1 rounded-full ${cfg.dotColor}`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium truncate">{event.title}</span>
                                                    {brand && <span className={`h-2 w-2 rounded-full ${brand.dotColor} shrink-0`} />}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                    <span>{new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                                                    {event.time && <><span>·</span><span>{event.time}</span></>}
                                                    <span>·</span>
                                                    <span>{event.module}</span>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>
                                        </button>
                                    )
                                })}
                        </div>
                    </div>
                </div>

                {/* Event Detail Sheet */}
                <Sheet open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                    <SheetContent className="sm:max-w-md">
                        {selectedEvent && (() => {
                            const cfg = EVENT_TYPE_CONFIG[selectedEvent.type]
                            const brand = BRANDS.find(b => b.id === selectedEvent.brand)
                            return (
                                <>
                                    <SheetHeader>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>
                                            {brand && <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${brand.color} ${brand.textColor}`}>{brand.shortName}</span>}
                                        </div>
                                        <SheetTitle className="text-lg">{selectedEvent.title}</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm">
                                                <CalendarBlank className="h-4 w-4 text-muted-foreground" />
                                                <span>{new Date(selectedEvent.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                                            </div>
                                            {selectedEvent.time && (
                                                <div className="flex items-center gap-3 text-sm">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>{selectedEvent.time}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 text-sm">
                                                <FlagBanner className="h-4 w-4 text-muted-foreground" />
                                                <span>Source: {selectedEvent.module}</span>
                                            </div>
                                        </div>
                                        {selectedEvent.description && (
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Details</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{selectedEvent.description}</p>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1 gap-1.5"><ArrowsClockwise className="h-3.5 w-3.5" />Reschedule</Button>
                                            <Button size="sm" className="flex-1 gap-1.5"><CurrencyDollar className="h-3.5 w-3.5" />Go to {selectedEvent.module}</Button>
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
