import { PricingSummaryForm } from "@/components/summary/PricingSummaryForm"

export default function SummaryPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col bg-[#f8f5ee] px-4 py-8">
      <div className="text-center">
        <h1 className="font-dm-serif text-3xl text-[#383838] md:text-4xl">Hidden Cove</h1>
        <h2 className="font-dm-serif text-lg text-[#D7A5A9] md:text-xl">Customer Questionnaire</h2>
      </div>
      <PricingSummaryForm />
    </main>
  )
}
