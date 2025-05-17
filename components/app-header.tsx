"use client"

import Link from "next/link"
import { Mic } from "lucide-react"
import { usePathname } from "next/navigation"

export default function AppHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-2">
          <Mic className="h-5 w-5 text-indigo-600" />
          <Link href="/" className="font-bold text-xl">
            HeyBud
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground">Your AI voice assistant</span>
          </nav>
        </div>
      </div>
    </header>
  )
}
