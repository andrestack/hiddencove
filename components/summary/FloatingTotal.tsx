import { Button } from "@/components/ui/button"
import { Eye, Home } from "lucide-react"
import { useRouter } from "next/navigation"
interface FloatingTotalProps {
  totalCost: number
  isCalculating: boolean
  onViewDetails: () => void
}

export function FloatingTotal({ totalCost, isCalculating, onViewDetails }: FloatingTotalProps) {
  const router = useRouter()
  const handleGoHome = () => {
    router.push("/questionnaire")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 shadow-lg md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total Cost</p>
          <p className="text-2xl font-bold">
            {isCalculating ? "Calculating..." : `$${totalCost.toFixed(2)}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleGoHome}
            variant="outline"
            size="icon"
            aria-label="Go to questionnaire start"
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button onClick={onViewDetails} className="gap-2">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}
