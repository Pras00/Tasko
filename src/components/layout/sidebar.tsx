"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
  onNavigate?: () => void
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar({ className = "", onNavigate }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-border/50 bg-card/60 backdrop-blur-md p-4 transition-colors",
        className
      )}
    >
      {/* Header Logo */}
      <div className="flex items-center justify-between px-2 py-3 mb-4">
        <Link href="/" onClick={onNavigate} className="inline-flex items-center transition-opacity hover:opacity-90">
          <Logo />
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="space-y-1">
        <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 font-semibold"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"
                )}
              />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </div>

      {/* Quick Info Box */}
      <div className="mt-auto pt-4">
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-amber-500/5 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              ✨
            </div>
            <span className="text-xs font-semibold text-foreground">Tasko Productivity</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Drag cards, set deadlines, and manage projects with ease.
          </p>
        </div>
      </div>
    </aside>
  )
}
