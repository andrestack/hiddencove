# Prompt: Create a Responsive Pricing Summary Form Layout

## Objective

Build a responsive pricing summary and estimate form using React, Next.js, TypeScript, TailwindCSS, Zod, React Hook Form, and Shadcn UI components. The form should have distinct layouts for desktop and mobile screens, offering an optimized user experience for stylists generating estimates on different devices. Reference the adapted component structures (`PricingSummaryForm.tsx`, `EstimateDetails.tsx`, `EstimateModal.tsx`, `FloatingTotal.tsx`) for implementation details.

## Core Functionality

The form allows stylists to select the `SeniorityLevel`, choose main `ServiceItems` from different `ServiceCategory` dropdowns, select applicable `AddOns` using checkboxes, input `hourlyDuration` if needed, and record any `downpayment`. As the stylist fills the form, a running total estimate should be calculated and displayed. The final step involves reviewing the estimate details and confirming it.

## Layout Requirements

### 1. Desktop Layout (Screens wider than `md`, e.g., > 768px)

- **Structure**: Implement a two-column layout using Flexbox or CSS Grid.
  - **Left Column (flex-1 or similar ratio)**: Contains the main form sections housed within a `Card` component (`PricingSummaryForm.tsx`). Form sections like Stylist Level, Main Services, Add-Ons, and Downpayment should be stacked vertically.
  - **Right Column (flex-1 or similar ratio)**: Displays a live-updating "Estimate Details" component (`EstimateDetails.tsx`) also within a `Card`. This component should dynamically reflect the stylist's selections (level, services, add-ons, duration), show the itemized cost breakdown, and the final calculated total cost in real-time as they interact with the form on the left.
- **Real-time Updates**: Use React Hook Form for form state management. The `watch` function should trigger recalculations, updating the state which is passed down to the `EstimateDetails` component to ensure it always shows the current selections and total.
- **Submission**: The main "Confirm Estimate & Proceed" button might remain in the `PricingSummaryForm` (left column) or be placed contextually within the `EstimateDetails` (right column).

### 2. Mobile Layout (Screens `md` or narrower, e.g., <= 768px)

- **Structure**: Switch to a single-column layout.
  - **Form Sections**: The main form sections (Stylist Level, Main Services, Add-Ons, Downpayment) should be rendered within `Accordion` components (`@/components/ui/accordion`) inside the `PricingSummaryForm.tsx`. This allows stylists to expand and collapse sections on smaller screens. The `PricingSummaryForm.tsx` component should handle this conditional rendering based on screen size (using a hook like `useMediaQuery`).
  - **Hidden Details**: The right-column `EstimateDetails` component used on desktop should be hidden (`hidden md:block`).
  - **Floating Total**: Implement a `FloatingTotal` component that appears fixed at the bottom of the viewport. It should display the current calculated `total` and contain a button like "View Estimate Details".
  - **Estimate Modal**: When the stylist clicks the "View Estimate Details" button in the `FloatingTotal` component, open a `Dialog` (modal) (`EstimateModal.tsx`). This modal should display the full estimate breakdown (similar to the desktop `EstimateDetails` component) and the final "Confirm Estimate & Proceed" button.

## Component References

- `components/summary/PricingSummaryForm.tsx`: Main form container, potentially handles layout switching and renders form sections (possibly within accordions on mobile).
- `components/summary/EstimateDetails.tsx`: Displays the live-updating itemized estimate on desktop.
- `components/summary/EstimateModal.tsx`: Displays the estimate details and confirmation button in a modal on mobile.
- `components/summary/FloatingTotal.tsx`: Shows the running total and triggers the modal on mobile.
- Data Sources: `lib/prices.ts`, `lib/schemas/pricingSummarySchema.ts`
- Shadcn UI Components: `Card`, `Button`, `Accordion`, `Checkbox`, `Label`, `Dialog`, `Input`, `RadioGroup`, `Select`, `Badge`, `Separator`, etc.
- Lucide Icons (`lucide-react`) for icons.

## Technical Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: TailwindCSS, Shadcn UI
- Form Management: React Hook Form
- Schema Validation: Zod
- State Management: React `useState`, `useEffect`

## Implementation Notes

- Use a `useMediaQuery` hook (e.g., from `react-responsive` or a custom hook) to detect screen size changes and conditionally render layouts/components within `PricingSummaryForm` or its parent page.
- Ensure smooth transitions and prevent layout shifts when switching between views.
- Pass form data and state (like `total`, watched form values) between `PricingSummaryForm`, `EstimateDetails`, `FloatingTotal`, and `EstimateModal` components effectively, likely via prop drilling or potentially React Context if state becomes complex.
- The total calculation logic should be robust and potentially centralized or easily shared between the form and detail components.
- Ensure accessibility best practices are followed (proper ARIA attributes, keyboard navigation, focus management, especially for the modal).
