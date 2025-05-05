import { z } from "zod"
import { prices, type ServiceItem } from "@/lib/prices"

// Helper function to find a service item by ID across all categories
const findServiceById = (id: string): ServiceItem | undefined => {
  for (const category of prices.services) {
    const item = category.items.find((item) => item.id === id)
    if (item) {
      return item
    }
  }
  return undefined
}

// Define the schema
export const pricingSummarySchema = z
  .object({
    seniorityLevel: z.enum(prices.seniorityLevels, {
      required_error: "Please select a stylist level.",
    }),
    downpayment: z.coerce.number().min(0, "Downpayment cannot be negative.").optional().default(0),

    // Main service selections (one per category)
    transformationPackage: z.string().optional(),
    foilPackages: z.string().optional(),
    globalGlossHairColour: z.string().optional(),
    hairCutting: z.string().optional(),
    babyStylistServices: z.string().optional(),

    // Multiple add-ons can be selected
    addOns: z.array(z.string()).default([]),

    // Duration for hourly services
    hourlyDuration: z.coerce.number().min(0, "Duration must be positive.").optional(),
  })
  .superRefine((data, ctx) => {
    let isHourlyServiceSelected = false
    let hasMainService = false

    // Check main service selections
    const mainServiceFields = [
      data.transformationPackage,
      data.foilPackages,
      data.globalGlossHairColour,
      data.hairCutting,
      data.babyStylistServices,
    ]

    // Validate main services
    for (const selectedItemId of mainServiceFields) {
      if (selectedItemId) {
        hasMainService = true
        const service = findServiceById(selectedItemId)
        if (service?.price.type === "hourly") {
          isHourlyServiceSelected = true
          break
        }
      }
    }

    // Require at least one main service
    if (!hasMainService) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select at least one main service.",
      })
    }

    // Validate add-ons
    if (data.addOns.length > 0) {
      // Only allow add-ons if a main service is selected
      if (!hasMainService) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["addOns"],
          message: "Add-ons can only be selected with a main service.",
        })
      }

      // Validate each add-on ID exists
      for (const addOnId of data.addOns) {
        const addOn = findServiceById(addOnId)
        if (!addOn) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["addOns"],
            message: `Invalid add-on selected: ${addOnId}`,
          })
        }
      }
    }

    // Require duration for hourly services
    if (
      isHourlyServiceSelected &&
      (data.hourlyDuration === undefined || data.hourlyDuration <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hourlyDuration"],
        message: "Duration (in hours) is required when an hourly service is selected.",
      })
    }
  })

// Infer the TypeScript type from the schema
export type PricingSummaryFormValues = z.infer<typeof pricingSummarySchema>
