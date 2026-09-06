"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPen } from "lucide-react"
import { EditProfileDialog } from "@/components/settings/edit-profile-dialog"

interface ProfileEditorProps {
  initialName?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

export function ProfileEditor({
  initialName = "",
  email = "",
  image = "",
  role = "MEMBER",
}: ProfileEditorProps) {
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)

  // Use session name if updated on client, otherwise initial from server
  const currentName = session?.user?.name || initialName || "Demo User"
  const userEmail = session?.user?.email || email || "demo@tasko.dev"
  const userImage = session?.user?.image || image || ""
  const userRole = (session?.user as { role?: string })?.role || role || "MEMBER"

  const initials = currentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "TK"

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border/40">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar className="h-14 w-14 rounded-2xl border border-border/60 shadow-sm shrink-0">
            <AvatarImage src={userImage} alt={currentName} />
            <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-base rounded-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-foreground truncate">{currentName}</h3>
              <Badge
                variant="outline"
                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 uppercase shrink-0"
              >
                {userRole}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className="rounded-xl text-xs font-semibold gap-1.5 h-9 px-3.5 border-border/70 hover:bg-accent shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <UserPen className="w-3.5 h-3.5 text-indigo-500" />
          <span>Change Name</span>
        </Button>
      </div>

      <EditProfileDialog
        open={open}
        onOpenChange={setOpen}
        currentName={currentName}
        email={userEmail}
        image={userImage}
      />
    </>
  )
}
