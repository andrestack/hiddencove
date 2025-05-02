import { Category, knowledgeBase } from "@/lib/data"

export interface MobileQuestion {
  id: string
  text: string
  tooltip: string
  isValid?: boolean
}

export interface MobileStep {
  id: string
  title: string
  description: string
  isCompleted: boolean
  questions: MobileQuestion[]
}

export type QuestionnaireState = {
  expandedTooltips: Record<string, boolean>
}

export type QuestionnaireActions = {
  toggleTooltip: (questionId: string) => void
  completeStep: (stepId: string) => void
  goToStep: (index: number) => void
}

export function transformKnowledgeBaseToMobileSteps(): MobileStep[] {
  return knowledgeBase.categories.map((category: Category) => ({
    id: category.id,
    title: category.name,
    description: category.description,
    isCompleted: false,
    questions: category.questions.map((question) => ({
      id: question.id,
      text: question.question,
      tooltip: Array.isArray(question.guidance_text)
        ? question.guidance_text.join(" ")
        : question.guidance_text,
    })),
  }))
}

export function validateQuestionAnswer(answer: string | undefined): boolean {
  return Boolean(answer && answer.trim().length > 0)
}

export function isStepValid(step: MobileStep): boolean {
  return step.questions.every((q) => validateQuestionAnswer(q.text))
}
