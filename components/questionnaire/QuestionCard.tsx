"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
//import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface QuestionCardProps {
  question: string
  guidance_text?: string | string[]
  context?: string
  value: string
  onChange: (value: string) => void
  isActive: boolean
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  guidance_text,
  context,
  //   value,
  //   onChange,
  isActive,
}) => {
  const [showInsight, setShowInsight] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0.5, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-xl border border-[#E6D4CB] bg-white p-6 shadow-sm ${
        isActive ? "ring-2 ring-[#383838]/50" : ""
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Label className="text-lg font-medium text-[#383838]">{question}</Label>
          {(guidance_text || context) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInsight(!showInsight)}
              className="text-[#383838]/70 hover:text-[#383838]"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-[#E6D4CB] bg-white focus:border-[#383838]"
          rows={4}
        /> */}

        <AnimatePresence>
          {showInsight && (guidance_text || context) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="relative mt-4 rounded-lg bg-[#E6D4CB]/20 p-4"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInsight(false)}
                className="absolute right-2 top-2 text-[#383838]/70 hover:text-[#383838]"
              >
                <X className="h-4 w-4" />
              </Button>
              {guidance_text && (
                <>
                  <h4 className="mb-1 text-sm font-medium text-[#383838]">Guidance:</h4>
                  {Array.isArray(guidance_text) ? (
                    <ul className="ml-4 list-disc space-y-1">
                      {guidance_text.map((text, index) => (
                        <li key={index} className="text-sm text-[#383838]/80">
                          {text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[#383838]/80">{guidance_text}</p>
                  )}
                </>
              )}
              {context && (
                <>
                  <h4 className="mb-1 mt-2 text-sm font-medium text-[#383838]">Context:</h4>
                  <p className="text-sm text-[#383838]/80">{context}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default QuestionCard
