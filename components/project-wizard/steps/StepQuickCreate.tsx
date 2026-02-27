import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../../ui/calendar";
import { Button } from "../../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { Check, X, CalendarBlank, UserCircle, Spinner, List, Paperclip, Microphone, Rows, ChartBar, Tag } from "@phosphor-icons/react/dist/ssr";
import { ProjectDescriptionEditor } from "../ProjectDescriptionEditor";
import { clients, type Client } from "@/lib/data/clients";
import type { CreateProjectInput } from "@/hooks/use-projects-crud";

// --- Mock Data ---

const USERS = [
  { id: "1", name: "Jason D", avatar: "/avatar-profile.jpg" },
  { id: "2", name: "Sarah Connor", avatar: "" },
  { id: "3", name: "Alex Murphy", avatar: "" },
];

const STATUSES = [
  { id: "backlog", label: "Backlog", dotClass: "bg-orange-600" },
  { id: "todo", label: "Todo", dotClass: "bg-neutral-300" },
  { id: "in-progress", label: "In Progress", dotClass: "bg-yellow-400" },
  { id: "done", label: "Done", dotClass: "bg-green-600" },
  { id: "canceled", label: "Canceled", dotClass: "bg-neutral-400" },
];

const PRIORITIES = [
  { id: "no-priority", label: "No Priority", icon: "BarChart" },
  { id: "urgent", label: "Urgent", icon: "AlertCircle" },
  { id: "high", label: "High", icon: "ArrowUp" },
  { id: "medium", label: "Medium", icon: "ArrowRight" },
  { id: "low", label: "Low", icon: "ArrowDown" },
];

const SPRINT_TYPES = [
  { id: "design", label: "Design Sprint" },
  { id: "dev", label: "Dev Sprint" },
  { id: "planning", label: "Planning" },
];

const WORKSTREAMS = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "design", label: "Design" },
  { id: "qa", label: "QA" },
];

const TAGS = [
  { id: "bug", label: "Bug", color: "var(--chart-5)" },
  { id: "feature", label: "Feature", color: "var(--chart-2)" },
  { id: "enhancement", label: "Enhancement", color: "var(--chart-4)" },
  { id: "docs", label: "Documentation", color: "var(--chart-3)" },
];

// --- Helper Components ---

function Wrapper({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn("relative shrink-0 size-[16px]", className)}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        {children}
      </svg>
    </div>
  );
}


// --- Pickers ---

interface PickerProps<T> {
  trigger: React.ReactNode;
  items: T[];
  onSelect: (item: T) => void;
  selectedId?: string;
  placeholder?: string;
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
}

export function GenericPicker<
  T extends { id: string; label?: string; name?: string },
>({
  trigger,
  items,
  onSelect,
  selectedId,
  placeholder = "Search...",
  renderItem,
}: PickerProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="p-0 w-[240px]" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.label || item.name || item.id}
                  onSelect={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {renderItem(item, item.id === selectedId)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface DatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  trigger: React.ReactNode;
}

export function DatePicker({
  date,
  onSelect,
  trigger,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            onSelect(d);
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// --- Main Component ---

interface StepQuickCreateProps {
  onClose: () => void;
  onCreate: (input: CreateProjectInput) => Promise<void> | void;
  onExpandChange?: (isExpanded: boolean) => void;
}

export function StepQuickCreate({
  onClose,
  onCreate,
  onExpandChange,
}: StepQuickCreateProps) {
  const [title, setTitle] = useState("");
  // Description is now managed by Tiptap editor

  // Data State
  const [assignee, setAssignee] = useState(USERS[0]);
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(),
  );
  const [status, setStatus] = useState(STATUSES[1]); // Todo default
  const [sprintType, setSprintType] = useState<
    (typeof SPRINT_TYPES)[0] | null
  >(null);
  const [targetDate, setTargetDate] = useState<
    Date | undefined
  >();
  const [workstream, setWorkstream] = useState<
    (typeof WORKSTREAMS)[0] | null
  >(null);
  const [priority, setPriority] = useState<
    (typeof PRIORITIES)[0] | null
  >(null);
  const [selectedTag, setSelectedTag] = useState<
    (typeof TAGS)[0] | null
  >(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    // Focus title on mount
    const timer = setTimeout(() => {
      const titleInput = document.getElementById(
        "quick-create-title",
      );
      if (titleInput) titleInput.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      void handleCreate();
    }
  };

  const mapStatusToProjectStatus = (
    statusId: string,
  ): CreateProjectInput["status"] => {
    switch (statusId) {
      case "todo":
        return "planned";
      case "in-progress":
        return "active";
      case "done":
        return "completed";
      case "canceled":
        return "cancelled";
      case "backlog":
      default:
        return "backlog";
    }
  };

  const mapPriorityToProjectPriority = (
    priorityId?: string,
  ): CreateProjectInput["priority"] => {
    switch (priorityId) {
      case "urgent":
        return "urgent";
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "medium";
    }
  };

  const handleCreate = async () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) return;

    const start = startDate ?? new Date();
    const end = targetDate
      ? targetDate
      : new Date(start.getFullYear(), start.getMonth(), start.getDate() + 14);

    const payload: CreateProjectInput = {
      name: normalizedTitle,
      status: mapStatusToProjectStatus(status.id),
      priority: mapPriorityToProjectPriority(priority?.id),
      startDate: start,
      endDate: end,
      client: client?.name,
      typeLabel: sprintType?.label,
      tags: selectedTag ? [selectedTag.label.toLowerCase()] : [],
      members: assignee ? [assignee.name] : [],
    };

    await onCreate(payload);
  };

  return (
    <div
      className="bg-background relative rounded-3xl size-full font-sans overflow-hidden flex flex-col"
      onKeyDown={handleKeyDown}
    >
      {/* Close Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-4 top-3 opacity-70 hover:opacity-100 rounded-xl"
      >
        <X className="size-4 text-muted-foreground" />
      </Button>

      <div className="flex flex-col flex-1 p-3.5 px-4 gap-3.5 overflow-hidden">
        {/* Title Input */}
        <div className="flex flex-col gap-2 w-full shrink-0 mt-2">
          <div className="flex gap-1 h-10 items-center w-full">
            <input
              id="quick-create-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              className="w-full font-normal leading-7 text-foreground placeholder:text-muted-foreground text-xl outline-none bg-transparent border-none p-0"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Description Area (Tiptap) */}
        <ProjectDescriptionEditor onExpandChange={onExpandChange} />

        {/* Property Buttons - Interactive Dropdowns */}
        <div className="flex flex-wrap gap-2.5 items-start w-full shrink-0">
          {/* Owner Picker */}
          <GenericPicker
            items={USERS}
            onSelect={setAssignee}
            selectedId={assignee.id}
            placeholder="Assign owner..."
            renderItem={(item, isSelected) => (
              <div className="flex items-center gap-2 w-full">
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt=""
                    className="size-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {item.name.charAt(0)}
                  </div>
                )}
                <span className="flex-1">{item.name}</span>
                {isSelected && <Check className="size-4" />}
              </div>
            )}
            trigger={
              <button className="bg-muted flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="relative rounded-full size-4 overflow-hidden">
                  {assignee.avatar ? (
                    <img
                      alt=""
                      className="object-cover size-full"
                      src={assignee.avatar}
                    />
                  ) : (
                    <div className="bg-muted size-full flex items-center justify-center text-xs">
                      {assignee.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="font-medium text-foreground text-sm leading-5">
                  {assignee.name}
                </span>
              </button>
            }
          />

          {/* Start Date Picker */}
          <DatePicker
            date={startDate}
            onSelect={setStartDate}
            trigger={
              <button className="bg-muted flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <CalendarBlank className="size-4 text-muted-foreground" />
                <span className="font-medium text-foreground text-sm leading-5">
                  {startDate
                    ? `Start: ${format(startDate, "dd/MM/yyyy")}`
                    : "Start Date"}
                </span>
              </button>
            }
          />

          {/* Client Picker */}
          <GenericPicker
            items={clients}
            onSelect={setClient}
            selectedId={client?.id}
            placeholder="Assign client..."
            renderItem={(item, isSelected) => (
              <div className="flex items-center gap-2 w-full">
                <div className="size-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                  {item.name.charAt(0)}
                </div>
                <span className="flex-1">{item.name}</span>
                {isSelected && <Check className="size-4" />}
              </div>
            )}
            trigger={
              <button
                className={cn(
                  "flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border transition-colors",
                  client
                    ? "bg-muted"
                    : "bg-background hover:bg-black/5",
                )}
              >
                <UserCircle className="size-4 text-muted-foreground" />
                <span className="font-medium text-foreground text-sm leading-5">
                  {client ? client.name : "Client"}
                </span>
              </button>
            }
          />

          {/* Status Picker */}
          <GenericPicker
            items={STATUSES}
            onSelect={setStatus}
            selectedId={status.id}
            placeholder="Change status..."
            renderItem={(item, isSelected) => (
              <div className="flex items-center gap-2 w-full">
                <div className={cn("size-3 rounded-full", item.dotClass)} />
                <span className="flex-1">{item.label}</span>
                {isSelected && <Check className="size-4" />}
              </div>
            )}
            trigger={
              <button
                className={cn(
                  "flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border transition-colors",
                  "bg-background hover:bg-black/5",
                )}
              >
                <Wrapper>
                  <g
                    clipPath="url(#clip0_13_2475)"
                    id="Icon / Loader"
                  >
                  <Spinner className="size-4 text-muted-foreground" />
                  </g>
                  <defs>
                    <clipPath id="clip0_13_2475">
                      <rect
                        fill="white"
                        height="16"
                        width="16"
                      />
                    </clipPath>
                  </defs>
                </Wrapper>
                {status.id !== "backlog" && (
                  <div className={cn("size-2 rounded-full", (status as any).dotClass)} />
                )}
                <span className="font-medium text-foreground text-sm leading-5">
                  {status.label}
                </span>
              </button>
            }
          />

          {/* Sprint Type Picker */}
          <GenericPicker
            items={SPRINT_TYPES}
            onSelect={setSprintType}
            selectedId={sprintType?.id}
            placeholder="Select sprint type..."
            renderItem={(item, isSelected) => (
              <div className="flex items-center gap-2 w-full">
                <span className="flex-1">{item.label}</span>
                {isSelected && <Check className="size-4" />}
              </div>
            )}
            trigger={
              <button className="bg-background flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:bg-black/5 transition-colors">
                <List className="size-4 text-muted-foreground" />
                <span className="font-medium text-foreground text-sm leading-5">
                  {sprintType
                    ? sprintType.label
                    : "Sprint Type"}
                </span>
              </button>
            }
          />

          {/* Target Date Picker */}
          <DatePicker
            date={targetDate}
            onSelect={setTargetDate}
            trigger={
              <button className="bg-background flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:bg-black/5 transition-colors">
                <CalendarBlank className="size-4 text-muted-foreground" />
                <span className="font-medium text-foreground text-sm leading-5">
                  {targetDate
                    ? format(targetDate, "dd/MM/yyyy")
                    : "Target"}
                </span>
              </button>
            }
          />

          {/* Workstreams Picker */}
          <GenericPicker
            items={WORKSTREAMS}
            onSelect={setWorkstream}
            selectedId={workstream?.id}
            placeholder="Select workstream..."
            renderItem={(item, isSelected) => (
              <div className="flex items-center gap-2 w-full">
                <span className="flex-1">{item.label}</span>
                {isSelected && <Check className="size-4" />}
              </div>
            )}
            trigger={
              <button className="bg-background flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:bg-black/5 transition-colors">
                <Rows className="size-4 text-muted-foreground" />
                <span className="font-medium text-foreground text-sm leading-5">
                  {workstream
                    ? workstream.label
                    : "Workstreams"}
                </span>
              </button>
            }
          />

          {/* Priority Picker */}
          <GenericPicker
            items={PRIORITIES}
            onSelect={setPriority}
            selectedId={priority?.id}
            placeholder="Set priority..."
            renderItem={(item, isSelected) => (
              <div className="flex items-center gap-2 w-full">
                <span className="flex-1">{item.label}</span>
                {isSelected && <Check className="size-4" />}
              </div>
            )}
            trigger={
              <button className="bg-background flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:bg-black/5 transition-colors">
                <ChartBar className="size-4 text-muted-foreground" />
                <span className="font-medium text-foreground text-sm leading-5">
                  {priority ? priority.label : "Priority"}
                </span>
              </button>
            }
          />

          {/* Tag Picker */}
          <GenericPicker
            items={TAGS}
            onSelect={setSelectedTag}
            selectedId={selectedTag?.id}
            placeholder="Add tag..."
            renderItem={(item, isSelected) => (
              <div className="flex items-center gap-2 w-full">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1">{item.label}</span>
                {isSelected && <Check className="size-4" />}
              </div>
            )}
            trigger={
              <button className="bg-background flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:bg-black/5 transition-colors">
                <Wrapper>
                  <g
                    clipPath="url(#clip0_13_2458)"
                    id="Icon / Tag"
                  >
                    <Tag className="size-4 text-muted-foreground" />
                  </g>
                  <defs>
                    <clipPath id="clip0_13_2458">
                      <rect
                        fill="white"
                        height="16"
                        width="16"
                      />
                    </clipPath>
                  </defs>
                </Wrapper>
                <span className="font-medium text-foreground text-sm leading-5">
                  {selectedTag ? selectedTag.label : "Tag"}
                </span>
              </button>
            }
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto w-full pt-4 shrink-0">
          <div className="flex items-center">
            <button className="flex items-center justify-center size-10 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
              <Paperclip className="size-4 text-muted-foreground" />
            </button>
            <button className="flex items-center justify-center size-10 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
              <Microphone className="size-4 text-muted-foreground" />
            </button>
          </div>

          <button
            onClick={() => void handleCreate()}
            disabled={!title.trim()}
            className="bg-primary hover:bg-primary/90 flex gap-3 h-10 items-center justify-center px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <span className="font-medium text-primary-foreground text-sm leading-5">
              Create Project
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
