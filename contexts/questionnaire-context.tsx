"use client"

import { ReactNode, createContext, useContext, useReducer } from "react"
import { knowledgeBase } from "@/lib/data"

export type Question = {
  id: number
  text: string
  tooltip: string
}

export type Step = {
  id: number
  title: string
  description: string
  isCompleted: boolean
  questions: Question[]
}

type TooltipState = Record<string, boolean>

type QuestionnaireState = {
  steps: Step[]
  currentStepIndex: number
  expandedTooltips: TooltipState
  isCompleted: boolean
}

type QuestionnaireAction =
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "COMPLETE_STEP" }
  | { type: "TOGGLE_TOOLTIP"; stepIndex: number; questionId: number }
  | { type: "RESET_QUESTIONNAIRE" }

const transformedSteps: Step[] = knowledgeBase.categories.map((category, categoryIndex) => ({
  id: categoryIndex + 1,
  title: category.name,
  description: category.description,
  isCompleted: false,
  questions: category.questions.map((question, questionIndex) => ({
    id: questionIndex + 1,
    text: question.question,
    tooltip: Array.isArray(question.guidance_text)
      ? question.guidance_text.join("\n")
      : question.guidance_text,
  })),
}))

const initialState: QuestionnaireState = {
  steps: transformedSteps,
  currentStepIndex: 0,
  expandedTooltips: {},
  isCompleted: false,
}

function questionnaireReducer(
  state: QuestionnaireState,
  action: QuestionnaireAction
): QuestionnaireState {
  switch (action.type) {
    case "NEXT_STEP":
      return {
        ...state,
        currentStepIndex: Math.min(state.currentStepIndex + 1, state.steps.length - 1),
      }
    case "PREVIOUS_STEP":
      return {
        ...state,
        currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
      }
    case "COMPLETE_STEP": {
      const updatedSteps = [...state.steps]
      updatedSteps[state.currentStepIndex].isCompleted = true

      const isLastStep = state.currentStepIndex === state.steps.length - 1

      return {
        ...state,
        steps: updatedSteps,
        currentStepIndex:
          state.currentStepIndex < state.steps.length - 1
            ? state.currentStepIndex + 1
            : state.currentStepIndex,
        isCompleted: isLastStep && updatedSteps.every((step) => step.isCompleted),
      }
    }
    case "TOGGLE_TOOLTIP": {
      const key = `${action.stepIndex}-${action.questionId}`
      return {
        ...state,
        expandedTooltips: {
          ...state.expandedTooltips,
          [key]: !state.expandedTooltips[key],
        },
      }
    }
    case "RESET_QUESTIONNAIRE":
      return {
        ...initialState,
        steps: transformedSteps.map((step) => ({
          ...step,
          isCompleted: false,
        })),
      }
    default:
      return state
  }
}

type QuestionnaireContextType = {
  state: QuestionnaireState
  dispatch: React.Dispatch<QuestionnaireAction>
  currentStep: Step
  progressPercentage: number
  isTooltipExpanded: (questionId: number) => boolean
  toggleTooltip: (questionId: number) => void
  goToPreviousStep: () => void
  completeCurrentStep: () => void
  isQuestionnaireCompleted: boolean
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined)

export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(questionnaireReducer, initialState)

  const currentStep = state.steps[state.currentStepIndex]
  const progressPercentage =
    state.steps.length > 1
      ? (state.currentStepIndex / (state.steps.length - 1)) * 100
      : state.currentStepIndex === 0
        ? 0
        : 100

  const isTooltipExpanded = (questionId: number) => {
    const key = `${state.currentStepIndex}-${questionId}`
    return state.expandedTooltips[key] || false
  }

  const toggleTooltip = (questionId: number) => {
    dispatch({
      type: "TOGGLE_TOOLTIP",
      stepIndex: state.currentStepIndex,
      questionId,
    })
  }

  const goToPreviousStep = () => {
    dispatch({ type: "PREVIOUS_STEP" })
  }

  const completeCurrentStep = () => {
    dispatch({ type: "COMPLETE_STEP" })
  }

  return (
    <QuestionnaireContext.Provider
      value={{
        state,
        dispatch,
        currentStep,
        progressPercentage,
        isTooltipExpanded,
        toggleTooltip,
        goToPreviousStep,
        completeCurrentStep,
        isQuestionnaireCompleted: state.isCompleted,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  )
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext)
  if (context === undefined) {
    throw new Error("useQuestionnaire must be used within a QuestionnaireProvider")
  }
  return context
}
