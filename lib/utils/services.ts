import { prices, type ServiceItem } from "@/lib/prices"

export function findServiceById(id: string): ServiceItem | undefined {
  for (const category of prices.services) {
    const item = category.items.find((item) => item.id === id)
    if (item) return item
  }
  return undefined
}

export function getFieldNameForCategory(categoryName: string): string {
  // Special case for the add-ons category
  if (categoryName === "Foil Package Add On's") {
    return "addOns"
  }

  // Default case for other categories
  return categoryName.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
}
