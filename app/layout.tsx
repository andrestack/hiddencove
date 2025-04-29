import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Hidden Cove Onboarding",
  description: "Stylist onboarding and consultation platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
