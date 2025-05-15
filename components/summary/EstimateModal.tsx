import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EstimateDetails } from "./EstimateDetails"
import { type PricingSummaryFormValues } from "@/lib/schemas/pricingSummarySchema"

interface EstimateModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  formValues: PricingSummaryFormValues
  totalCost: number
  isCalculating: boolean
  onConfirm: () => void
}

export function EstimateModal({
  isOpen,
  onOpenChange,
  formValues,
  totalCost,
  isCalculating,
  onConfirm,
}: EstimateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[100vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <EstimateDetails
            formValues={formValues}
            totalCost={totalCost}
            isCalculating={isCalculating}
          />
          <Button onClick={onConfirm} className="w-full text-[#383838] bg-[#E6D4CB]" disabled={isCalculating}>
            Confirm Estimate & Proceed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
