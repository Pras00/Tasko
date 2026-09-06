"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useMounted } from "@/hooks/use-mounted"

interface LogoProps {
  showText?: boolean
  className?: string
  interactive?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({
  showText = true,
  className = "",
  interactive = false,
  size = "md",
}: LogoProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  const isDark = mounted && resolvedTheme === "dark"

  const toggleTheme = () => {
    if (interactive) {
      setTheme(isDark ? "light" : "dark")
    }
  }

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div
      onClick={interactive ? toggleTheme : undefined}
      className={`inline-flex items-center gap-2.5 select-none ${
        interactive ? "cursor-pointer group" : ""
      } ${className}`}
      title={interactive ? "Click to switch Light / Dark theme" : undefined}
    >
      {/* Bespoke Tasko Geometric Emblem */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`relative flex items-center justify-center ${iconSizes[size]} rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-amber-400 p-[1.5px] shadow-sm shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow duration-300`}
      >
        <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[14px] flex items-center justify-center overflow-hidden relative p-1.5">
          {/* Custom Stylized "T" Shaped Kanban Emblem */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Horizontal Task Bar (Top of the T) */}
            <rect
              x="3"
              y="4"
              width="26"
              height="7"
              rx="3.5"
              className="fill-indigo-600 dark:fill-indigo-400 transition-colors"
            />

            {/* Vertical Kanban Column Stem (Stem of the T) */}
            <rect
              x="12.5"
              y="11"
              width="7"
              height="17"
              rx="3.5"
              className="fill-violet-500 dark:fill-purple-400 opacity-90 transition-colors"
            />

            {/* Secondary Floating Task Card on Left */}
            <rect
              x="3"
              y="14"
              width="6.5"
              height="9"
              rx="3"
              className="fill-indigo-400 dark:fill-indigo-600 opacity-40 transition-colors"
            />
          </svg>

          {/* Celestial Morphing Sun ☀️ ↔️ Moon 🌙 Aperture in Upper Right */}
          <div className="absolute right-1 top-1 w-3.5 h-3.5 flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {!isDark ? (
                /* Sun Disc (Light Mode) */
                <motion.div
                  key="sun-orb"
                  initial={{ scale: 0, rotate: -90, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-xs shadow-amber-500 flex items-center justify-center"
                >
                  <span className="w-1 h-1 rounded-full bg-white/90" />
                </motion.div>
              ) : (
                /* Crescent Moon (Dark Mode) */
                <motion.div
                  key="moon-orb"
                  initial={{ scale: 0, rotate: 90, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-3 h-3 flex items-center justify-center text-amber-300 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black ${textSizes[size]} tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-900 dark:from-indigo-300 dark:via-purple-200 dark:to-pink-300 bg-clip-text text-transparent font-sans`}
          >
            Tasko
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-tr from-indigo-500 to-emerald-400" />
          </span>
        </div>
      )}
    </div>
  )
}
