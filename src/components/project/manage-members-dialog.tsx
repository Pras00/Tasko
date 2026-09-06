"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { addProjectMember, removeProjectMember } from "@/actions/member-actions"
import { toast } from "sonner"
import { Users, UserPlus, Trash2, Loader2 } from "lucide-react"
import { ProjectRole } from "@prisma/client"
import { PROJECT_ROLES } from "@/lib/constants"

interface ManageMembersDialogProps {
  projectId: string
  members: Array<{
    id: string
    userId: string
    role: ProjectRole
    user: {
      id: string
      name: string | null
      email: string
      image: string | null
    }
  }>
  currentUserRole: ProjectRole
  ownerId: string
  trigger?: React.ReactNode
}

export function ManageMembersDialog({
  projectId,
  members,
  currentUserRole,
  ownerId,
  trigger,
}: ManageMembersDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<"ADMIN" | "MEMBER">("MEMBER")
  const [isAdding, setIsAdding] = React.useState(false)
  const [removingId, setRemovingId] = React.useState<string | null>(null)

  const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN"

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      setIsAdding(true)
      const res = await addProjectMember(projectId, {
        email: email.trim(),
        role,
      })

      if (res.success) {
        toast.success(res.message)
        setEmail("")
        router.refresh()
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error("An error occurred while adding member")
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    try {
      setRemovingId(userId)
      const res = await removeProjectMember(projectId, userId)

      if (res.success) {
        toast.success(res.message)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error("Failed to remove member")
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl border-border/80">
              <Users className="w-3.5 h-3.5" />
              <span>Members ({members.length})</span>
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[520px] rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Users className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl">Project Members</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Manage who has access to this project board and their respective roles.
          </DialogDescription>
        </DialogHeader>

        {/* Add Member Form (Only for Owner or Admin) */}
        {canManage && (
          <form onSubmit={handleAddMember} className="mt-3 p-4 rounded-xl border border-border/70 bg-accent/30 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <UserPlus className="w-4 h-4 text-indigo-500" />
              <span>Invite New Member</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="User's email (e.g. sarah@tasko.dev)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl text-xs flex-1"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "ADMIN" | "MEMBER")}
                className="rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
              <Button
                type="submit"
                disabled={isAdding}
                size="sm"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0"
              >
                {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Invite"}
              </Button>
            </div>
          </form>
        )}

        {/* Members List */}
        <div className="mt-4 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {members.map((member) => {
            const roleMeta = PROJECT_ROLES.find((r) => r.id === member.role)
            const isOwner = member.userId === ownerId
            const initials = member.user.name
              ? member.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
              : "U"

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-card/60 hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-8 w-8 rounded-xl ring-1 ring-border">
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold truncate">{member.user.name || "Member"}</p>
                      {isOwner && (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                          Owner
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{member.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[10px] font-semibold ${roleMeta?.badgeClass}`}>
                    {member.role}
                  </Badge>

                  {/* Remove button: only Owner/Admin, cannot remove Owner */}
                  {canManage && !isOwner && (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={removingId === member.userId}
                      onClick={() => handleRemoveMember(member.userId)}
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                      title="Remove member"
                    >
                      {removingId === member.userId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
