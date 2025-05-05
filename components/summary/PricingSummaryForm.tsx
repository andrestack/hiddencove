"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { prices, type ServiceItem, type Price, type SeniorityLevel } from "@/lib/prices"
import {
  pricingSummarySchema,
  type PricingSummaryFormValues,
} from "@/lib/schemas/pricingSummarySchema"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils/cn"
import { findServiceById, getFieldNameForCategory } from "@/lib/utils/services"
import { EstimateDetails } from "./EstimateDetails"
import { FloatingTotal } from "./FloatingTotal"
import { EstimateModal } from "./EstimateModal"
import { useMediaQuery } from "@/hooks/use-media-query"

// Add this type near the top of the file, after imports
type FieldName = keyof PricingSummaryFormValues

// --- Helper Functions ---

const getPriceString = (
  price: Price,
  level: PricingSummaryFormValues["seniorityLevel"] | null,
  duration?: number
): string => {
  if (!level) return "Select level"

  switch (price.type) {
    case "fixed":
      return `$${price.base?.toFixed(2) ?? "N/A"}`
    case "hourly":
      const rate = price.rates?.[level as SeniorityLevel]
      if (!rate) return "N/A for level"
      if (duration && duration > 0) {
        return `$${(rate * duration).toFixed(2)} (${rate}/hr)`
      }
      return `$${rate.toFixed(2)}/hr`
    case "from":
      const levelPrice = price.levels?.[level as SeniorityLevel]
      if (levelPrice) return `From $${levelPrice.toFixed(2)}`
      if (price.base) return `From $${price.base.toFixed(2)}`
      return "N/A"
    default:
      return "N/A"
  }
}

const calculateItemCost = (
  item: ServiceItem,
  level: PricingSummaryFormValues["seniorityLevel"],
  duration?: number
): number => {
  switch (item.price.type) {
    case "fixed":
      return item.price.base || 0
    case "hourly":
      const rate = item.price.rates?.[level as SeniorityLevel]
      return rate && duration ? rate * duration : 0
    case "from":
      return item.price.levels?.[level as SeniorityLevel] || item.price.base || 0
    default:
      return 0
  }
}

// --- Component ---

export function PricingSummaryForm() {
  const [totalCost, setTotalCost] = useState<number>(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

  const form = useForm<PricingSummaryFormValues>({
    resolver: zodResolver(pricingSummarySchema),
    defaultValues: {
      downpayment: 0,
      addOns: [],
      hourlyDuration: 1,
      transformationPackage: undefined,
      foilPackages: undefined,
      globalGlossHairColour: undefined,
      hairCutting: undefined,
      babyStylistServices: undefined,
    },
    mode: "onChange",
  })

  const { watch, control, handleSubmit, formState } = form
  const watchedValues = watch()
  const selectedLevel = watch("seniorityLevel")
  const hourlyDuration = watch("hourlyDuration")

  // Determine if any selected main service requires the hourly duration input
  const hasHourlyService = prices.services.some((category) => {
    const fieldName = getFieldNameForCategory(category.category) as FieldName
    if (fieldName === "addOns") return false
    const selectedItemId = watchedValues[fieldName] as string | undefined
    if (!selectedItemId) return false
    const item = findServiceById(selectedItemId)
    return item?.price.type === "hourly"
  })

  // --- Calculation Effect ---
  useEffect(() => {
    const subscription = watch((currentValues) => {
      if (formState.isValid) {
        setIsCalculating(true)
        let currentTotal = 0
        const data = currentValues as PricingSummaryFormValues

        // Calculate Main Services
        prices.services.forEach((category) => {
          const fieldName = getFieldNameForCategory(category.category) as FieldName
          if (fieldName === "addOns") return

          const selectedItemId = data[fieldName] as string | undefined
          if (selectedItemId && data.seniorityLevel) {
            const item = findServiceById(selectedItemId)
            if (item) {
              currentTotal += calculateItemCost(item, data.seniorityLevel, data.hourlyDuration)
            }
          }
        })

        // Calculate Add-Ons
        const addOnCategory = prices.services.find(
          (c) => getFieldNameForCategory(c.category) === "addOns"
        )
        if (addOnCategory && data.addOns && data.seniorityLevel) {
          data.addOns.forEach((addOnId) => {
            const addOnItem = addOnCategory.items.find((i) => i.id === addOnId)
            if (addOnItem) {
              currentTotal += calculateItemCost(addOnItem, data.seniorityLevel)
            }
          })
        }

        // Subtract Downpayment
        currentTotal -= data.downpayment || 0
        setTotalCost(Math.max(0, currentTotal))
        setIsCalculating(false)
      } else {
        setTotalCost(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, formState.isValid, formState.errors])

  // --- Submit Handler ---
  const onSubmit = (data: PricingSummaryFormValues) => {
    console.log("Form Submitted Data:", data)
    console.log("Calculated Total Cost:", totalCost)
    alert(`Estimate Confirmed! Total: $${totalCost.toFixed(2)}`)

    // Navigate back to the questionnaire page
    router.push("/questionnaire")
  }

  // --- Form Sections ---
  const renderSeniorityLevelSection = (
    <FormField
      control={control}
      name="seniorityLevel"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-base font-semibold"></FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {prices.seniorityLevels.map((level) => (
                <FormItem key={level} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={level} id={`level-${level}`} />
                  </FormControl>
                  <FormLabel htmlFor={`level-${level}`} className="font-normal">
                    {level}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const renderMainServicesSection = (
    <div className="space-y-4">
      {/* <h3 className="text-base font-semibold">Main Services</h3> */}
      {prices.services
        .filter((category) => getFieldNameForCategory(category.category) !== "addOns")
        .map((category) => {
          const fieldName = getFieldNameForCategory(category.category) as FieldName
          return (
            <FormField
              key={category.category}
              control={control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{category.category}</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v === "none" ? undefined : v)}
                    value={(field.value as string | undefined) ?? "none"}
                    disabled={!selectedLevel}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedLevel ? "Select level first" : "Select a service..."
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {category.items.map((item) => (
                        <SelectItem key={item.id} value={item.id} disabled={!selectedLevel}>
                          <div className="flex w-full items-center justify-between">
                            <span>{item.name}</span>
                            {selectedLevel && (
                              <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                                {getPriceString(
                                  item.price,
                                  selectedLevel,
                                  item.price.type === "hourly" ? hourlyDuration : undefined
                                )}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>{category.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        })}
    </div>
  )

  const renderAddOnsSection = (
    <FormField
      control={control}
      name="addOns"
      render={() => {
        const addOnCategory = prices.services.find(
          (c) => getFieldNameForCategory(c.category) === "addOns"
        )
        if (!addOnCategory) return <></>

        return (
          <FormItem>
            <div className="mb-4">
              <FormDescription>{addOnCategory.description}</FormDescription>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {addOnCategory.items.map((item) => (
                <FormField
                  key={item.id}
                  control={control}
                  name="addOns"
                  render={({ field: addOnField }) => {
                    const isChecked = addOnField.value?.includes(item.id)
                    return (
                      <FormItem
                        className={cn(
                          "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 transition-colors",
                          !selectedLevel
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-accent hover:text-accent-foreground",
                          isChecked && "border-primary"
                        )}
                      >
                        <FormControl>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const currentAddOns = addOnField.value || []
                              if (checked) {
                                addOnField.onChange([...currentAddOns, item.id])
                              } else {
                                addOnField.onChange(currentAddOns.filter((id) => id !== item.id))
                              }
                            }}
                            disabled={!selectedLevel}
                            id={`addon-${item.id}`}
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={`addon-${item.id}`}
                          className="flex-grow cursor-pointer font-normal"
                        >
                          <div className="flex w-full items-center justify-between">
                            <span>{item.name}</span>
                            {selectedLevel && (
                              <Badge variant="outline" className="ml-2 whitespace-nowrap">
                                {getPriceString(item.price, selectedLevel)}
                              </Badge>
                            )}
                          </div>
                          {item.notes && (
                            <p className="pt-1 text-xs text-muted-foreground">{item.notes}</p>
                          )}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )

  const renderDurationSection = hasHourlyService && (
    <FormField
      control={control}
      name="hourlyDuration"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Estimated Duration (Hours) *</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.5"
              min="0.5"
              {...field}
              value={field.value ?? 1}
              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
            />
          </FormControl>
          <FormDescription>Required for hourly services.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const renderDownpaymentSection = (
    <FormField
      control={control}
      name="downpayment"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Downpayment Received ($)</FormLabel>
          <FormControl>
            <Input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*\.?[0-9]*"
              placeholder=""
              {...field}
              value={field.value === 0 ? "" : field.value}
              onChange={(e) => {
                const value = e.target.value.trim()
                if (value === "") {
                  field.onChange(0)
                } else {
                  const parsed = parseFloat(value)
                  field.onChange(isNaN(parsed) ? 0 : parsed)
                }
              }}
            />
          </FormControl>
          <FormDescription>Enter any amount the client has already paid.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  // --- Render ---
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f5ee] pb-20 md:pb-0">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Form Column */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">Pricing Summary & Estimate</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {isMobile ? (
                      <Accordion type="single" collapsible defaultValue="stylist-level">
                        <AccordionItem value="stylist-level">
                          <AccordionTrigger>Stylist Level</AccordionTrigger>
                          <AccordionContent>{renderSeniorityLevelSection}</AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="main-services">
                          <AccordionTrigger>Main Services</AccordionTrigger>
                          <AccordionContent>{renderMainServicesSection}</AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="add-ons">
                          <AccordionTrigger>Add-Ons</AccordionTrigger>
                          <AccordionContent>{renderAddOnsSection}</AccordionContent>
                        </AccordionItem>

                        {hasHourlyService && (
                          <AccordionItem value="duration">
                            <AccordionTrigger>Duration</AccordionTrigger>
                            <AccordionContent>{renderDurationSection}</AccordionContent>
                          </AccordionItem>
                        )}

                        <AccordionItem value="downpayment">
                          <AccordionTrigger>Downpayment</AccordionTrigger>
                          <AccordionContent>{renderDownpaymentSection}</AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <>
                        {renderSeniorityLevelSection}
                        <Separator />
                        {renderMainServicesSection}
                        <Separator />
                        {renderAddOnsSection}
                        {hasHourlyService && (
                          <>
                            <Separator />
                            {renderDurationSection}
                          </>
                        )}
                        <Separator />
                        {renderDownpaymentSection}
                      </>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Estimate Details Column (Desktop Only) */}
          <div className="hidden md:block">
            <EstimateDetails
              formValues={watchedValues}
              totalCost={totalCost}
              isCalculating={isCalculating}
            />
            <div className="mt-6">
              <Button
                onClick={handleSubmit(onSubmit)}
                className="w-full"
                disabled={!formState.isValid || isCalculating}
              >
                {isCalculating ? "Calculating..." : "Confirm Estimate & Proceed"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Components */}
      {isMobile && (
        <>
          <FloatingTotal
            totalCost={totalCost}
            isCalculating={isCalculating}
            onViewDetails={() => setIsModalOpen(true)}
          />
          <EstimateModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            formValues={watchedValues}
            totalCost={totalCost}
            isCalculating={isCalculating}
            onConfirm={handleSubmit(onSubmit)}
          />
        </>
      )}
    </div>
  )
}
