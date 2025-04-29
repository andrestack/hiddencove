import { useState, useCallback, useMemo } from "react"
import {
  MobileStep,
  QuestionnaireState,
  QuestionnaireActions,
  transformKnowledgeBaseToMobileSteps,
} from "@/lib/utils/questionnaire"

export function useMobileQuestionnaire() {
  const [steps, setSteps] = useState<MobileStep[]>(transformKnowledgeBaseToMobileSteps())
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [state, setState] = useState<QuestionnaireState>({
    expandedTooltips: {},
  })

  const currentStep = useMemo(() => steps[currentStepIndex], [steps, currentStepIndex])
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const actions: QuestionnaireActions = {
    toggleTooltip: useCallback((questionId: string) => {
      setState((prev) => ({
        ...prev,
        expandedTooltips: {
          ...prev.expandedTooltips,
          [questionId]: !prev.expandedTooltips[questionId],
        },
      }))
    }, []),

    completeStep: useCallback(
      (stepId: string) => {
        setSteps((prevSteps) =>
          prevSteps.map((s) => (s.id === stepId ? { ...s, isCompleted: true } : s))
        )

        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1)
        }
      },
      [currentStepIndex, steps.length]
    ),

    goToStep: useCallback(
      (index: number) => {
        if (index >= 0 && index < steps.length) {
          setCurrentStepIndex(index)
        }
      },
      [steps.length]
    ),
  }

  return {
    steps,
    currentStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    state,
    actions,
  }
}
