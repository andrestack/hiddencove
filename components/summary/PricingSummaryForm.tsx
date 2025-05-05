"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { prices, type ServiceItem, type Price } from "@/lib/prices"
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils/cn"

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
      const rate = price.rates?.[level]
      if (!rate) return "N/A for level"
      if (duration && duration > 0) {
        return `$${(rate * duration).toFixed(2)} (${rate}/hr)`
      }
      return `$${rate.toFixed(2)}/hr`
    case "from":
      const levelPrice = price.levels?.[level]
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
      const rate = item.price.rates?.[level]
      return rate && duration ? rate * duration : 0
    case "from":
      return item.price.levels?.[level] || item.price.base || 0
    default:
      return 0
  }
}

const findServiceById = (id: string): ServiceItem | undefined => {
  for (const category of prices.services) {
    const item = category.items.find((item) => item.id === id)
    if (item) return item
  }
  return undefined
}

const getFieldNameForCategory = (categoryName: string): keyof PricingSummaryFormValues => {
  // Simple camelCase conversion, adjust if category names get more complex
  const fieldName = categoryName
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())

  // Type assertion, assuming the schema includes fields matching this pattern
  return fieldName as keyof PricingSummaryFormValues
}

// --- Component ---

export function PricingSummaryForm() {
  const [totalCost, setTotalCost] = useState<number>(0)
  const [isCalculating, setIsCalculating] = useState(false)

  const form = useForm<PricingSummaryFormValues>({
    resolver: zodResolver(pricingSummarySchema),
    defaultValues: {
      downpayment: 0,
      addOns: [],
      hourlyDuration: 1, // Sensible default
      // Set other service fields explicitly to undefined for controlled components
      transformationPackage: undefined,
      foilPackages: undefined,
      globalGlossHairColour: undefined,
      hairCutting: undefined,
      babyStylistServices: undefined,
    },
    mode: "onChange", // Validate and calculate on change
  })

  const { watch, control, handleSubmit, formState } = form

  const watchedValues = watch() // Watch all values for calculation
  const selectedLevel = watch("seniorityLevel")
  const hourlyDuration = watch("hourlyDuration")

  // Determine if any selected main service requires the hourly duration input
  const hasHourlyService = prices.services.some((category) => {
    const fieldName = getFieldNameForCategory(category.category)
    // Exclude addOns field from this check
    if (fieldName === "addOns") return false
    const selectedItemId = watchedValues[fieldName] as string | undefined
    if (!selectedItemId) return false
    const item = findServiceById(selectedItemId)
    return item?.price.type === "hourly"
  })

  // --- Calculation Effect ---
  useEffect(() => {
    // Subscribe to form changes
    const subscription = watch((currentValues) => {
      // Calculate only if the form is valid according to Zod
      if (formState.isValid) {
        setIsCalculating(true)
        let currentTotal = 0
        const data = currentValues as PricingSummaryFormValues

        // 1. Calculate Main Services
        prices.services.forEach((category) => {
          const fieldName = getFieldNameForCategory(category.category)
          // Skip addOns category here, handled separately
          if (fieldName === "addOns") return

          const selectedItemId = data[fieldName] as string | undefined
          if (selectedItemId && data.seniorityLevel) {
            const item = findServiceById(selectedItemId)
            if (item) {
              currentTotal += calculateItemCost(item, data.seniorityLevel, data.hourlyDuration)
            }
          }
        })

        // 2. Calculate Add-Ons
        const addOnCategory = prices.services.find(
          (c) => getFieldNameForCategory(c.category) === "addOns"
        )
        if (addOnCategory && data.addOns && data.seniorityLevel) {
          data.addOns.forEach((addOnId) => {
            const addOnItem = addOnCategory.items.find((i) => i.id === addOnId)
            if (addOnItem) {
              // Assuming add-ons don't use hourly duration
              currentTotal += calculateItemCost(addOnItem, data.seniorityLevel)
            }
          })
        }

        // 3. Subtract Downpayment
        currentTotal -= data.downpayment || 0

        setTotalCost(Math.max(0, currentTotal)) // Ensure cost is not negative
        setIsCalculating(false)
      } else {
        // If form is invalid, reset total cost
        setTotalCost(0)
      }
    })

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe()
  }, [watch, formState.isValid, formState.errors]) // Rerun calculation if validity or errors change

  // --- Submit Handler ---
  const onSubmit = (data: PricingSummaryFormValues) => {
    console.log("Form Submitted Data:", data)
    console.log("Calculated Total Cost:", totalCost)
    alert(`Estimate Confirmed! Total: $${totalCost.toFixed(2)}`) // Placeholder action
    // TODO: Implement actual submission logic (e.g., save estimate, proceed)
  }

  // --- Data for Rendering ---
  const mainCategories = prices.services.filter(
    (c) => getFieldNameForCategory(c.category) !== "addOns"
  )
  const addOnCategory = prices.services.find(
    (c) => getFieldNameForCategory(c.category) === "addOns"
  )

  // --- Render ---
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f5ee]">
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Pricing Summary & Estimate</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select services and stylist level to generate an estimate.
        </p>
      </CardHeader>
      <Form {...form}>
        {/* Pass onSubmit to the form element */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="space-y-6">
            {/* --- Seniority Level (RadioGroup) --- */}
            <FormField
              control={control}
              name="seniorityLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">Stylist Level *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value} // Use value prop for controlled component
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

            <Separator />

            {/* --- Main Service Categories (Select Dropdowns) --- */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Main Services</h3>
              {mainCategories.map((category) => {
                const fieldName = getFieldNameForCategory(category.category)
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
                          value={field.value ?? "none"}
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

            {/* --- Hourly Duration Input (Conditional) --- */}
            {hasHourlyService && (
              <FormField
                control={control}
                name="hourlyDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Duration (Hours) *</FormLabel>
                    <FormControl>
                      {/* Ensure value is passed and parsed correctly */}
                      <Input
                        type="number"
                        step="0.5"
                        min="0.5" // Minimum duration might be 0.5 hours
                        {...field}
                        value={field.value ?? 1} // Controlled input
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} // Ensure number conversion
                      />
                    </FormControl>
                    <FormDescription>
                      Required for hourly services (e.g., &apos;The Big Noosa Blonde Up&apos;).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Separator />

            {/* --- Add-Ons (Checkboxes) --- */}
            {addOnCategory && (
              <FormField
                control={control}
                name="addOns" // Target the addOns array field
                render={() => (
                  // Render prop doesn't need field for the container
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base font-semibold">Add-Ons</FormLabel>
                      <FormDescription>{addOnCategory.description}</FormDescription>
                    </div>
                    {/* Mobile-first grid */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {addOnCategory.items.map((item) => (
                        // Each checkbox needs its own FormField instance for correct hook handling
                        <FormField
                          key={item.id}
                          control={control}
                          name="addOns" // Point to the array field
                          render={({ field }) => {
                            const isChecked = field.value?.includes(item.id)
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
                                      const currentAddOns = field.value || []
                                      if (checked) {
                                        field.onChange([...currentAddOns, item.id])
                                      } else {
                                        field.onChange(currentAddOns.filter((id) => id !== item.id))
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
                                    <p className="pt-1 text-xs text-muted-foreground">
                                      {item.notes}
                                    </p>
                                  )}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    {/* Display validation messages for the addOns array itself if needed */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Separator />

            {/* --- Downpayment Input --- */}
            <FormField
              control={control}
              name="downpayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Downpayment Received ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={field.value ?? 0} // Controlled input
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} // Ensure number conversion
                    />
                  </FormControl>
                  <FormDescription>Enter any amount the client has already paid.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4 border-t pt-6">
            <div className="text-center text-2xl font-bold">
              Estimated Total: ${totalCost.toFixed(2)}
            </div>
            <Button type="submit" className="w-full" disabled={!formState.isValid || isCalculating}>
              {isCalculating ? "Calculating..." : "Confirm Estimate & Proceed"}
            </Button>
            {/* Show general error if submitted while invalid */}
            {!formState.isValid && formState.isSubmitted && (
              <p className="text-sm text-red-500">Please fix the errors above before proceeding.</p>
            )}
          </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
