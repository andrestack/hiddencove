"use client"

import { Info, X } from "lucide-react"
import { Question } from "@/context/questionnaire-context"

interface QuestionCardProps {
  question: Question
  isExpanded: boolean
  onToggleTooltip: () => void
}

export default function QuestionCard({ question, isExpanded, onToggleTooltip }: QuestionCardProps) {
  return (
    <div className="mb-6">
      <div className="overflow-hidden rounded-lg border border-[#e6dfd0] bg-white shadow-sm">
        {/* Question Header */}
        <div className="flex items-start justify-between p-4">
          <h3 className="pr-2 font-medium text-[#3c3428]">{question.text}</h3>
          <button
            onClick={onToggleTooltip}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#f0ebe1] text-[#6b5d4d] hover:bg-[#e6dfd0]"
            aria-label="Show more information"
          >
            <Info size={16} />
          </button>
        </div>

        {/* Tooltip */}
        {isExpanded && (
          <div className="relative border-t border-[#e6dfd0] bg-[#f0ebe1] p-4">
            <button
              onClick={onToggleTooltip}
              className="absolute right-2 top-2 text-[#6b5d4d] hover:text-[#3c3428]"
              aria-label="Close tooltip"
            >
              <X size={16} />
            </button>
            <p className="pr-4 text-sm text-[#5c4c3a]">{question.tooltip}</p>
          </div>
        )}
      </div>
    </div>
  )
}
