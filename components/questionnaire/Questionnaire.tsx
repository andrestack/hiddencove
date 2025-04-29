"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import QuestionCard from "@/components/questionnaire/QuestionCard"
import ProgressBar from "@/components/questionnaire/ProgressBar"
import { knowledgeBase } from "@/utils/data"

export default function Questionnaire() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [completedCategories, setCompletedCategories] = useState<string[]>([])

  // Check if we have categories data
  if (!knowledgeBase?.categories || knowledgeBase.categories.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-[#383838]/70">Loading questionnaire...</p>
      </div>
    )
  }

  const categories = knowledgeBase.categories
  const currentCategory = categories[currentCategoryIndex]
  const currentQuestion = currentCategory?.questions[currentQuestionIndex]
  const totalQuestions = currentCategory?.questions.length || 0

  const handleAnswerChange = (value: string) => {
    if (!currentQuestion) return

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const goToNextQuestion = () => {
    if (!currentQuestion) return

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Complete current category
      setCompletedCategories((prev) =>
        prev.includes(currentCategory.id) ? prev : [...prev, currentCategory.id]
      )

      // Go to next category or finish
      if (currentCategoryIndex < categories.length - 1) {
        setCurrentCategoryIndex(currentCategoryIndex + 1)
        setCurrentQuestionIndex(0)
      } else {
        // Handle completion - you can add your own logic here
        console.log("Questionnaire completed!", answers)
      }
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1)
      setCurrentQuestionIndex(categories[currentCategoryIndex - 1].questions.length - 1)
    }
  }

  if (!currentCategory || !currentQuestion) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-[#383838]/70">No questions available.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <ProgressBar
        categories={categories}
        currentCategoryIndex={currentCategoryIndex}
        completedCategories={completedCategories}
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-center">
        <h2 className="font-dm-serif text-2xl text-[#383838]">{currentCategory.name}</h2>
        <p className="text-[#383838]/70">{currentCategory.description}</p>
      </motion.div>

      <div className="relative min-h-[300px] space-y-6">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion.question}
            guidance_text={currentQuestion.guidance_text}
            context={currentQuestion.context}
            value={answers[currentQuestion.id] || ""}
            onChange={handleAnswerChange}
            isActive={true}
          />
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}
            className="flex items-center space-x-2 border-[#E6D4CB] hover:bg-[#E6D4CB]/30"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-[#383838]/70">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>

          <Button
            onClick={goToNextQuestion}
            className="bg-[#383838] text-white hover:bg-[#383838]/90"
          >
            {currentCategoryIndex === categories.length - 1 &&
            currentQuestionIndex === totalQuestions - 1 ? (
              <>
                Complete <CheckCircle className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
