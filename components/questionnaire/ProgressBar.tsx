"use client"

import React from "react"
import { Check } from "lucide-react"

interface CategoryProgressProps {
  categories: { id: string; name: string }[]
  currentCategoryIndex: number
  completedCategories: string[]
}

const ProgressBar: React.FC<CategoryProgressProps> = ({
  categories,
  currentCategoryIndex,
  completedCategories,
}) => {
  // Calculate progress percentage based on current category
  const progressPercentage = ((currentCategoryIndex + 1) / categories.length) * 100

  // Get current category
  const currentCategory = categories[currentCategoryIndex]
  const isCurrentCategoryCompleted = completedCategories.includes(currentCategory?.id || "")

  return (
    <div className="bg-[#f8f5ee] px-4 py-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${
              isCurrentCategoryCompleted ? "bg-green-500 text-white" : "bg-[#d9b382] text-white"
            }`}
          >
            {isCurrentCategoryCompleted ? <Check size={16} /> : currentCategoryIndex + 1}
          </div>
          <div>
            <h2 className="font-medium text-[#3c3428]">{currentCategory?.name}</h2>
            <p className="text-sm text-[#6b5d4d]">Step {currentCategoryIndex + 1}</p>
          </div>
        </div>
        <div className="text-sm text-[#6b5d4d]">
          {currentCategoryIndex + 1} of {categories.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#e6dfd0]">
        <div
          className="h-full bg-[#d9b382] transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
