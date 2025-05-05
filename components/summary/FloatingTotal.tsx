import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface FloatingTotalProps {
  totalCost: number
  isCalculating: boolean
  onViewDetails: () => void
}

export function FloatingTotal({ totalCost, isCalculating, onViewDetails }: FloatingTotalProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 shadow-lg md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total Cost</p>
          <p className="text-2xl font-bold">
            {isCalculating ? "Calculating..." : `$${totalCost.toFixed(2)}`}
          </p>
        </div>
        <Button onClick={onViewDetails} className="gap-2">
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </div>
    </div>
  )
}
