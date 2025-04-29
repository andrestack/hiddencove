"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Info, Check, X } from "lucide-react"

type Step = {
  id: number
  title: string
  description: string
  isCompleted: boolean
  questions: Question[]
}

type Question = {
  id: number
  text: string
  tooltip: string
}

export default function MobileQuestionnaire() {
  const [steps, setSteps] = useState<Step[]>([
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
          tooltip: "This helps us suggest styles and products that fit into your daily routine and time availability.",
        },
      ],
    },
  ])

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [expandedTooltips, setExpandedTooltips] = useState<Record<string, boolean>>({})

  const currentStep = steps[currentStepIndex]
  const progressPercentage = (currentStepIndex / (steps.length - 1)) * 100

  const toggleTooltip = (questionId: number) => {
    const key = `${currentStepIndex}-${questionId}`
    setExpandedTooltips((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const isTooltipExpanded = (questionId: number) => {
    const key = `${currentStepIndex}-${questionId}`
    return expandedTooltips[key] || false
  }

  const completeCurrentStep = () => {
    const updatedSteps = [...steps]
    updatedSteps[currentStepIndex].isCompleted = true
    setSteps(updatedSteps)

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f5ee] flex flex-col">
      

      {/* Mobile Progress Indicator */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
              ${currentStep.isCompleted ? "bg-green-500 text-white" : "bg-[#d9b382] text-white"}`}
            >
              {currentStep.isCompleted ? <Check size={16} /> : currentStep.id}
            </div>
            <div>
              <h2 className="font-medium text-[#3c3428]">{currentStep.title}</h2>
              <p className="text-sm text-[#6b5d4d]">{currentStep.description}</p>
            </div>
          </div>
          <div className="text-sm text-[#6b5d4d]">
            {currentStepIndex + 1} of {steps.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-[#e6dfd0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#d9b382] transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Question Cards */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        {currentStep.questions.map((question) => (
          <div key={question.id} className="mb-6">
            <div className="bg-white rounded-lg border border-[#e6dfd0] overflow-hidden shadow-sm">
              {/* Question Header */}
              <div className="p-4 flex justify-between items-start">
                <h3 className="text-[#3c3428] font-medium pr-2">{question.text}</h3>
                <button
                  onClick={() => toggleTooltip(question.id)}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f0ebe1] flex items-center justify-center text-[#6b5d4d] hover:bg-[#e6dfd0]"
                  aria-label="Show more information"
                >
                  <Info size={16} />
                </button>
              </div>

              {/* Tooltip */}
              {isTooltipExpanded(question.id) && (
                <div className="bg-[#f0ebe1] p-4 relative border-t border-[#e6dfd0]">
                  <button
                    onClick={() => toggleTooltip(question.id)}
                    className="absolute top-2 right-2 text-[#6b5d4d] hover:text-[#3c3428]"
                    aria-label="Close tooltip"
                  >
                    <X size={16} />
                  </button>
                  <p className="text-sm text-[#5c4c3a] pr-4">{question.tooltip}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="p-4 flex justify-between border-t border-[#e6dfd0] bg-white">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStepIndex === 0}
          className="border-[#d9b382] text-[#5c4c3a]"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <Button onClick={completeCurrentStep} className="bg-[#d9b382] hover:bg-[#c9a372] text-white">
          {currentStepIndex === steps.length - 1 ? "Finish" : "Continue"}
          {currentStepIndex !== steps.length - 1 && <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
