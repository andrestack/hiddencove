"use client"

interface MobileQuestionnaireHeaderProps {
  title?: string
}

export function MobileQuestionnaireHeader({
  title = "Salon Questionnaire",
}: MobileQuestionnaireHeaderProps) {
  return (
    <div className="border-b border-[#e6dfd0] bg-white p-4">
      <div className="flex items-center">
        <div className="mr-3 h-8 w-8 rounded-full bg-[#d9b382]" />
        <h1 className="text-lg font-medium text-[#5c4c3a]">{title}</h1>
      </div>
    </div>
  )
}
