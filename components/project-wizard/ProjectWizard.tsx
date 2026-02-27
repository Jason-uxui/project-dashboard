"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Stepper } from "./Stepper";
import { ProjectData, ProjectMode } from "./types";
import { StepMode } from "./steps/StepMode";
import { StepIntent } from "./steps/StepIntent";
import { StepOutcome } from "./steps/StepOutcome";
import { StepOwnership } from "./steps/StepOwnership";
import { StepStructure } from "./steps/StepStructure";
import { StepReview } from "./steps/StepReview";
import { StepQuickCreate } from "./steps/StepQuickCreate";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import type { CreateProjectInput } from "@/hooks/use-projects-crud";

const QUICK_CREATE_STEP = 100;

interface ProjectWizardProps {
  onClose: () => void;
  onCreate?: (input: CreateProjectInput) => Promise<void> | void;
}

export function ProjectWizard({ onClose, onCreate }: ProjectWizardProps) {
  const [step, setStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [isQuickCreateExpanded, setIsQuickCreateExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<ProjectData>({
    mode: undefined,
    successType: 'undefined',
    deliverables: [],
    metrics: [],
    description: '',
    deadlineType: 'none',
    contributorIds: [],
    stakeholderIds: [],
    addStarterTasks: false,
  });

  // Step 0 is Mode Selection. It's separate from the numbered stepper.
  // The numbered stepper starts at Step 1 (Intent).
  // Internally:
  // 0: Mode
  // 1: Intent
  // 2: Outcome
  // 3: Ownership
  // 4: Structure
  // 5: Review

  const updateData = (updates: Partial<ProjectData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (step === 0 && data.mode === 'quick') {
      setStep(QUICK_CREATE_STEP); // Magic number for Quick Create View
      return;
    }
    
    setStep(prev => {
        const next = prev + 1;
        setMaxStepReached(m => Math.max(m, next));
        return next;
    });
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const jumpToStep = (s: number) => {
      // Adjust because stepper index 0 maps to internal step 1
      setStep(s + 1);
  }

  const handleEditStepFromReview = (targetStep: number) => {
    // targetStep uses the internal step index (1-4)
    setStep(targetStep);
  };

  const isNextDisabled = () => {
      if (step === 3 && !data.ownerId) return true; // Step 3: Ownership
      return false;
  }

  const handleClose = () => {
    onClose();
  };

  const ownerNameMap: Record<string, string> = {
    "jason-d": "Jason D",
    "alex-morgan": "Alex Morgan",
    "sarah-chen": "Sarah Chen",
    "mike-ross": "Mike Ross",
    "harrold": "Harrold",
    "james": "James Boarnd",
    "mitch": "Mitch Sato",
  };

  const guidedProjectName = (() => {
    const intentToName: Record<string, string> = {
      delivery: "Delivery project",
      experiment: "Experiment project",
      internal: "Internal project",
    };
    return intentToName[data.intent ?? ""] ?? "New project";
  })();

  const guidedProjectInput: CreateProjectInput = {
    name: guidedProjectName,
    status: "planned",
    priority: "medium",
    endDate: data.deadlineDate ? new Date(data.deadlineDate) : undefined,
    tags: data.intent ? [data.intent] : [],
    members: data.ownerId ? [ownerNameMap[data.ownerId] ?? "Owner"] : [],
  };

  const submitProject = async (input: CreateProjectInput) => {
    if (!onCreate || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onCreate(input);
      onClose();
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : "Failed to create project.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define steps for the stepper (excluding Mode selection)
  const steps = [
    "Project intent",
    "Outcome & success",
    "Ownership",
    "Work structure",
    "Review & create"
  ];

  const stepTitles: Record<number, string> = {
    1: "What is this project mainly about?",
    2: "How do you define success?",
    3: "Who is responsible for this project?",
    4: "How should this project be structured?",
    5: "Review project setup",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
            opacity: 1, 
            scale: 1,
            height: step === QUICK_CREATE_STEP 
                ? (isQuickCreateExpanded ? "85vh" : "auto") 
                : "auto"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
            "flex w-full max-w-[900px] overflow-hidden rounded-[24px] bg-background shadow-2xl"
        )}
      >
        {step === 0 ? (
             <StepMode 
                selected={data.mode} 
                onSelect={(m) => updateData({ mode: m })} 
                onContinue={nextStep}
                onCancel={handleClose}
                onClose={handleClose}
             />
        ) : step === QUICK_CREATE_STEP ? (
            <StepQuickCreate 
                onClose={handleClose} 
                onCreate={submitProject}
                onExpandChange={setIsQuickCreateExpanded}
            />
        ) : (
            <>
                {/* Left Sidebar (Stepper) */}
                <div className="hidden w-64 border-r border-border bg-background px-6 py-7 md:flex md:flex-col md:gap-7">
                  <div>
                    <p className="text-sm font-semibold text-foreground">New Project</p>
                  </div>
                  <Stepper 
                    currentStep={step - 1} 
                    steps={steps} 
                    onStepClick={jumpToStep}
                    maxStepReached={maxStepReached - 1}
                  />
                </div>

                {/* Main Content */}
                <div className="flex flex-1 flex-col">
                    {/* Header: Title + Close button */}
                    <div className="flex items-start justify-between px-8 pt-6 pb-4">
                        <div className="pr-6">
                          {stepTitles[step] && (
                            <h2 className="text-lg font-semibold tracking-tight">
                              {stepTitles[step]}
                            </h2>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={handleClose}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto px-8 pb-8 pt-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                {step === 1 && (
                                    <StepIntent selected={data.intent} onSelect={(i) => updateData({ intent: i })} />
                                )}
                                {step === 2 && (
                                    <StepOutcome data={data} updateData={updateData} />
                                )}
                                {step === 3 && (
                                    <StepOwnership data={data} updateData={updateData} />
                                )}
                                {step === 4 && (
                                    <StepStructure data={data} updateData={updateData} />
                                )}
                                {step === 5 && (
                                    <StepReview data={data} onEditStep={handleEditStepFromReview} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between bg-background p-6">
                        <div>
                            <Button variant="outline" onClick={prevStep}>
                                <CaretLeft className=" h-4 w-4" />
                                Back
                            </Button>
                        </div>

                        <div className="flex gap-3">
                            {step === 5 ? (
                                <>
                                    <Button variant="outline">Save as template</Button>
                                    <Button
                                      onClick={() => {
                                        void submitProject(guidedProjectInput);
                                      }}
                                      disabled={isSubmitting}
                                    >
                                      Create project
                                    </Button>
                                </>
                            ) : (
                                <Button 
                                    onClick={nextStep} 
                                    disabled={isNextDisabled()}
                                >
                                    Next
                                    <CaretRight className=" h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )}
      </motion.div>
    </div>
  );
}
