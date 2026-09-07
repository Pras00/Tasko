import Link from "next/link"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 selection:bg-indigo-500/20">
      {/* Top Navbar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-90">
          <Logo />
        </Link>
        <ThemeToggle />
      </div>

      {/* Decorative Glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-amber-400/10 blur-3xl opacity-60 -z-10 rounded-full" />

      {/* Content Container */}
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
