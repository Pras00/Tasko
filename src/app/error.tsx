"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("Tasko Runtime Error:", error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 max-w-md space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {error.message || "An unexpected error occurred while loading this view."}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            size="sm"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-2"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="rounded-xl text-xs gap-2">
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
