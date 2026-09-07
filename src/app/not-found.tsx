import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center selection:bg-indigo-500/20">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-90">
          <Logo />
        </Link>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md p-8 sm:p-12 max-w-md shadow-xl">
        <span className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
          404
        </span>
        <h2 className="text-xl font-bold mt-3">Page Not Found</h2>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          The project, board, or page you are looking for might have been moved or does not exist.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-xs font-semibold">
              <Home className="w-3.5 h-3.5" />
              <span>Go to Dashboard</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-xl text-xs gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
