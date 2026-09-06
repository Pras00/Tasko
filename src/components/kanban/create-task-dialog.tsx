"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTask } from "@/actions/task-actions"
import { toast } from "sonner"
import { Plus, Loader2 } from "lucide-react"
import { TaskStatus, TaskPriority } from "@prisma/client"
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/constants"

interface CreateTaskDialogProps {
  projectId: string
  defaultStatus?: TaskStatus
  members: Array<{
    id: string
    userId: string
    user: {
      id: string
      name: string | null
      email: string
    }
  }>
  trigger?: React.ReactNode
}

export function CreateTaskDialog({
  projectId,
  defaultStatus = "TODO",
  members,
  trigger,
}: CreateTaskDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [status, setStatus] = React.useState<TaskStatus>(defaultStatus)
  const [priority, setPriority] = React.useState<TaskPriority>("MEDIUM")
  const [assigneeId, setAssigneeId] = React.useState<string>("")
  const [deadline, setDeadline] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please enter a task title")
      return
    }

    try {
      setIsLoading(true)
      const res = await createTask(projectId, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        assigneeId: assigneeId || null,
        deadline: deadline || null,
      })

      if (res.success) {
        toast.success(res.message)
        setTitle("")
        setDescription("")
        setAssigneeId("")
        setDeadline("")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error("Failed to create task")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen) setStatus(defaultStatus)
      }}
    >
      <DialogTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5 shadow-sm text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[500px] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Task</DialogTitle>
            <DialogDescription className="text-xs">
              Add a new card to your project board with deadline and member assignment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="task-title" className="text-xs font-semibold">
                Task Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="task-title"
                placeholder="e.g. Implement OAuth Google login"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="rounded-xl"
                maxLength={200}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-desc" className="text-xs font-semibold">
                Description (Optional)
              </Label>
              <textarea
                id="task-desc"
                placeholder="Add context, acceptance criteria, or links..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                maxLength={2000}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Status</Label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {TASK_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Priority</Label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {TASK_PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Assignee</Label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.user.name || m.user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Deadline</Label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Add Task</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
