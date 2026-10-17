import type React from "react"
export default function MobileViewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="bg-gradient-to-b from-[#0a1a1f] to-[#0c2028]">{children}</div>
}

