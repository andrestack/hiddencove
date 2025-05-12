import { DM_Serif_Text, Red_Hat_Display } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import PWAInstallPrompt from "@/components/PWAInstallPrompt"
import { Viewport } from "next"
import { Toaster } from "@/components/providers/toaster"

const dmSerifText = DM_Serif_Text({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
})

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-red-hat",
})

export const viewport: Viewport = {
  themeColor: "#383838",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata = {
  title: "Hidden Cove Onboarding",
  description: "Stylist onboarding and consultation platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hidden Cove",
  },
  icons: {
    icon: "/landing_page_bg_192x192.png",
    shortcut: "/landing_page_bg_192x192.png",
    apple: "/landing_page_bg_192x192.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#383838" />
        <link rel="apple-touch-icon" href="/landing_page_bg_192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hidden Cove" />
      </head>
      <body
        className={`${dmSerifText.variable} ${redHatDisplay.variable} min-h-screen font-red-hat antialiased`}
      >
        <AuthProvider>
          {children}
          <PWAInstallPrompt />
          <Toaster />
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
