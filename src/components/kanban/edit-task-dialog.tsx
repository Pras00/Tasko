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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateTask, deleteTask } from "@/actions/task-actions"
import { toast } from "sonner"
import { Trash2, Loader2 } from "lucide-react"
import { TaskStatus, TaskPriority } from "@prisma/client"
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/constants"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface EditTaskDialogProps {
  task: {
    id: string
    projectId: string
    title: string
    description?: string | null
    status: TaskStatus
    priority: TaskPriority
    assigneeId?: string | null
    deadline?: Date | string | null
    createdById: string
    creator?: { name: string | null; email: string } | null
    createdAt: Date | string
  }
  members: Array<{
    id: string
    userId: string
    user: {
      id: string
      name: string | null
      email: string
    }
  }>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTaskDialog({
  task,
  members,
  open,
  onOpenChange,
}: EditTaskDialogProps) {
  const router = useRouter()
  const [title, setTitle] = React.useState(task.title)
  const [description, setDescription] = React.useState(task.description || "")
  const [status, setStatus] = React.useState<TaskStatus>(task.status)
  const [priority, setPriority] = React.useState<TaskPriority>(task.priority)
  const [assigneeId, setAssigneeId] = React.useState<string>(task.assigneeId || "")
  const [deadline, setDeadline] = React.useState<string>(
    task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : ""
  )
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)

  const [prevTask, setPrevTask] = React.useState(task)
  if (task !== prevTask) {
    setPrevTask(task)
    setTitle(task.title)
    setDescription(task.description || "")
    setStatus(task.status)
    setPriority(task.priority)
    setAssigneeId(task.assigneeId || "")
    setDeadline(task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "")
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please enter a task title")
      return
    }

    try {
      setIsLoading(true)
      const res = await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        assigneeId: assigneeId || null,
        deadline: deadline || null,
      })

      if (res.success) {
        toast.success(res.message)
        onOpenChange(false)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error("Failed to update task")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      const res = await deleteTask(task.id)

      if (res.success) {
        toast.success(res.message)
        setDeleteConfirmOpen(false)
        onOpenChange(false)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error("Failed to delete task")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] rounded-2xl p-6">
        <form onSubmit={handleUpdate} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Task</DialogTitle>
            <DialogDescription className="text-xs">
              Update task information, change status, or assign to a team member.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="edit-title" className="text-xs font-semibold">
                Task Title
              </Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="rounded-xl"
                maxLength={200}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-desc" className="text-xs font-semibold">
                Description
              </Label>
              <textarea
                id="edit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex min-h-[90px] w-full rounded-xl border border-input bg-background px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

          <DialogFooter className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="ghost"
              disabled={isDeleting}
              onClick={() => setDeleteConfirmOpen(true)}
              className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 gap-1.5 rounded-xl cursor-pointer"
            >
              {isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Delete Task</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs gap-1.5 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Task"
        description={
          <>
            Are you sure you want to delete <strong className="text-foreground font-semibold">&ldquo;{task.title}&rdquo;</strong>? This action cannot be undone and will permanently remove this task.
          </>
        }
        confirmText="Delete Task"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </Dialog>
  )
}
