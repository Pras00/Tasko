import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Kanban,
  Clock,
  Users2,
  Sparkles,
  ShieldCheck,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-indigo-500/20">
      {/* Global Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Background gradient decorative glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-500/20 via-violet-500/15 to-amber-400/20 blur-3xl opacity-70 -z-10 rounded-full" />

        <div className="container mx-auto max-w-6xl px-4 text-center sm:px-6">
          {/* Joyful Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm backdrop-blur-sm mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Introducing Tasko 2.0 • Joyful Project Management</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Organize tasks with{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
              clarity & joy.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Tasko gives teams a modern, agile workspace inspired by Mini Trello. Plan sprints,
            drag cards across Kanban workflows, assign team members, and track deadlines with ease.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 text-sm font-semibold gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-6 rounded-2xl border-border/80 bg-background/80 hover:bg-accent text-sm font-semibold gap-2 backdrop-blur-sm"
              >
                <span>View Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3.5">
                <Kanban className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm">Interactive Kanban</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Move tasks across To Do, In Progress, In Review, and Done with smooth drag-and-drop.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-violet-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3.5">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm">Team Collaboration</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Assign teammates, manage roles (Owner, Admin, Member), and ensure clear ownership.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3.5">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm">Deadline Awareness</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Stay ahead with smart alerts for due dates, overdue badges, and urgency priority flags.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm">Secure & Reliable</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Strict server-side role validation, database integrity with Prisma ORM, and safe auth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl">
          <p>© {new Date().getFullYear()} Tasko. Built with Next.js, Prisma, Tailwind v4 & shadcn/ui.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:underline">
              Log In
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
