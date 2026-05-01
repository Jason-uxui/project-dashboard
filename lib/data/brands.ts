export type BrandId = "berhan" | "tirat" | "debo" | "ethio-influencers" | "ethiobot"

export interface Brand {
    id: BrandId
    name: string
    shortName: string
    color: string       // tailwind bg color
    textColor: string   // tailwind text color
    dotColor: string    // tailwind dot bg
    hex: string         // raw hex
    services: string[]
}

export const BRANDS: Brand[] = [
    {
        id: "berhan",
        name: "Berhan Digital",
        shortName: "Berhan",
        color: "bg-blue-500",
        textColor: "text-blue-500",
        dotColor: "bg-blue-500",
        hex: "#3B82F6",
        services: ["Social Media Management", "Digital Marketing", "Content Strategy", "SEO", "Email Marketing"],
    },
    {
        id: "tirat",
        name: "Tirat Studio",
        shortName: "Tirat",
        color: "bg-purple-500",
        textColor: "text-purple-500",
        dotColor: "bg-purple-500",
        hex: "#A855F7",
        services: ["Logo Design", "Branding", "Graphic Design", "Print Design", "Brand Strategy"],
    },
    {
        id: "debo",
        name: "Debo Code",
        shortName: "Debo",
        color: "bg-emerald-500",
        textColor: "text-emerald-500",
        dotColor: "bg-emerald-500",
        hex: "#22C55E",
        services: ["Web Development", "Mobile Apps", "E-commerce", "CMS Setup", "API Integration"],
    },
    {
        id: "ethio-influencers",
        name: "Ethio Influencers",
        shortName: "EthioInf",
        color: "bg-amber-500",
        textColor: "text-amber-500",
        dotColor: "bg-amber-500",
        hex: "#EAB308",
        services: ["Influencer Marketing", "Campaign Management", "Brand Partnerships", "Creator Management"],
    },
    {
        id: "ethiobot",
        name: "EthioBot",
        shortName: "EthioBot",
        color: "bg-red-500",
        textColor: "text-red-500",
        dotColor: "bg-red-500",
        hex: "#EF4444",
        services: ["Chatbot Development", "Automation", "AI Integration", "Workflow Automation"],
    },
]

export const BRAND_MAP: Record<BrandId, Brand> = Object.fromEntries(
    BRANDS.map((b) => [b.id, b])
) as Record<BrandId, Brand>

// Freelancer tiers
export type TierId = "bronze" | "silver" | "gold" | "platinum"

export interface Tier {
    id: TierId
    label: string
    emoji: string
    color: string
    textColor: string
    payPercent: number
    minJobs: number
    minRating: number
    minOnTime: number
}

export const TIERS: Tier[] = [
    { id: "bronze", label: "Bronze", emoji: "🥉", color: "bg-orange-600/10", textColor: "text-orange-600", payPercent: 40, minJobs: 0, minRating: 0, minOnTime: 0 },
    { id: "silver", label: "Silver", emoji: "🥈", color: "bg-slate-400/10", textColor: "text-slate-400", payPercent: 50, minJobs: 10, minRating: 4.0, minOnTime: 85 },
    { id: "gold", label: "Gold", emoji: "🥇", color: "bg-amber-500/10", textColor: "text-amber-500", payPercent: 60, minJobs: 30, minRating: 4.5, minOnTime: 90 },
    { id: "platinum", label: "Platinum", emoji: "💎", color: "bg-cyan-500/10", textColor: "text-cyan-500", payPercent: 70, minJobs: 50, minRating: 4.8, minOnTime: 95 },
]

export const TIER_MAP: Record<TierId, Tier> = Object.fromEntries(
    TIERS.map((t) => [t.id, t])
) as Record<TierId, Tier>

// Project stages
export const PROJECT_STAGES = ["Discovery", "Planning", "Execution", "QA", "Delivery"] as const
export type ProjectStage = typeof PROJECT_STAGES[number]

export const STAGE_COLORS: Record<ProjectStage, string> = {
    Discovery: "bg-blue-500/10 text-blue-500",
    Planning: "bg-purple-500/10 text-purple-500",
    Execution: "bg-amber-500/10 text-amber-500",
    QA: "bg-orange-500/10 text-orange-500",
    Delivery: "bg-emerald-500/10 text-emerald-500",
}

// Content status pipeline
export const CONTENT_STATUSES = ["Idea", "Brief", "In Review", "Scheduled", "Published"] as const
export type ContentStatus = typeof CONTENT_STATUSES[number]

export const CONTENT_STATUS_COLORS: Record<ContentStatus, { bg: string; text: string; dot: string }> = {
    Idea: { bg: "bg-zinc-500/10", text: "text-zinc-400", dot: "bg-zinc-400" },
    Brief: { bg: "bg-blue-500/10", text: "text-blue-500", dot: "bg-blue-500" },
    "In Review": { bg: "bg-amber-500/10", text: "text-amber-500", dot: "bg-amber-500" },
    Scheduled: { bg: "bg-emerald-500/10", text: "text-emerald-500", dot: "bg-emerald-500" },
    Published: { bg: "bg-purple-500/10", text: "text-purple-500", dot: "bg-purple-500" },
}

// Freelancer availability
export type AvailabilityStatus = "Available" | "Busy" | "Partial" | "Inactive"

export const AVAILABILITY_COLORS: Record<AvailabilityStatus, string> = {
    Available: "bg-emerald-500/10 text-emerald-500",
    Busy: "bg-red-500/10 text-red-500",
    Partial: "bg-amber-500/10 text-amber-500",
    Inactive: "bg-zinc-500/10 text-zinc-500",
}

// Lead sources
export const LEAD_SOURCES = ["Referral", "Cross-referral", "Website", "Facebook DM", "Cold Outreach"] as const
export type LeadSource = typeof LEAD_SOURCES[number]

// Operators
export const OPERATORS = [
    { name: "Haz", role: "The Architect", avatar: "HZ" },
    { name: "Meana", role: "The Operator", avatar: "MN" },
    { name: "Salim", role: "The Hunter", avatar: "SL" },
] as const
