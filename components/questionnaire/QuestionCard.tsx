"use client"

import { Info, X, Loader2 } from "lucide-react"
import { Question } from "@/contexts/questionnaire-context"
import { getInsight } from "@/lib/api/getInsights"
import { useState, useEffect } from "react"

interface QuestionCardProps {
  question: Question
  isExpanded: boolean
  onToggleTooltip: () => void
}

export default function QuestionCard({ question, isExpanded, onToggleTooltip }: QuestionCardProps) {
  const [insight, setInsight] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchInsight() {
      if (isExpanded && !insight) {
        setIsLoading(true)
        try {
          const generatedInsight = await getInsight(
            question.text,
            "Provide a helpful insight about this question"
          )
          setInsight(generatedInsight)
        } catch (error) {
          console.error("Failed to fetch insight:", error)
          setInsight("Unable to generate insight at this time.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchInsight()
  }, [isExpanded, question.text, insight])

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
            <div className="pr-4 text-sm text-[#5c4c3a]">
              {isLoading ? (
                <p className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating insight...</span>
                </p>
              ) : (
                <p className="pr-4 text-sm text-[#5c4c3a]">{insight}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
