"use client"

import dynamic from "next/dynamic"
import { type ToasterProps } from "sonner"

const SonnerToaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), {
  ssr: false,
})

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "white",
          color: "#383838",
          border: "1px solid #E6D4CB",
        },
        className: "font-red-hat",
      }}
      {...props}
    />
  )
}
