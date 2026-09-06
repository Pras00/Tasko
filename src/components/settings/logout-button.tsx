"use client"

import * as React from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function LogoutButton() {
  const [loading, setLoading] = React.useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      toast.loading("Signing out...", { id: "settings-signout" })
      await signOut({ callbackUrl: "/login" })
      toast.success("Signed out successfully", { id: "settings-signout" })
    } catch {
      toast.error("Failed to sign out", { id: "settings-signout" })
      setLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={loading}
      className="gap-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span>Log Out from Tasko</span>
    </Button>
  )
}
