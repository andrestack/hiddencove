export type SeniorityLevel = "Baby" | "Junior" | "Intermediate" | "Senior"

export interface Price {
  type: "from" | "hourly" | "fixed"
  base?: number // Base price for 'fixed' or 'from' types, or minimum for 'from'
  rates?: { [key in SeniorityLevel]?: number } // Hourly rates per level
  levels?: { [key in SeniorityLevel]?: number | null } // Specific price per level for 'fixed' or 'from'
}

export interface ServiceItem {
  id: string
  name: string
  price: Price
  notes: string | null
}

export interface ServiceCategory {
  category: string
  description: string
  items: ServiceItem[]
}

export interface PricingData {
  seniorityLevels: SeniorityLevel[]
  services: ServiceCategory[]
}

// Define the pricing data constant

export const prices: PricingData = {
  seniorityLevels: ["Junior", "Intermediate", "Senior"],
  services: [
    {
      category: "Transformation Package",
      description:
        "Going from brown to blonde in one sitting. Including minimal trim haircut, restyle at additional cost.",
      items: [
        {
          id: "trans_beach_babe",
          name: "The Textured Beach Babe",
          price: {
            type: "from",
            base: 455,
          },
          notes: "Price independent of stylist level specified.",
        },
        {
          id: "trans_noosa_blonde",
          name: "The Big Noosa Blonde Up",
          price: {
            type: "hourly",
            rates: {
              Senior: 165,
              Intermediate: 155,
              Junior: 105,
            },
          },
          notes: null,
        },
      ],
    },
    {
      category: "Foil Packages",
      description: "All packages include Plex & Custom Toning/Gloss and styled blow wave.",
      items: [
        {
          id: "foil_full",
          name: "Full head of foils, toner and style",
          price: {
            type: "from",
            levels: {
              Senior: 400,
              Intermediate: 375,
              Junior: 330,
            },
          },
          notes: "Senior price from main list, Intermediate/Junior from Stylist Packages section.",
        },
        {
          id: "foil_3_4",
          name: "¾ head of foils, toner and style",
          price: {
            type: "from",
            levels: {
              Senior: 350,
              Intermediate: 335,
              Junior: 280,
            },
          },
          notes: "Senior price from main list, Intermediate/Junior from Stylist Packages section.",
        },
        {
          id: "foil_1_2",
          name: "½ head of foils, toner and style",
          price: {
            type: "from",
            levels: {
              Senior: 300,
              Intermediate: 285,
              Junior: 235,
            },
          },
          notes: "Senior price from main list, Intermediate/Junior from Stylist Packages section.",
        },
        {
          id: "foil_1_4",
          name: "¼ head of foils, toner and style",
          price: {
            type: "from",
            levels: {
              Senior: 270,
              Intermediate: 250,
              Junior: 200,
            },
          },
          notes: "Senior price from main list, Intermediate/Junior from Stylist Packages section.",
        },
      ],
    },
    {
      category: "Foil Package Add On's",
      description:
        "Add-ons for package appointments (book hair package first). Applied if extra product/time is needed.",
      items: [
        { id: "addon_thick", name: "Extra thick", price: { base: 25, type: "fixed" }, notes: null },
        { id: "addon_long", name: "Extra Long", price: { base: 25, type: "fixed" }, notes: null },
        {
          id: "addon_regrowth",
          name: "Additional 10+ weeks regrowth",
          price: { base: 25, type: "fixed" },
          notes: null,
        },
        { id: "addon_tip_out", name: "Tip out", price: { base: 55, type: "from" }, notes: null },
        {
          id: "addon_basin_bally",
          name: "Basin bally",
          price: { base: 30, type: "fixed" },
          notes: null,
        },
        { id: "addon_scandi", name: "Scandi", price: { base: 30, type: "fixed" }, notes: null },
        {
          id: "addon_clear_gloss",
          name: "Clear gloss",
          price: { base: 20, type: "fixed" },
          notes: null,
        },
        {
          id: "addon_trim_colour",
          name: "Haircut trim with colour",
          price: { base: 50, type: "from" },
          notes: "See Hair Cutting section for specific stylist pricing.",
        },
        {
          id: "addon_regrowth_tint",
          name: "Regrowth tint between foils",
          price: { base: 60, type: "fixed" },
          notes: null,
        },
      ],
    },
    {
      category: "Global Gloss Hair Colour",
      description: "Pricing may vary based on hair length/thickness.",
      items: [
        {
          id: "global_all_over",
          name: "All over colour and blow dry",
          price: { base: 260, type: "from" },
          notes: "Stylist level not specified.",
        },
        {
          id: "global_toner_style",
          name: "Gloss global Toner and style",
          price: { base: 185, type: "from" },
          notes: "Stylist level not specified.",
        },
        {
          id: "global_extensive_toner",
          name: "Extensive toner and blow dry (root stretch)",
          price: { base: 165, type: "from" },
          notes: "Stylist level not specified.",
        },
        {
          id: "global_express_toner",
          name: "Express Toner",
          price: { base: 110, type: "fixed" },
          notes: "Stylist level not specified.",
        },
      ],
    },
    {
      category: "Hair Cutting",
      description: "Cuts across all Levels. Prices may vary for extensive restyles.",
      items: [
        {
          id: "cut_with_colour",
          name: "Ladies cut with colour service",
          price: {
            type: "fixed",
            levels: {
              Senior: 65,
              Intermediate: 55,
              Junior: 55,
            },
          },
          notes:
            "Note: Junior Stylist section also lists 'One length hair cut with colour service (no layers)' at $40.",
        },
        {
          id: "cut_trim_blowdry",
          name: "Ladies Trim and blow-dry",
          price: {
            type: "from",
            levels: {
              Senior: 100,
              Intermediate: 95,
              Junior: null,
            },
          },
          notes: "Junior price not specified.",
        },
        {
          id: "cut_restyle_blowdry",
          name: "Restyle Haircut and blow-dry",
          price: {
            type: "from",
            levels: {
              Senior: 140,
              Intermediate: 125,
              Junior: null,
            },
          },
          notes: "Junior price not specified.",
        },
        {
          id: "cut_extensive_restyle",
          name: "Extensive Restyle Cut",
          price: {
            type: "from",
            levels: {
              Senior: 165,
              Intermediate: 140,
              Junior: null,
            },
          },
          notes: "Junior price not specified.",
        },
        {
          id: "cut_fringe",
          name: "Fringe trim",
          price: { base: 20, type: "fixed" },
          notes: "Price independent of stylist level.",
        },
        {
          id: "cut_junior_onelength",
          name: "One length hair cut with colour service (Junior)",
          price: {
            type: "fixed",
            levels: {
              Senior: null,
              Intermediate: null,
              Junior: 40,
            },
          },
          notes: "Specific Junior service (no layers). Listed separately for clarity.",
        },
      ],
    },
    {
      category: "Baby Stylist Services",
      description:
        "Services performed by Baby Stylists (pricing independent of main seniority levels).",
      items: [
        {
          id: "baby_tint_ends",
          name: "Tint Regrowth and Ends",
          price: { base: 130, type: "from" },
          notes: null,
        },
        {
          id: "baby_tint_style",
          name: "Tint Regrowth and Style",
          price: { base: 100, type: "from" },
          notes: null,
        },
        {
          id: "baby_training_model",
          name: "Colour Training models",
          price: { base: 120, type: "from" },
          notes: null,
        },
      ],
    },
  ],
}
