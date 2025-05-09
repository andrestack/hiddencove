"use client"

import { Check } from "lucide-react"
import { Step } from "@/contexts/questionnaire-context"

interface ProgressIndicatorProps {
  currentStep: Step
  currentStepIndex: number
  totalSteps: number
  progressPercentage: number
}

export default function ProgressIndicator({
  currentStep,
  currentStepIndex,
  totalSteps,
  progressPercentage,
}: ProgressIndicatorProps) {
  return (
    <div className="px-4 py-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${currentStep.isCompleted ? "bg-green-500 text-white" : "bg-[#d9b382] text-white"}`}
          >
            {currentStep.isCompleted ? <Check size={16} /> : currentStep.id}
          </div>
          <div>
            <h2 className="font-medium text-[#3c3428]">{currentStep.title}</h2>
            <p className="text-sm text-[#6b5d4d]">{currentStep.description}</p>
          </div>
        </div>
        <div className="text-sm text-[#6b5d4d]">
          {currentStepIndex + 1} / {totalSteps}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#e6dfd0]">
        <div
          className="h-full bg-[#d9b382] transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  )
}
