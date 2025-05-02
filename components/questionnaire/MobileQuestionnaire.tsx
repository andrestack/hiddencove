"use client"

import { useEffect, useState } from "react"
import { useQuestionnaire, QuestionnaireProvider } from "@/contexts/questionnaire-context"
import QuestionCard from "@/components/questionnaire/QuestionCard"
import ProgressIndicator from "@/components/questionnaire/ProgressIndicator"
import NavigationFooter from "@/components/questionnaire/NavigationFooter"
import dynamic from "next/dynamic"

// Import react-confetti dynamically to avoid SSR issues
const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false })

function QuestionnaireContent() {
  const {
    state,
    currentStep,
    progressPercentage,
    isTooltipExpanded,
    toggleTooltip,
    goToPreviousStep,
    completeCurrentStep,
    isQuestionnaireCompleted,
  } = useQuestionnaire()

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  const [showConfetti, setShowConfetti] = useState(false)

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Show confetti when questionnaire is completed
  useEffect(() => {
    if (isQuestionnaireCompleted) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isQuestionnaireCompleted])

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f5ee]">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          colors={["#d9b382", "#e6dfd0", "#5c4c3a", "#3c3428", "#f0ebe1"]}
        />
      )}

      <ProgressIndicator
        currentStep={currentStep}
        currentStepIndex={state.currentStepIndex}
        totalSteps={state.steps.length}
        progressPercentage={progressPercentage}
      />

      {/* Question Cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {currentStep.questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            isExpanded={isTooltipExpanded(question.id)}
            onToggleTooltip={() => toggleTooltip(question.id)}
          />
        ))}
      </div>

      <NavigationFooter
        onPrevious={goToPreviousStep}
        onNext={completeCurrentStep}
        isPreviousDisabled={state.currentStepIndex === 0}
        isLastStep={state.currentStepIndex === state.steps.length - 1}
      />

      {isQuestionnaireCompleted && (
        <div className="fixed bottom-24 left-0 right-0 mx-auto w-11/12 max-w-md rounded-lg bg-green-50 p-4 text-center shadow-lg">
          <h3 className="mb-2 text-lg font-medium text-green-800">Questionnaire Completed!</h3>
          <p className="text-green-700">
            Thank you for completing the questionnaire. Your stylist will review your answers.
          </p>
        </div>
      )}
    </div>
  )
}

export default function MobileQuestionnaire() {
  return (
    <QuestionnaireProvider>
      <QuestionnaireContent />
    </QuestionnaireProvider>
  )
}
