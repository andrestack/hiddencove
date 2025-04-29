"use client"

import React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Circle } from "lucide-react"

interface CategoryProgressProps {
  categories: { id: string; name: string }[]
  currentCategoryIndex: number
  completedCategories: string[]
}

const CategoryProgress: React.FC<CategoryProgressProps> = ({
  categories,
  currentCategoryIndex,
  completedCategories,
}) => {
  return (
    <div className="mx-auto w-full max-w-4xl py-4">
      <div className="flex w-full items-center justify-between">
        {categories.map((category, index) => {
          const isCompleted = completedCategories.includes(category.id)
          const isCurrent = index === currentCategoryIndex

          return (
            <React.Fragment key={category.id}>
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative">
                  {isCompleted ? (
                    <CheckCircle2 className="h-8 w-8 text-[#383838]" />
                  ) : (
                    <div className={`${isCurrent ? "text-[#383838]" : "text-[#E6D4CB]"}`}>
                      <Circle className="h-8 w-8" />
                      {isCurrent && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="h-2 w-2 rounded-full bg-[#383838]" />
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
                <span
                  className={`mt-1 text-center text-xs ${
                    isCurrent
                      ? "font-medium text-[#383838]"
                      : isCompleted
                        ? "text-[#383838]"
                        : "text-[#E6D4CB]"
                  }`}
                >
                  {category.name}
                </span>
              </motion.div>

              {index < categories.length - 1 && (
                <div className="relative mx-1 h-px w-full overflow-hidden bg-[#E6D4CB]">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-[#383838]"
                    initial={{ width: "0%" }}
                    animate={{
                      width: isCompleted ? "100%" : isCurrent ? "50%" : "0%",
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryProgress
