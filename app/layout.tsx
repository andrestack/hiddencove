import { DM_Serif_Text, Red_Hat_Display } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"

const dmSerifText = DM_Serif_Text({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
})

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-red-hat",
})

export const metadata = {
  title: "Hidden Cove Onboarding",
  description: "Stylist onboarding and consultation platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSerifText.variable} ${redHatDisplay.variable} font-red-hat`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
