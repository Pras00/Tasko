"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LogOut,
  Settings,
  LayoutDashboard,
  FolderKanban,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

export function UserNav() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const user = session?.user

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TK"

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true)
      toast.loading("Signing out...", { id: "signout-toast" })
      await signOut({ callbackUrl: "/login" })
      toast.success("Successfully logged out", { id: "signout-toast" })
    } catch {
      toast.error("Failed to sign out", { id: "signout-toast" })
      setIsLoggingOut(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-xl p-0 ring-2 ring-indigo-500/20 hover:ring-indigo-500/40 hover:scale-105 transition-all focus-visible:ring-indigo-500 cursor-pointer"
            title="User menu"
          />
        }
      >
        <Avatar className="h-9 w-9 rounded-xl border border-border/50">
          <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
          <AvatarFallback className="bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white font-bold text-xs rounded-xl shadow-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-2xl p-2 shadow-2xl border-border/70 bg-popover/95 backdrop-blur-md animate-in fade-in-0 zoom-in-95"
      >
        {/* User Profile Header */}
        <DropdownMenuLabel className="p-2.5 bg-muted/40 rounded-xl mb-1 border border-border/40">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-xl shrink-0">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs rounded-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold leading-none text-foreground truncate max-w-[120px]">
                  {user?.name || "Demo User"}
                </span>
                <Badge
                  variant="outline"
                  className="text-[9px] font-semibold px-1.5 py-0 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 uppercase"
                >
                  {(user as { role?: string })?.role || "Member"}
                </Badge>
              </div>
              <p className="text-[11px] leading-tight text-muted-foreground truncate">
                {user?.email || "demo@tasko.dev"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1" />

        {/* Navigation Options */}
        <DropdownMenuItem
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer gap-2.5 rounded-xl text-xs font-medium py-2 px-2.5 hover:bg-accent focus:bg-accent transition-colors"
        >
          <LayoutDashboard className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="flex-1">Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/projects")}
          className="cursor-pointer gap-2.5 rounded-xl text-xs font-medium py-2 px-2.5 hover:bg-accent focus:bg-accent transition-colors"
        >
          <FolderKanban className="w-4 h-4 text-violet-500 shrink-0" />
          <span className="flex-1">Projects</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="cursor-pointer gap-2.5 rounded-xl text-xs font-medium py-2 px-2.5 hover:bg-accent focus:bg-accent transition-colors"
        >
          <Settings className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="flex-1">Account Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        {/* Logout Action */}
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="cursor-pointer gap-2.5 rounded-xl text-xs font-semibold py-2 px-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10 focus:text-rose-600 transition-colors"
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 animate-spin shrink-0 text-rose-500" />
          ) : (
            <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
          )}
          <span>{isLoggingOut ? "Signing out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
