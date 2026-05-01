"use client"

import { useState } from "react"
import {
    Plus,
    UserPlus,
    FolderSimplePlus,
    CalendarPlus,
    FilePlus,
    CheckCircle,
    X,
    CreditCard,
    Target,
    Lightning,
} from "@phosphor-icons/react/dist/ssr"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BRANDS } from "@/lib/data/brands"
import { ProjectWizard } from "./project-wizard/ProjectWizard"
import { ClientWizard } from "./clients/ClientWizard"
import { TaskQuickCreateModal } from "./tasks/TaskQuickCreateModal"

export function GlobalCreate() {
    const [open, setOpen] = useState(false)
    const [isProjectWizardOpen, setIsProjectWizardOpen] = useState(false)
    const [isClientWizardOpen, setIsClientWizardOpen] = useState(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group z-50 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 font-bold" />
                        <Plus className="h-6 w-6 font-bold" weight="bold" />
                    </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/40 shadow-2xl">
                    <Tabs defaultValue="client" className="w-full">
                        <DialogHeader className="p-6 bg-muted/20 border-b border-border/40 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                                        <Lightning className="h-4 w-4 text-blue-500" weight="fill" />
                                    </div>
                                    <DialogTitle className="text-xl font-bold tracking-tight uppercase tracking-[0.1em]">Quick Create</DialogTitle>
                                </div>
                            </div>

                            <TabsList className="bg-muted/40 p-1 w-full justify-start mt-4 border border-white/5 h-10 font-bold">
                                <TabsTrigger value="client" className="text-[10px] uppercase font-bold flex-1 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all tracking-widest"><UserPlus className="h-3.5 w-3.5" /> Client</TabsTrigger>
                                <TabsTrigger value="project" className="text-[10px] uppercase font-bold flex-1 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all tracking-widest"><FolderSimplePlus className="h-3.5 w-3.5" /> Project</TabsTrigger>
                                <TabsTrigger value="task" className="text-[10px] uppercase font-bold flex-1 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all tracking-widest"><CheckCircle className="h-3.5 w-3.5" /> Task</TabsTrigger>
                                <TabsTrigger value="payout" className="text-[10px] uppercase font-bold flex-1 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all tracking-widest"><CreditCard className="h-3.5 w-3.5" /> Payout</TabsTrigger>
                            </TabsList>
                        </DialogHeader>

                        <div className="p-8 space-y-6 font-bold overflow-y-auto max-h-[60vh]">
                            <TabsContent value="client" className="mt-0 space-y-4">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="client-name" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Company Name</Label>
                                        <Input id="client-name" placeholder="Merkato Restaurant" className="h-9 font-bold" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="client-source" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Lead Source</Label>
                                        <Select>
                                            <SelectTrigger className="h-9 font-bold">
                                                <SelectValue placeholder="Select Source" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="direct">Direct Referral</SelectItem>
                                                <SelectItem value="linkedin">LinkedIn / Social</SelectItem>
                                                <SelectItem value="inbound">Website Form</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => {
                                        setOpen(false)
                                        setIsClientWizardOpen(true)
                                    }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 mt-2 font-bold uppercase tracking-widest text-xs h-10"
                                >
                                    Open Client Wizard
                                </Button>
                            </TabsContent>

                            <TabsContent value="project" className="mt-0 space-y-4 font-bold">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="project-title" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest font-bold">Project Title</Label>
                                        <Input id="project-title" placeholder="Website Redesign 2026" className="h-9 font-bold" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2 font-bold">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Primary Brand</Label>
                                            <Select>
                                                <SelectTrigger className="h-9 font-bold">
                                                    <SelectValue placeholder="Brand" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {BRANDS.map(b => (
                                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2 font-bold">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Module</Label>
                                            <Select>
                                                <SelectTrigger className="h-9 font-bold">
                                                    <SelectValue placeholder="Module" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="creative">Creative</SelectItem>
                                                    <SelectItem value="dev">Software</SelectItem>
                                                    <SelectItem value="growth">Growth</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => {
                                        setOpen(false)
                                        setIsProjectWizardOpen(true)
                                    }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 mt-2 font-bold uppercase tracking-widest text-xs h-10"
                                >
                                    Start Project Wizard
                                </Button>
                            </TabsContent>

                            <TabsContent value="task" className="mt-0 space-y-4 font-bold">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="task-name" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest font-bold">Task Description</Label>
                                        <Input id="task-name" placeholder="Finalize logo variants" className="h-9 font-bold" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest font-bold">Priority</Label>
                                            <Select>
                                                <SelectTrigger className="h-9 font-bold">
                                                    <SelectValue placeholder="Low" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">Urgent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-[10px) uppercase font-bold text-muted-foreground tracking-widest font-bold">Due Date</Label>
                                            <Input type="date" className="h-9 font-bold" />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => {
                                        setOpen(false)
                                        setIsTaskModalOpen(true)
                                    }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 mt-2 font-bold uppercase tracking-widest text-xs h-10"
                                >
                                    Open Task Builder
                                </Button>
                            </TabsContent>

                            <TabsContent value="payout" className="mt-0 space-y-4 font-bold">
                                <div className="grid gap-4 font-bold">
                                    <div className="grid gap-2 font-bold">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest font-bold">Freelancer</Label>
                                        <Select>
                                            <SelectTrigger className="h-9 font-bold">
                                                <SelectValue placeholder="Select Recipient" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hana">Hana Tadesse</SelectItem>
                                                <SelectItem value="dawit">Dawit Mengistu</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2 font-bold">
                                        <Label htmlFor="payout-amount" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest font-bold">Amount (ETB)</Label>
                                        <Input id="payout-amount" type="number" placeholder="5000" className="h-9 font-bold" />
                                    </div>
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-2 font-bold uppercase tracking-widest text-xs h-10">Schedule Payout</Button>
                            </TabsContent>
                        </div>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {isProjectWizardOpen && (
                <ProjectWizard onClose={() => setIsProjectWizardOpen(false)} />
            )}
            {isClientWizardOpen && (
                <ClientWizard mode="create" onClose={() => setIsClientWizardOpen(false)} />
            )}
            <TaskQuickCreateModal
                open={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
            />
        </>
    )
}
