"use client"

import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationFooterProps {
  onPrevious: () => void
  onNext: () => void
  isPreviousDisabled: boolean
  isLastStep: boolean
}

export default function NavigationFooter({
  onPrevious,
  onNext,
  isPreviousDisabled,
  isLastStep,
}: NavigationFooterProps) {
  return (
    <div className="flex justify-between border-t border-[#e6dfd0] bg-white p-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        className="border-[#d9b382] text-[#5c4c3a]"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <Button onClick={onNext} className="bg-[#d9b382] text-white hover:bg-[#c9a372]">
        {isLastStep ? "Finish" : "Continue"}
        {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
      </Button>
    </div>
  )
}
