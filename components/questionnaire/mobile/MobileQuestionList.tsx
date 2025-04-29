"use client"

import { MobileQuestion } from "@/lib/utils/questionnaire"
import { MobileQuestionCard } from "./MobileQuestionCard"

interface MobileQuestionListProps {
  questions: MobileQuestion[]
  expandedTooltips: Record<string, boolean>
  onToggleTooltip: (questionId: string) => void
}

export function MobileQuestionList({
  questions,
  expandedTooltips,
  onToggleTooltip,
}: MobileQuestionListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      {questions.map((question) => (
        <MobileQuestionCard
          key={question.id}
          question={question}
          isTooltipExpanded={expandedTooltips[question.id] || false}
          onToggleTooltip={() => onToggleTooltip(question.id)}
        />
      ))}
    </div>
  )
}
