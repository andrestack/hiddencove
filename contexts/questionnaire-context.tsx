"use client"

import { ReactNode, createContext, useContext, useReducer } from "react"

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

const initialSteps: Step[] = [
  {
    id: 1,
    title: "Hair Type",
    description: "About your hair",
    isCompleted: false,
    questions: [
      {
        id: 1,
        text: "What is your natural hair texture?",
        tooltip:
          "Your natural hair texture refers to the pattern your hair forms without any styling. This helps us determine the best treatments and products for your hair.",
      },
      {
        id: 2,
        text: "How would you describe your hair density?",
        tooltip:
          "Hair density refers to how many hair strands you have per square inch on your scalp. This helps us understand how to approach your styling and treatments.",
      },
      {
        id: 3,
        text: "Do you have any scalp conditions?",
        tooltip:
          "Scalp conditions like dryness, oiliness, or sensitivity can affect which products and treatments we recommend for your hair care routine.",
      },
    ],
  },
  {
    id: 2,
    title: "Hair History",
    description: "Previous treatments",
    isCompleted: false,
    questions: [
      {
        id: 1,
        text: "Have you colored your hair in the past 6 months?",
        tooltip:
          "Recent color treatments can affect how your hair responds to new products and services. This information helps us avoid adverse reactions.",
      },
      {
        id: 2,
        text: "Have you had any chemical treatments recently?",
        tooltip:
          "Chemical treatments like perms, relaxers, or keratin treatments can impact how we approach your hair care. This helps us customize your service.",
      },
      {
        id: 3,
        text: "How often do you use heat styling tools?",
        tooltip:
          "Frequent use of heat styling tools can affect hair health and porosity. This helps us recommend appropriate treatments and heat protectants.",
      },
    ],
  },
  {
    id: 3,
    title: "Preferences",
    description: "Style preferences",
    isCompleted: false,
    questions: [
      {
        id: 1,
        text: "What is your typical styling routine?",
        tooltip:
          "Understanding your daily styling habits helps us recommend services and products that will work with your lifestyle and time constraints.",
      },
      {
        id: 2,
        text: "What hair concerns would you like to address?",
        tooltip:
          "Whether it's frizz, volume, damage repair, or color preservation, knowing your concerns helps us tailor our recommendations to your specific needs.",
      },
      {
        id: 3,
        text: "How much time do you typically spend on your hair each day?",
        tooltip:
          "This helps us suggest styles and products that fit into your daily routine and time availability.",
      },
    ],
  },
]

const initialState: QuestionnaireState = {
  steps: initialSteps,
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
        steps: initialState.steps.map((step) => ({
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
  const progressPercentage = (state.currentStepIndex / (state.steps.length - 1)) * 100

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
