import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { findServiceById } from "@/lib/utils/services"
import { type PricingSummaryFormValues } from "@/lib/schemas/pricingSummarySchema"
import { prices, type SeniorityLevel } from "@/lib/prices"
import { Badge } from "@/components/ui/badge"

interface EstimateDetailsProps {
  formValues: PricingSummaryFormValues
  totalCost: number
  isCalculating: boolean
}

export function EstimateDetails({ formValues, totalCost, isCalculating }: EstimateDetailsProps) {
  const selectedServices = prices.services
    .map((category) => {
      const fieldName = category.category
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) =>
          chr.toUpperCase()
        ) as keyof PricingSummaryFormValues

      if (fieldName === "addOns") return null // Handle add-ons separately

      const selectedItemId = formValues[fieldName] as string | undefined
      if (!selectedItemId) return null

      const item = findServiceById(selectedItemId)
      if (!item) return null

      return {
        category: category.category,
        item,
      }
    })
    .filter(Boolean)

  // Get selected add-ons
  const addOnCategory = prices.services.find(
    (c) =>
      c.category.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()) ===
      "addOns"
  )
  const selectedAddOns =
    addOnCategory?.items.filter((item) => formValues.addOns?.includes(item.id)) || []

  return (
    <Card className="h-[70vh]">
      <CardHeader>
        <CardTitle>Estimate Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stylist Level */}
        <div>
          <h3 className="font-semibold">Selected Stylist Level</h3>
          <p className="text-muted-foreground">{formValues.seniorityLevel}</p>
        </div>

        <Separator />

        {/* Main Services */}
        <div className="space-y-4">
          <h3 className="font-semibold">Selected Services</h3>
          {selectedServices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No services selected</p>
          ) : (
            <div className="space-y-2">
              {selectedServices.map(
                (service) =>
                  service && (
                    <div key={service.item.id} className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{service.item.name}</p>
                        <p className="text-sm text-muted-foreground">{service.category}</p>
                      </div>
                      {formValues.seniorityLevel && (
                        <Badge variant="secondary">
                          {service.item.price.type === "hourly" && formValues.hourlyDuration
                            ? `$${(
                                (service.item.price.rates?.[
                                  formValues.seniorityLevel as SeniorityLevel
                                ] || 0) * formValues.hourlyDuration
                              ).toFixed(2)}`
                            : service.item.price.type === "from"
                              ? `$${
                                  service.item.price.levels?.[
                                    formValues.seniorityLevel as SeniorityLevel
                                  ] ||
                                  service.item.price.base ||
                                  0
                                }`
                              : `$${service.item.price.base || 0}`}
                        </Badge>
                      )}
                    </div>
                  )
              )}
            </div>
          )}
        </div>

        {/* Add-ons */}
        {selectedAddOns.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold">Selected Add-ons</h3>
              <div className="space-y-2">
                {selectedAddOns.map((addon) => (
                  <div key={addon.id} className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{addon.name}</p>
                      {addon.notes && (
                        <p className="text-sm text-muted-foreground">{addon.notes}</p>
                      )}
                    </div>
                    {formValues.seniorityLevel && (
                      <Badge variant="secondary">
                        $
                        {addon.price.base ||
                          addon.price.levels?.[formValues.seniorityLevel as SeniorityLevel] ||
                          0}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Downpayment */}
        {formValues.downpayment > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold">Downpayment</h3>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Amount Paid</p>
                <Badge variant="secondary" className="text-red-500">
                  -${formValues.downpayment.toFixed(2)}
                </Badge>
              </div>
            </div>
          </>
        )}

        {/* Total */}
        <Separator />
        <div className="space-y-2">
          <h3 className="font-semibold">Total Cost</h3>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {isCalculating ? "Calculating..." : "Final Amount"}
            </p>
            <Badge className="text-lg">${totalCost.toFixed(2)}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
