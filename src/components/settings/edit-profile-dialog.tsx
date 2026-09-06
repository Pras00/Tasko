"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfileName } from "@/actions/auth-actions"
import { toast } from "sonner"
import { Loader2, UserPen, Check, Lock } from "lucide-react"

interface EditProfileDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  currentName?: string
  email?: string
  image?: string | null
}

export function EditProfileDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
  currentName = "",
  email = "",
  image,
}: EditProfileDialogProps) {
  const { data: session, update } = useSession()
  const router = useRouter()

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = isControlled ? setControlledOpen! : setUncontrolledOpen

  const initialName = currentName || session?.user?.name || ""
  const userEmail = email || session?.user?.email || ""
  const userImage = image || session?.user?.image || ""

  const [name, setName] = React.useState(initialName)
  const [prevOpen, setPrevOpen] = React.useState(open)
  const [prevInitialName, setPrevInitialName] = React.useState(initialName)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  // Sync state during render when open transitions to true or initialName changes
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setName(initialName)
      setError("")
    }
  } else if (initialName !== prevInitialName) {
    setPrevInitialName(initialName)
    setName(initialName)
  }

  // Compute dynamic initials preview as user types
  const previewInitials = name.trim()
    ? name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TK"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()

    if (!trimmed) {
      setError("Please enter your name")
      return
    }

    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters")
      return
    }

    if (trimmed.length > 50) {
      setError("Name cannot exceed 50 characters")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const res = await updateProfileName(trimmed)

      if (res.success) {
        // Sync NextAuth client session
        await update({ name: res.newName || trimmed })
        toast.success(res.message)
        setOpen(false)
        router.refresh()
      } else {
        setError(res.message)
        toast.error(res.message)
      }
    } catch {
      setError("Failed to update profile name. Please try again.")
      toast.error("Failed to update profile name")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isLoading && setOpen(val)}>
      {trigger && <DialogTrigger render={trigger as React.ReactElement} />}

      <DialogContent className="sm:max-w-[440px] rounded-3xl p-6 border-border/80 shadow-2xl bg-card">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs shrink-0">
              <UserPen className="w-5 h-5" />
            </div>
            <DialogHeader className="gap-0.5 text-left">
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                Edit Profile Name
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Update how your name appears on cards, activity, and team boards.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Live Avatar Preview Card */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-muted/30 border border-border/40">
            <Avatar className="h-12 w-12 rounded-xl border border-border/60 shadow-xs shrink-0">
              <AvatarImage src={userImage} alt={name || "User"} />
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white font-bold text-sm rounded-xl transition-all">
                {previewInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">
                {name.trim() || "Your Name"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5">
            {/* Display Name Input */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-name" className="text-xs font-semibold text-foreground">
                Display Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError("")
                }}
                placeholder="Enter your full name"
                disabled={isLoading}
                maxLength={50}
                className={`rounded-xl text-xs bg-background h-10 ${
                  error ? "border-rose-500 focus-visible:ring-rose-500" : ""
                }`}
                autoFocus
              />
              {error ? (
                <p className="text-[11px] text-rose-500 font-medium">{error}</p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Between 2 and 50 characters.
                </p>
              )}
            </div>

            {/* Read-Only Email Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="profile-email" className="text-xs font-semibold text-muted-foreground">
                  Email Address
                </Label>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                  <Lock className="w-2.5 h-2.5" /> Read-only
                </span>
              </div>
              <Input
                id="profile-email"
                value={userEmail}
                disabled
                className="rounded-xl text-xs bg-muted/40 text-muted-foreground cursor-not-allowed h-10"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-3 border-t border-border/40 flex flex-row items-center justify-end gap-2 bg-transparent -mx-6 -mb-6 p-6">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => setOpen(false)}
              className="rounded-xl text-xs font-semibold h-9 px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim() || name.trim() === initialName}
              className="rounded-xl text-xs font-semibold h-9 px-4 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 cursor-pointer transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
