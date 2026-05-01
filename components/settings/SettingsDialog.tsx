"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
    Bell,
    CheckCircle,
    Circle,
    CircleNotch,
    CopySimple,
    CreditCard,
    DiamondsFour,
    FileText,
    Info,
    LockSimple,
    PencilSimpleLine,
    Plus,
    Robot,
    ShieldCheck,
    SlidersHorizontal,
    Sparkle,
    Spinner,
    SquaresFour,
    Star,
    TrashSimple,
    UploadSimple,
    UserCircle,
    UsersThree,
} from "@phosphor-icons/react/dist/ssr"
import { cn } from "@/lib/utils"

const settingsSections = [
    {
        id: "personal",
        label: "Personal",
        items: [
            { id: "account", label: "Account" },
            { id: "notifications", label: "Notifications" },
        ],
    },
    {
        id: "workspace",
        label: "Workspace",
        items: [
            { id: "preferences", label: "Preferences" },
            { id: "teammates", label: "Teammates" },
            { id: "identity", label: "Identity" },
            { id: "types", label: "Types" },
            { id: "import", label: "Import" },
        ],
    },
    {
        id: "ai",
        label: "AI",
        items: [
            { id: "agents", label: "Agents" },
            { id: "skills", label: "Skills" },
        ],
    },
] as const

const settingsItemIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    account: UserCircle,
    notifications: Bell,
    preferences: SlidersHorizontal,
    teammates: UsersThree,
    identity: ShieldCheck,
    types: SquaresFour,
    import: UploadSimple,
    agents: Robot,
    skills: Sparkle,
}

type SettingsItemId = (typeof settingsSections)[number]["items"][number]["id"]

type SettingsDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

function TeammatesSettingsPane() {
    const [inviteRole, setInviteRole] = useState("freelancer")

    const teammates = [
        {
            id: "khanh",
            name: "Khánh Dương",
            email: "duongdaikhanh2502@gmail.com",
            status: "Active",
            role: "Admin",
            avatar: "/avatar-profile.jpg",
        },
    ] as const

    return (
        <div className="space-y-8">
            <div>
                <DialogTitle className="text-xl">Teammates</DialogTitle>
                <DialogDescription className="mt-1">
                    Invite and manage your teammates to collaborate. You can also {" "}
                    <Link href="#" className="text-primary underline underline-offset-4">
                        set up AI agents
                    </Link>{" "}
                    to work alongside your team.
                </DialogDescription>
            </div>

            <Separator />

            <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input placeholder="Invite teammates by email" className="flex-1" />
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger className="sm:w-40">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="freelancer">Freelancer</SelectItem>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="button" size="lg" className="sm:w-auto rounded-lg">
                        Invite
                    </Button>
                </div>
            </div>

            <div className="rounded-2xl border border-border">
                <div className="grid grid-cols-12 px-4 py-3 text-xs font-medium text-muted-foreground">
                    <span className="col-span-6">Name</span>
                    <span className="col-span-3">Status</span>
                    <span className="col-span-3 text-right sm:text-left">Role</span>
                </div>
                <div className="divide-y divide-border">
                    {teammates.map((mate) => (
                        <div key={mate.id} className="grid grid-cols-12 items-center px-4 py-4">
                            <div className="col-span-6 flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={mate.avatar} />
                                    <AvatarFallback>KD</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground">{mate.name}</span>
                                    <span className="text-xs text-muted-foreground">{mate.email}</span>
                                </div>
                            </div>
                            <div className="col-span-3 text-sm text-muted-foreground">{mate.status}</div>
                            <div className="col-span-3 text-sm text-foreground text-right sm:text-left">{mate.role}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const [activeItemId, setActiveItemId] = useState<SettingsItemId>("account")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton
                className="sm:max-w-5xl w-full p-0 rounded-3xl overflow-hidden sm:max-h-[85vh] sm:h-[85vh]"
            >
                <div className="flex h-full flex-col sm:flex-row sm:min-h-0">
                    <aside className="w-full border-b border-border/60 bg-muted/40 px-4 py-4 sm:w-64 sm:border-b-0 sm:border-r">
                        <div className="space-y-4 text-sm">
                            {settingsSections.map((section) => (
                                <div key={section.id} className="space-y-1.5">
                                    <div className="text-sm font-semibold text-muted-foreground">
                                        {section.label}
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        {section.items.map((item) => {
                                            const isActive = item.id === activeItemId
                                            const Icon = settingsItemIcons[item.id]
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => setActiveItemId(item.id)}
                                                    className={cn(
                                                        "flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-left text-[15px] text-muted-foreground hover:bg-accent hover:text-foreground",
                                                        isActive && "bg-accent text-foreground",
                                                    )}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {Icon && <Icon className="h-4 w-4" />}
                                                        {item.label}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <main className="flex-1 min-h-0 overflow-y-auto px-6 py-6 sm:min-h-0">
                        {activeItemId === "account" && <AccountSettingsPane />}
                        {activeItemId === "notifications" && <NotificationsSettingsPane />}
                        {activeItemId === "preferences" && <PreferencesSettingsPane />}
                        {activeItemId === "teammates" && <TeammatesSettingsPane />}
                        {activeItemId === "identity" && <IdentitySettingsPane />}
                        {activeItemId === "types" && <TypesSettingsPane />}
                        {activeItemId === "import" && <ImportSettingsPane />}
                        {activeItemId === "agents" && <AgentsSettingsPane />}
                        {activeItemId === "skills" && <SkillsSettingsPane />}
                        {activeItemId !== "account" &&
                            activeItemId !== "notifications" &&
                            activeItemId !== "preferences" &&
                            activeItemId !== "teammates" &&
                            activeItemId !== "identity" &&
                            activeItemId !== "types" &&
                            activeItemId !== "import" && (
                            activeItemId !== "billing" &&
                            activeItemId !== "import" &&
                            activeItemId !== "agents" &&
                            activeItemId !== "skills" && (
                                <PlaceholderSettingsPane />
                            )}
                    </main>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function AccountSettingsPane() {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [photoPreview, setPhotoPreview] = useState("/avatar-profile.jpg")
    const [objectUrl, setObjectUrl] = useState<string | null>(null)
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl)
            }
        }
    }, [objectUrl])

    const handleRequestPhoto = () => {
        fileInputRef.current?.click()
    }

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const nextUrl = URL.createObjectURL(file)
        setPhotoPreview(nextUrl)
        setObjectUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            return nextUrl
        })
    }

    const handleResetPhoto = () => {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl)
            setObjectUrl(null)
        }
        setPhotoPreview("/avatar-profile.jpg")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <DialogTitle className="text-xl">Account</DialogTitle>
                <DialogDescription className="mt-1">
                    Manage your personal information and account preferences.
                </DialogDescription>
            </div>

            <Separator />

            <SettingSection title="Information">
                <SettingRow label="Profile photo" description="This image appears across your workspace.">
                    <div className="flex flex-wrap items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={photoPreview} />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={handleRequestPhoto}>
                                Change photo
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                                aria-label="Upload profile photo"
                            />
                        </div>
                    </div>
                </SettingRow>
                <SettingRow label="Full name">
                    <Input defaultValue="Khánh Dương" className="h-9 text-sm" />
                </SettingRow>
                <SettingRow label="Email address" description="Notifications will be sent to this address.">
                    <Input defaultValue="duongdaikhanh2502@gmail.com" type="email" className="h-9 text-sm" readOnly />
                </SettingRow>
                <SettingRow label="Password" description="Last changed 2 months ago.">
                    <div className="flex items-center justify-between gap-3 rounded-md border border-input bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                        <span>••••••••</span>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                            Set password
                        </Button>
                    </div>
                </SettingRow>
            </SettingSection>

            <Separator />

            <SettingSection title="Appearance">
                <SettingRow label="Theme">
                    <Select
                        value={isMounted ? theme ?? "system" : "system"}
                        onValueChange={(value) => setTheme(value)}
                    >
                        <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="system">System default</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                    </Select>
                </SettingRow>
                <SettingRow
                    label="Open links in app"
                    description="When you click a link, open it in the app if possible."
                >
                    <Switch defaultChecked />
                </SettingRow>
            </SettingSection>

            <Separator />

            <SettingSection title="Location and time">
                <SettingRow label="Timezone">
                    <Select defaultValue="asia-saigon">
                        <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asia-saigon">Saigon, Asia</SelectItem>
                            <SelectItem value="asia-bangkok">Bangkok, Asia</SelectItem>
                            <SelectItem value="utc">UTC</SelectItem>
                        </SelectContent>
                    </Select>
                </SettingRow>
                <SettingRow
                    label="Start weeks on"
                    description="The first day of the week in your calendars."
                >
                    <Select defaultValue="monday">
                        <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="sunday">Sunday</SelectItem>
                        </SelectContent>
                    </Select>
                </SettingRow>
            </SettingSection>

            <Separator />

            <SettingSection title="Authentication">
                <SettingRow
                    label="Token"
                    description="Manage your API key, a bearer authentication token."
                >
                    <Button variant="outline" size="sm" className="h-8 gap-2 px-3 text-xs">
                        + Create authentication token
                    </Button>
                </SettingRow>
                <SettingRow label="User ID" description="Share this ID if you contact support.">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input value="7nsqk2c2v1R" readOnly className="font-mono text-sm" />
                        <Button variant="ghost" size="icon-sm" className="shrink-0">
                            <CopySimple className="h-4 w-4" />
                        </Button>
                    </div>
                </SettingRow>
            </SettingSection>
        </div>
    )
}

function PreferencesSettingsPane() {
    const [copied, setCopied] = useState(false)
    const workspaceName = "Jason's Workspace"
    const workspaceId = "p2r2nVMXkdxl"

    useEffect(() => {
        if (!copied) return
        const t = setTimeout(() => setCopied(false), 1500)
        return () => clearTimeout(t)
    }, [copied])

    const handleCopyId = async () => {
        try {
            await navigator.clipboard.writeText(workspaceId)
            setCopied(true)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <DialogTitle className="text-xl">Preferences</DialogTitle>
                <DialogDescription className="mt-1">
                    Manage your workspace details, and set global workspace preferences.
                </DialogDescription>
            </div>

            <Separator />

            <SettingSection title="Information">
                <SettingRow label="Workspace" description="This is the name shown across the workspace.">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-inner">
                            <img src="/logo-wrapper.png" alt="Workspace" className="h-7 w-7" />
                        </div>
                        <Input defaultValue={workspaceName} className="h-9 text-sm" />
                    </div>
                </SettingRow>
            </SettingSection>

            <Separator />

            <SettingSection title="Preferences">
                <SettingRow label="Workspace ID" description="Use this ID when connecting integrations.">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input readOnly value={workspaceId} className="font-mono text-sm" />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={handleCopyId}
                        >
                            <CopySimple className="h-4 w-4" />
                            {copied ? "Copied" : "Copy"}
                        </Button>
                    </div>
                </SettingRow>
            </SettingSection>
        </div>
    )
}

function IdentitySettingsPane() {
    const samlLink = "#"
    const scimLink = "#"

    const identityCards = [
        {
            id: "saml",
            title: "SAML SSO",
            description:
                "Allow users to log in with SAML single sign-on (SSO). Read the help center article for configuration steps.",
            helpHref: samlLink,
            toggleLabel: "Enable SAML SSO",
            enabled: false,
        },
        {
            id: "scim",
            title: "SCIM",
            description:
                "Use SCIM provisioning to automatically create, update, and delete users. Read the help center article for configuration steps.",
            helpHref: scimLink,
            toggleLabel: "Enable SCIM",
            enabled: false,
        },
    ] as const

    return (
        <div className="space-y-8">
            <div>
                <DialogTitle className="text-xl">Identity</DialogTitle>
                <DialogDescription className="mt-1">
                    Secure and streamline user access. Enable SAML SSO for single sign-on and SCIM provisioning for automated account management.
                </DialogDescription>
            </div>

            <Separator />

            <div className="space-y-6">
                {identityCards.map((card) => (
                    <div key={card.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-foreground">{card.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {card.description.split("help center article")[0]}
                            <Link href={card.helpHref} className="text-primary underline underline-offset-4">
                                help center article
                            </Link>{" "}
                            {card.description.split("help center article")[1]}
                        </p>
                        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                            <span className="text-sm text-foreground">{card.toggleLabel}</span>
                            <Switch disabled={!card.enabled} defaultChecked={card.enabled} />
                        </div>
                    </div>
                ))}
            </div>


        </div>
    )
}



function ImportSettingsPane() {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const steps = [
        { id: 1, label: "Upload" },
        { id: 2, label: "Select header" },
        { id: 3, label: "Map columns" },
        { id: 4, label: "Import" },
    ] as const
    const [activeStep, setActiveStep] = useState<(typeof steps)[number]["id"]>(1)
    const [headerRow, setHeaderRow] = useState(1)
    const [importStatus, setImportStatus] = useState<"idle" | "running" | "done">("idle")
    const [importProgress, setImportProgress] = useState(0)
    const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null)

    const columns = [
        { name: "ID", required: false },
        { name: "Title", required: true },
        { name: "Board", required: false },
        { name: "Status", required: false },
        { name: "Description", required: false },
        { name: "Parent ID", required: false },
        { name: "Assignee emails", required: false },
        { name: "Tags", required: false },
        { name: "Priority", required: false },
    ] as const

    const previewRows = [
        { id: 1, cells: ["Task Name", "Status", "Owner", "Due Date", "Priority"] },
        { id: 2, cells: ["Finalize onboarding flow", "In progress", "Liam", "2026-02-10", "High"] },
        { id: 3, cells: ["Scope pricing page refresh", "Not started", "Ari", "2026-02-18", "Medium"] },
        { id: 4, cells: ["Launch client feedback survey", "Blocked", "Maya", "2026-02-25", "High"] },
        { id: 5, cells: ["Update Q1 roadmap", "In review", "Noah", "2026-03-01", "Low"] },
    ] as const

    const sourceColumns = [
        { id: "Task Name", samples: ["Finalize onboarding flow", "Update Q1 roadmap"] },
        { id: "Status", samples: ["In progress", "Blocked"] },
        { id: "Owner", samples: ["Liam", "Maya"] },
        { id: "Due Date", samples: ["2026-02-10", "2026-03-01"] },
        { id: "Priority", samples: ["High", "Medium"] },
    ] as const

    const mappingFields = [
        { id: "title", label: "Title", required: true, suggested: "Task Name" },
        { id: "status", label: "Status", required: false, suggested: "Status" },
        { id: "assignee", label: "Assignee", required: false, suggested: "Owner" },
        { id: "dueDate", label: "Due date", required: false, suggested: "Due Date" },
        { id: "priority", label: "Priority", required: false, suggested: "Priority" },
        { id: "description", label: "Description", required: false, suggested: "__skip" },
        { id: "tags", label: "Tags", required: false, suggested: "__skip" },
    ] as const

    const [columnMapping, setColumnMapping] = useState<Record<string, string>>(
        mappingFields.reduce(
            (acc, field) => {
                acc[field.id] = field.suggested ?? "__skip"
                return acc
            },
            {} as Record<string, string>,
        ),
    )

    const requiredFields = mappingFields.filter((field) => field.required)
    const mappedRequiredCount = requiredFields.filter((field) => columnMapping[field.id] !== "__skip").length
    const missingRequired = requiredFields.filter((field) => columnMapping[field.id] === "__skip")
    const totalRows = 2430
    const errorRows = 17
    const skippedRows = 6
    const processedRows = Math.min(totalRows, Math.round((importProgress / 100) * totalRows))
    const completedRows = totalRows - errorRows - skippedRows
    const importStages = [
        { id: "validate", label: "Validating headers", threshold: 10 },
        { id: "map", label: "Mapping columns", threshold: 35 },
        { id: "create", label: "Creating tasks", threshold: 75 },
        { id: "finalize", label: "Finalizing import", threshold: 100 },
    ] as const
    const resetImportFlow = () => {
        setActiveStep(1)
        setHeaderRow(1)
        setUploadedFile(null)
        setImportStatus("idle")
        setImportProgress(0)
        setColumnMapping(
            mappingFields.reduce(
                (acc, field) => {
                    acc[field.id] = field.suggested ?? "__skip"
                    return acc
                },
                {} as Record<string, string>,
            ),
        )
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }
    const formatBytes = (bytes: number) => {
        if (!bytes) return "0 B"
        const k = 1024
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)))
        const value = bytes / Math.pow(k, i)
        return `${value.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        const extension = file.name.split(".").pop()?.toUpperCase() ?? "FILE"
        setUploadedFile({
            name: file.name,
            size: formatBytes(file.size),
            type: extension,
        })
    }

    useEffect(() => {
        if (activeStep !== 4) {
            setImportStatus("idle")
            setImportProgress(0)
        }
    }, [activeStep])

    useEffect(() => {
        if (activeStep === 4 && importStatus === "idle") {
            setImportProgress(0)
            setImportStatus("running")
        }
    }, [activeStep, importStatus])

    useEffect(() => {
        if (activeStep !== 4 || importStatus !== "running") {
            return
        }

        const interval = setInterval(() => {
            setImportProgress((prev) => {
                const increment = Math.floor(Math.random() * 8) + 6
                const next = Math.min(100, prev + increment)
                if (next >= 100) {
                    setImportStatus("done")
                }
                return next
            })
        }, 450)

        return () => clearInterval(interval)
    }, [activeStep, importStatus])

    return (
        <div className="space-y-8">
            <div>
                <DialogTitle className="text-xl">Import</DialogTitle>
                <DialogDescription className="mt-1">
                    Bring your existing data in just a few steps. Upload your file, map your properties, and
                    import tasks seamlessly.
                </DialogDescription>
            </div>

            <Separator />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {steps.map((step, index) => {
                        const isActive = step.id === activeStep
                        const isComplete = step.id < activeStep
                        const isLast = index === steps.length - 1
                        const StepIcon = isComplete ? CheckCircle : Circle
                        return (
                            <div key={step.id} className="flex items-center gap-3 text-sm text-muted-foreground">
                                <button
                                    type="button"
                                    onClick={() => setActiveStep(step.id)}
                                    className={cn(
                                        "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1",
                                        isActive
                                            ? "border-primary/50 bg-primary/10 text-primary"
                                            : isComplete
                                                ? "border-primary/40 bg-primary/5 text-primary/80"
                                            : "border-border text-muted-foreground",
                                    )}
                                >
                                    <StepIcon className="h-4 w-4" weight={isComplete ? "fill" : "regular"} />
                                    <span className="text-xs font-semibold">{step.id}.</span>
                                    <span>{step.label}</span>
                                </button>
                                {!isLast && <span className="text-sm">›</span>}
                            </div>
                        )
                    })}
                </div>

                {activeStep === 1 && (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                        <div className="flex h-full flex-col gap-4">
                            {!uploadedFile && (
                                <label className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-6 text-center transition hover:border-primary/50 hover:bg-primary/5">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                    />
                                    <UploadSimple className="h-6 w-6 text-primary" />
                                    <p className="text-sm font-medium text-foreground">
                                        Browse or drag your file here
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">CSV or XLSX up to 10MB</p>
                                </label>
                            )}

                            {uploadedFile && (
                                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/70 px-4 py-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-foreground">
                                                {uploadedFile.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {uploadedFile.size} · Completed
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        className="text-muted-foreground hover:text-foreground"
                                        onClick={() => setUploadedFile(null)}
                                        aria-label="Remove file"
                                    >
                                        <TrashSimple className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-card/70">
                            <div className="grid grid-cols-[minmax(0,1fr)_100px] border-b border-border/60 px-4 py-3 text-xs font-semibold text-muted-foreground">
                                <span>Expected column</span>
                                <span className="text-right">Required</span>
                            </div>
                            <div className="divide-y divide-border/70">
                                {columns.map((column) => (
                                    <div key={column.name} className="flex items-center justify-between px-4 py-3 text-sm">
                                        <div className="flex items-center gap-2 text-foreground">
                                            <span>{column.name}</span>
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="text-muted-foreground">
                                            {column.required ? (
                                                <CheckCircle className="h-4 w-4 text-primary" weight="fill" />
                                            ) : (
                                                "—"
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeStep === 2 && (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                        <div className="space-y-4 rounded-2xl border border-border/70 bg-card/60 p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Pick the header row</p>
                                    <p className="text-xs text-muted-foreground">
                                        Choose the row that contains your column names.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>Header row</span>
                                    <Select
                                        value={String(headerRow)}
                                        onValueChange={(value) => setHeaderRow(Number(value))}
                                    >
                                        <SelectTrigger className="h-8 w-[120px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {previewRows.map((row) => (
                                                <SelectItem key={row.id} value={String(row.id)}>
                                                    Row {row.id}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-border/70">
                                <div className="overflow-x-auto">
                                    <div className="min-w-[640px]">
                                        <div className="grid grid-cols-[60px_repeat(5,minmax(120px,1fr))] gap-0 border-b border-border/60 bg-muted/50 px-2 py-2 text-[11px] font-semibold text-muted-foreground">
                                            <span className="pl-2">Row</span>
                                            <span>Col A</span>
                                            <span>Col B</span>
                                            <span>Col C</span>
                                            <span>Col D</span>
                                            <span>Col E</span>
                                        </div>
                                        <div className="divide-y divide-border/70">
                                            {previewRows.map((row) => {
                                                const isSelected = headerRow === row.id
                                                return (
                                                    <button
                                                        key={row.id}
                                                        type="button"
                                                        onClick={() => setHeaderRow(row.id)}
                                                        className={cn(
                                                            "grid w-full grid-cols-[60px_repeat(5,minmax(120px,1fr))] items-center px-2 py-3 text-left text-sm",
                                                            isSelected
                                                                ? "bg-primary/10 text-foreground"
                                                                : "bg-transparent text-muted-foreground hover:bg-muted/30",
                                                        )}
                                                    >
                                                        <span className="flex items-center gap-2 pl-2 text-xs font-semibold">
                                                            {isSelected ? (
                                                                <CheckCircle className="h-4 w-4 text-primary" weight="fill" />
                                                            ) : (
                                                                <Circle className="h-4 w-4 text-muted-foreground" />
                                                            )}
                                                            {row.id}
                                                        </span>
                                                        {row.cells.map((cell, index) => (
                                                            <span key={index} className={cn(isSelected && "text-foreground")}>
                                                                {cell}
                                                            </span>
                                                        ))}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
                                <p className="text-sm font-semibold text-foreground">File insights</p>
                                <div className="mt-4 space-y-3 text-xs text-muted-foreground">
                                    <div className="flex items-center justify-between">
                                        <span>Detected columns</span>
                                        <span className="text-foreground">5 columns</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Rows scanned</span>
                                        <span className="text-foreground">2,430 rows</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Delimiter</span>
                                        <span className="text-foreground">Comma</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Encoding</span>
                                        <span className="text-foreground">UTF-8</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border/70 bg-muted/20 p-5">
                                <p className="text-sm font-semibold text-foreground">How we use this</p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    We will use row {headerRow} as the field names, then start importing from the next row.
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-primary" weight="fill" />
                                    First data row will be row {headerRow + 1}.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeStep === 3 && (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                        <div className="space-y-4 rounded-2xl border border-border/70 bg-card/60 p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Map your columns</p>
                                    <p className="text-xs text-muted-foreground">
                                        Match source columns to Dart fields. Required fields must be mapped.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs"
                                    onClick={() =>
                                        setColumnMapping((prev) => {
                                            const next = { ...prev }
                                            mappingFields.forEach((field) => {
                                                next[field.id] = field.suggested ?? "__skip"
                                            })
                                            return next
                                        })
                                    }
                                >
                                    Auto-map
                                </Button>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-border/70">
                                <div className="grid grid-cols-[minmax(0,1fr)_220px] border-b border-border/60 bg-muted/50 px-4 py-2 text-xs font-semibold text-muted-foreground">
                                    <span>Expected field</span>
                                    <span>Map to column</span>
                                </div>
                                <div className="divide-y divide-border/70">
                                    {mappingFields.map((field) => (
                                        <div key={field.id} className="grid grid-cols-[minmax(0,1fr)_220px] items-center px-4 py-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-foreground">{field.label}</span>
                                                {field.required && (
                                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                                        Required
                                                    </span>
                                                )}
                                            </div>
                                            <Select
                                                value={columnMapping[field.id]}
                                                onValueChange={(value) =>
                                                    setColumnMapping((prev) => ({
                                                        ...prev,
                                                        [field.id]: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__skip">Do not import</SelectItem>
                                                    {sourceColumns.map((column) => (
                                                        <SelectItem key={column.id} value={column.id}>
                                                            {column.id}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
                                <p className="text-sm font-semibold text-foreground">Source columns</p>
                                <div className="mt-4 space-y-3 text-xs text-muted-foreground">
                                    {sourceColumns.map((column) => (
                                        <div key={column.id} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                                            <div className="flex items-center justify-between text-sm text-foreground">
                                                <span>{column.id}</span>
                                                <span className="text-[10px] text-muted-foreground">Sample values</span>
                                            </div>
                                            <div className="mt-2 text-[11px] text-muted-foreground">
                                                {column.samples.join(" · ")}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border/70 bg-muted/20 p-5">
                                <p className="text-sm font-semibold text-foreground">Mapping status</p>
                                <div className="mt-3 text-xs text-muted-foreground">
                                    Required fields mapped: {mappedRequiredCount}/{requiredFields.length}
                                </div>
                                {missingRequired.length > 0 ? (
                                    <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                                        {missingRequired.map((field) => (
                                            <div key={field.id} className="flex items-center gap-2">
                                                <Circle className="h-4 w-4 text-muted-foreground" />
                                                <span>{field.label} is not mapped</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                        <CheckCircle className="h-4 w-4 text-primary" weight="fill" />
                                        All required fields are mapped.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeStep === 4 && (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                        <div className="space-y-5 rounded-2xl border border-border/70 bg-card/60 p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {importStatus === "done" ? "Import complete" : "Importing tasks"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {importStatus === "done"
                                            ? "Review the summary and open your imported tasks."
                                            : "We are validating and creating tasks from your file."}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {importStatus === "running" ? (
                                        <>
                                            <CircleNotch className="h-4 w-4 animate-spin text-primary" />
                                            Importing
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-primary" weight="fill" />
                                            Finished
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Progress value={importProgress} />
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>
                                        {importStatus === "done"
                                            ? `Processed ${totalRows} rows`
                                            : `Processing ${processedRows} / ${totalRows} rows`}
                                    </span>
                                    <span className="text-foreground">{importProgress}%</span>
                                </div>
                            </div>

                            <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                                <p className="text-xs font-semibold text-muted-foreground">Import activity</p>
                                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                                    {importStages.map((stage, index) => {
                                        const isComplete = importProgress >= stage.threshold
                                        const isActive =
                                            importProgress < stage.threshold &&
                                            (index === 0 || importProgress >= importStages[index - 1].threshold)
                                        return (
                                            <div key={stage.id} className="flex items-center gap-2">
                                                {isComplete ? (
                                                    <CheckCircle className="h-4 w-4 text-primary" weight="fill" />
                                                ) : isActive ? (
                                                    <CircleNotch className="h-4 w-4 animate-spin text-primary" />
                                                ) : (
                                                    <Circle className="h-4 w-4 text-muted-foreground" />
                                                )}
                                                <span className={cn(isComplete && "text-foreground")}>{stage.label}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
                                <p className="text-sm font-semibold text-foreground">Import summary</p>
                                <div className="mt-4 space-y-3 text-xs text-muted-foreground">
                                    <div className="flex items-center justify-between">
                                        <span>Total rows</span>
                                        <span className="text-foreground">{totalRows}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Imported tasks</span>
                                        <span className="text-foreground">
                                            {importStatus === "done" ? completedRows : Math.max(0, processedRows - 5)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Skipped rows</span>
                                        <span className="text-foreground">{skippedRows}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Errors</span>
                                        <span className="text-foreground">{errorRows}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border/70 bg-muted/20 p-5">
                                <p className="text-sm font-semibold text-foreground">Next actions</p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {importStatus === "done"
                                        ? "Open the created tasks or download an error report."
                                        : "You can leave this open while the import completes."}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Button type="button" size="sm" className="h-9 px-4">
                                        View tasks
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" className="h-9 px-4">
                                        Download error report
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                    {activeStep < 4 && (
                        <Button type="button" variant="ghost" size="sm" className="h-9 px-3" onClick={resetImportFlow}>
                            Cancel import
                        </Button>
                    )}
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 px-4"
                            onClick={() => setActiveStep((step) => Math.max(1, step - 1) as (typeof steps)[number]["id"])}
                            disabled={activeStep === 1}
                        >
                            Back
                        </Button>
                        {activeStep < steps.length - 1 && (
                            <Button
                                type="button"
                                size="sm"
                                className="h-9 px-4"
                                onClick={() =>
                                    setActiveStep(
                                        (step) => Math.min(steps.length, step + 1) as (typeof steps)[number]["id"],
                                    )
                                }
                            >
                                Next
                            </Button>
                        )}
                        {activeStep === steps.length - 1 && (
                            <Button
                                type="button"
                                size="sm"
                                className="h-9 px-4"
                                onClick={() => {
                                    setActiveStep(4)
                                    setImportProgress(0)
                                    setImportStatus("running")
                                }}
                            >
                                Start import
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function TypesSettingsPane() {
    const typeNav = [
        { id: "task", label: "Task", icon: "☑" },
        { id: "project", label: "Project", icon: "▲" },
        { id: "workstream", label: "Workstream", icon: "★" },
    ] as const
    const [activeType, setActiveType] = useState<(typeof typeNav)[number]["id"]>("task")

    const workflowGroups = [
        {
            id: "unstarted",
            label: "Unstarted",
            steps: [{ id: "todo", label: "To-do", description: "Tasks that are not started yet", state: "todo", locked: true }],
        },
        {
            id: "started",
            label: "Started",
            steps: [{ id: "doing", label: "Doing", description: "Tasks that are in progress", state: "doing", locked: false }],
        },
        {
            id: "finished",
            label: "Finished",
            steps: [{ id: "done", label: "Done", description: "Tasks that are done", state: "done", locked: true }],
        },
        { id: "canceled", label: "Canceled", steps: [] },
    ] as const

    const stepIcon = (state?: string) => {
        switch (state) {
            case "doing":
                return { Icon: CircleNotch, className: "text-blue-500" }
            case "done":
                return { Icon: CheckCircle, className: "text-green-500" }
            default:
                return { Icon: Spinner, className: "text-muted-foreground" }
        }
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-border">
            <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
                <div className="border-b border-border/60 bg-card/70 lg:border-b-0 lg:border-r">
                    <div className="px-4 py-3 border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Types
                    </div>
                    <div>
                        {typeNav.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveType(item.id)}
                                className={cn(
                                    "flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-sm transition",
                                    activeType === item.id
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted/40",
                                )}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 bg-background/40 p-6">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Edit type</p>
                        <div className="mt-4 flex flex-col gap-2">
                            <label className="text-xs font-medium text-muted-foreground">Name</label>
                            <Input value={typeNav.find((t) => t.id === activeType)?.label} readOnly className="h-9 text-sm" />
                        </div>
                    </div>

                    <Separator className="bg-border/80" />

                    <div className="space-y-4 pt-2">
                        <p className="text-sm font-semibold text-foreground">Workflow</p>
                        <div className="space-y-6">
                            {workflowGroups.map((group) => (
                                <div key={group.id} className="space-y-3">
                                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        <span>{group.label}</span>
                                        <button type="button" className="cursor-pointer text-muted-foreground hover:text-foreground">
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {group.steps.length > 0 && (
                                        <div className="space-y-2">
                                            {group.steps.map((step) => {
                                                const { Icon, className } = stepIcon(step.state)
                                                return (
                                                    <div
                                                        key={step.id}
                                                        className="flex items-center gap-4 rounded-2xl bg-muted/20 px-4 py-3"
                                                    >
                                                        <span className={cn("flex h-6 w-6 items-center justify-center", className)}>
                                                            <Icon className="h-4 w-4" weight={step.state === "doing" ? "bold" : "regular"} />
                                                        </span>
                                                        <div className="flex flex-1 items-center gap-4 text-sm text-foreground">
                                                            <span className="font-medium">{step.label}</span>
                                                            <span className="flex-1 text-left text-muted-foreground">{step.description}</span>
                                                        </div>
                                                        <div className="text-muted-foreground">
                                                            {step.locked ? (
                                                                <LockSimple className="h-4 w-4" />
                                                            ) : step.id === "doing" ? null : (
                                                                <Plus className="h-4 w-4" />
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function NotificationsSettingsPane() {
    const methodItems = [
        {
            id: "in-app",
            title: "In-app",
            description: "Notifications will go into your Inbox",
            enabled: true,
        },
        {
            id: "email",
            title: "Email",
            description: "You will receive emails about events",
            enabled: true,
        },
    ] as const

    const detailCards = [
        {
            id: "recommended",
            title: "Recommended settings",
            description: "Stick with defaults so you never miss an important update and avoid spam.",
            icon: Star,
            highlighted: true,
        },
        {
            id: "custom",
            title: "Custom settings",
            description: "Fine-tune notifications to only receive updates you care about.",
            icon: PencilSimpleLine,
            highlighted: false,
        },
    ] as const

    return (
        <div className="space-y-8">
            <div>
                <DialogTitle className="text-xl">Notifications</DialogTitle>
                <DialogDescription className="mt-1">
                    Stay in the loop without the noise. Choose where you get updates, and customize which activities trigger notifications.
                </DialogDescription>
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Methods</h3>
                <div className="space-y-3">
                    {methodItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border border-border bg-card/80 px-4 py-3"
                        >
                            <div className="flex flex-col">
                                <span className="text-sm text-foreground">{item.title}</span>
                                <span className="text-xs text-muted-foreground">{item.description}</span>
                            </div>
                            <Switch defaultChecked={item.enabled} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {detailCards.map((card) => (
                        <button
                            key={card.id}
                            type="button"
                            className={cn(
                                "flex cursor-pointer flex-col gap-2 rounded-2xl border px-4 py-4 text-left transition shadow-sm",
                                card.highlighted
                                    ? "border-primary/40 bg-primary/5 text-foreground"
                                    : "border-border bg-card/60 text-foreground",
                            )}
                        >
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <span
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full",
                                        card.highlighted ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                                    )}
                                >
                                    <card.icon className="h-4 w-4" />
                                </span>
                                {card.title}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {card.description}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

function AgentsSettingsPane() {
    const capabilityHighlights = [
        {
            id: "planning",
            label: "Plan work and break it into tasks with clear owners.",
            icon: CheckCircle,
        },
        {
            id: "review",
            label: "Review specs and docs for gaps before execution.",
            icon: ShieldCheck,
        },
        {
            id: "updates",
            label: "Draft status updates and summaries for the team.",
            icon: PencilSimpleLine,
        },
        {
            id: "automation",
            label: "Run checks and workflows with approval guardrails.",
            icon: Sparkle,
        },
    ] as const

    const moreAgents = [
        {
            id: "create",
            title: "Create a custom agent",
            description: "Design a specialist with your tools, rules, and API connections.",
            icon: Plus,
            variant: "create",
        },
        {
            id: "spec-writer",
            title: "Product spec writer",
            description: "Turns ideas into structured specs, milestones, and acceptance criteria.",
            icon: PencilSimpleLine,
            variant: "default",
        },
        {
            id: "qa-tester",
            title: "QA tester",
            description: "Finds regressions, drafts test plans, and highlights risks.",
            icon: CheckCircle,
            variant: "default",
        },
        {
            id: "ui-reviewer",
            title: "UI reviewer",
            description: "Audits UI for consistency, accessibility, and polish.",
            icon: Sparkle,
            variant: "default",
        },
        {
            id: "release",
            title: "Release manager",
            description: "Builds release notes, launch checklists, and stakeholder updates.",
            icon: ShieldCheck,
            variant: "default",
        },
        {
            id: "support",
            title: "Customer support drafts",
            description: "Writes empathetic replies with product-aware context.",
            icon: UsersThree,
            variant: "default",
        },
    ] as const

    const quickActions = [
        { id: "manage", label: "Manage agents", icon: SlidersHorizontal, variant: "outline" as const },
        { id: "invite", label: "Invite teammate", icon: UsersThree, variant: "outline" as const },
        { id: "connect", label: "Connect tools", icon: UploadSimple, variant: "default" as const },
    ] as const

    return (
        <div className="space-y-8">
            <div>
                <DialogTitle className="text-xl">Agents</DialogTitle>
                <DialogDescription className="mt-1">
                    Create specialized AI teammates to plan, write, review, and ship work alongside you. Each agent
                    has its own tools, rules, and permissions.
                </DialogDescription>
            </div>

            <Separator />

            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-foreground">Your team</h3>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                        Manage agents
                    </Button>
                </div>
                <div className="rounded-2xl border border-border bg-card/70 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Robot className="h-5 w-5" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">Dart AI</span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        Active
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Plan, manage, and build any task or project with the full context of your workspace.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                                View activity
                            </Button>
                            <Button size="sm" className="h-8 px-3 text-xs">
                                Open agent
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {capabilityHighlights.map((capability) => {
                            const Icon = capability.icon
                            return (
                                <div
                                    key={capability.id}
                                    className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground"
                                >
                                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Icon className="h-3.5 w-3.5" />
                                    </span>
                                    <span>{capability.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">More agents</h3>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground">
                        Browse all templates
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {moreAgents.map((agent) => {
                        const Icon = agent.icon
                        const isCreate = agent.variant === "create"
                        return (
                            <button
                                key={agent.id}
                                type="button"
                                className={cn(
                                    "flex h-full cursor-pointer flex-col gap-3 rounded-2xl border px-4 py-4 text-left transition",
                                    isCreate
                                        ? "border-dashed border-primary/50 bg-primary/5 text-foreground hover:border-primary/70"
                                        : "border-border bg-card/70 text-foreground hover:border-primary/40 hover:bg-primary/5",
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex h-9 w-9 items-center justify-center rounded-xl",
                                        isCreate ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                </span>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold">{agent.title}</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Quick actions</h3>
                <div className="flex flex-wrap gap-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon
                        return (
                            <Button key={action.id} variant={action.variant} size="sm" className="gap-2">
                                <Icon className="h-4 w-4" />
                                {action.label}
                            </Button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

function SkillsSettingsPane() {
    const installedSkills = [
        {
            id: "figma",
            name: "Figma to code",
            description: "Translate design frames into UI-ready components.",
            category: "Design",
            lastUsed: "2 days ago",
            enabled: true,
            icon: Sparkle,
        },
        {
            id: "ci",
            name: "CI failure triage",
            description: "Summarize failed checks and propose next fixes.",
            category: "DevOps",
            lastUsed: "Yesterday",
            enabled: true,
            icon: ShieldCheck,
        },
        {
            id: "meeting",
            name: "Meeting to action items",
            description: "Extract decisions and next steps from transcripts.",
            category: "Docs",
            lastUsed: "4 days ago",
            enabled: false,
            icon: PencilSimpleLine,
        },
    ] as const

    const skillLibrary = [
        {
            id: "release-notes",
            title: "Release notes generator",
            description: "Turns merged work into polished release notes.",
            icon: Star,
        },
        {
            id: "support",
            title: "Support reply drafts",
            description: "Creates empathetic responses with product context.",
            icon: UsersThree,
        },
        {
            id: "research",
            title: "User research summaries",
            description: "Condenses interviews into insights and themes.",
            icon: Sparkle,
        },
        {
            id: "roadmap",
            title: "Roadmap planner",
            description: "Builds milestones and timelines from strategy notes.",
            icon: SlidersHorizontal,
        },
    ] as const

    const insights = [
        { id: "top-skill", label: "Top skill", value: "Figma to code" },
        { id: "weekly-runs", label: "Runs this week", value: "28" },
        { id: "time-saved", label: "Estimated time saved", value: "6.4 hrs" },
    ] as const

    return (
        <div className="space-y-8">
            <div>
                <DialogTitle className="text-xl">Skills</DialogTitle>
                <DialogDescription className="mt-1">
                    Skills are reusable workflows and toolchains. Add them to agents or use them directly to speed up
                    repeat tasks.
                </DialogDescription>
            </div>

            <Separator />

            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-foreground">Installed skills</h3>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                        Manage library
                    </Button>
                </div>
                <div className="space-y-3">
                    {installedSkills.map((skill) => {
                        const Icon = skill.icon
                        return (
                            <div
                                key={skill.id}
                                className="flex flex-col gap-4 rounded-2xl border border-border bg-card/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground">{skill.name}</p>
                                            <p className="text-xs text-muted-foreground">{skill.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                                        <span className="rounded-full border border-border/70 px-2 py-0.5">
                                            {skill.category}
                                        </span>
                                        <span className="rounded-full border border-border/70 px-2 py-0.5">
                                            Last used {skill.lastUsed}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "text-xs font-semibold",
                                            skill.enabled ? "text-emerald-400" : "text-muted-foreground",
                                        )}
                                    >
                                        {skill.enabled ? "Active" : "Paused"}
                                    </span>
                                    <Switch defaultChecked={skill.enabled} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Skill library</h3>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground">
                        Browse all
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {skillLibrary.map((skill) => {
                        const Icon = skill.icon
                        return (
                            <button
                                key={skill.id}
                                type="button"
                                className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-border bg-card/70 px-4 py-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                                    <Icon className="h-4 w-4" />
                                </span>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold">{skill.title}</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{skill.description}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Add a skill</h3>
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Install from library
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <UploadSimple className="h-4 w-4" />
                        Import from repo
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Sparkle className="h-4 w-4" />
                        Create new skill
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Usage insights</h3>
                <div className="grid gap-3 md:grid-cols-3">
                    {insights.map((insight) => (
                        <div
                            key={insight.id}
                            className="rounded-2xl border border-border bg-muted/30 px-4 py-3"
                        >
                            <div className="text-xs text-muted-foreground">{insight.label}</div>
                            <div className="mt-1 text-sm font-semibold text-foreground">{insight.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function PlaceholderSettingsPane() {
    return (
        <div className="flex h-full flex-col items-start justify-center gap-2">
            <DialogTitle className="text-xl">Settings preview</DialogTitle>
            <DialogDescription>
                This area is reserved for additional settings pages in the full product.
            </DialogDescription>
        </div>
    )
}

function SettingSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="space-y-4">
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <div className="space-y-5">{children}</div>
        </section>
    )
}

function SettingRow({
    label,
    description,
    children,
}: {
    label: string
    description?: string
    children: ReactNode
}) {
    return (
        <div className="flex flex-col gap-10 sm:grid sm:grid-cols-[minmax(0,250px)_minmax(0,1fr)] sm:items-center sm:gap-6">
            <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">{label}</div>
                {description && <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>}
            </div>
            <div className="flex flex-col gap-2 text-sm text-foreground">{children}</div>
        </div>
    )
}
