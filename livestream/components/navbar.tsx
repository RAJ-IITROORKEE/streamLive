"use client"

import Link from "next/link"
import { Video } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Video className="h-8 w-8" />
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LiveStream
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/assets" className="text-foreground hover:text-primary transition-colors">
            Assets
          </Link>
        </div>
      </div>
    </nav>
  )
}
