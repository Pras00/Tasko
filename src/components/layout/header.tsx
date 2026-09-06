"use client"

import * as React from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FolderKanban, Sparkles, ArrowRight } from "lucide-react"
import { useSession } from "next-auth/react"
import { UserNav } from "@/components/layout/user-nav"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Sun/Moon Animated Switch */}
        <Link href="/" className="transition-opacity hover:opacity-95">
          <Logo interactive={true} />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <FolderKanban className="w-4 h-4" />
            <span>Projects</span>
          </Link>
          <a
            href="#features"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <Sparkles className="w-4 h-4" />
            <span>Features</span>
          </a>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session?.user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button size="sm" variant="outline" className="text-xs font-semibold rounded-xl">
                  Dashboard
                </Button>
              </Link>
              <UserNav />
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium text-xs">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/25 gap-1.5 font-medium text-xs rounded-xl"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
