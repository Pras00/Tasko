"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, MoreVertical, AlertCircle, Pencil, Trash2 } from "lucide-react"
import { TaskStatus, TaskPriority } from "@prisma/client"
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants"
import { updateTaskStatusAndOrder, deleteTask } from "@/actions/task-actions"
import { toast } from "sonner"
import { EditTaskDialog } from "@/components/kanban/edit-task-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface TaskCardProps {
  task: {
    id: string
    projectId: string
    title: string
    description?: string | null
    status: TaskStatus
    priority: TaskPriority
    assigneeId?: string | null
    assignee?: { id: string; name: string | null; email: string; image?: string | null } | null
    createdById: string
    creator?: { id: string; name: string | null; email: string } | null
    deadline?: Date | string | null
    order: number
    createdAt: Date | string
    updatedAt: Date | string
  }
  members: Array<{
    id: string
    userId: string
    user: {
      id: string
      name: string | null
      email: string
      image?: string | null
    }
  }>
  isDragging?: boolean
}

export function TaskCard({ task, members, isDragging }: TaskCardProps) {
  const [editOpen, setEditOpen] = React.useState(false)

  const priorityMeta = TASK_PRIORITIES.find((p) => p.id === task.priority)

  // Deadline calculations
  const now = new Date()
  const deadlineDate = task.deadline ? new Date(task.deadline) : null
  const isOverdue = deadlineDate ? deadlineDate.getTime() < now.getTime() && task.status !== "DONE" : false
  const isDueSoon =
    deadlineDate && !isOverdue && task.status !== "DONE"
      ? deadlineDate.getTime() - now.getTime() < 48 * 60 * 60 * 1000
      : false

  const assigneeInitials = task.assignee?.name
    ? task.assignee.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleQuickStatusChange = async (newStatus: TaskStatus) => {
    try {
      const res = await updateTaskStatusAndOrder(task.id, newStatus, task.order)
      if (res.success) {
        toast.success(`Moved to ${newStatus.replace("_", " ")}`)
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error("Failed to move task")
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      const res = await deleteTask(task.id)
      if (res.success) {
        toast.success(res.message)
        setDeleteConfirmOpen(false)
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
    <>
      <div
        className={`group relative rounded-2xl border bg-card p-4 select-none ${
          isDragging
            ? "border-indigo-500 shadow-2xl shadow-indigo-500/25 ring-2 ring-indigo-500/40 cursor-grabbing bg-card"
            : "border-border/70 hover:border-border hover:shadow-md hover:shadow-black/5 transition-all duration-150 cursor-grab"
        }`}
      >
        {/* Card Header: Priority badge & Quick Menu */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Badge
            variant="outline"
            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider ${priorityMeta?.badgeClass}`}
          >
            {priorityMeta?.label}
          </Badge>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md hover:bg-accent/80 text-muted-foreground"
                  />
                }
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl border-border/70 text-xs">
                <DropdownMenuItem onClick={() => setEditOpen(true)} className="cursor-pointer gap-2">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Edit Details</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <div className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground">
                  Move to
                </div>
                {TASK_STATUSES.filter((s) => s.id !== task.status).map((s) => (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={() => handleQuickStatusChange(s.id)}
                    className="cursor-pointer gap-2 text-xs"
                  >
                    <span>{s.title}</span>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="cursor-pointer gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-500/10 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Task Title (Click to open edit modal) */}
        <h4
          onClick={() => setEditOpen(true)}
          className="text-sm font-semibold text-foreground leading-snug cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          {task.title}
        </h4>

        {/* Task Description Preview */}
        {task.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Card Footer: Deadline & Assignee */}
        <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-border/40 text-xs text-muted-foreground">
          {/* Deadline */}
          {deadlineDate ? (
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-medium ${
                isOverdue
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                  : isDueSoon
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                  : "bg-muted/60 text-muted-foreground"
              }`}
            >
              {isOverdue ? (
                <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
              ) : (
                <Calendar className="w-3 h-3 shrink-0" />
              )}
              <span>
                {deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          ) : (
            <div />
          )}

          {/* Assignee Avatar */}
          {task.assignee ? (
            <div className="flex items-center gap-1.5" title={`Assigned to: ${task.assignee.name || task.assignee.email}`}>
              <Avatar className="h-6 w-6 rounded-lg ring-1 ring-border">
                <AvatarImage src={task.assignee.image || ""} />
                <AvatarFallback className="bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg">
                  {assigneeInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <span className="text-[11px] text-muted-foreground/60 italic">Unassigned</span>
          )}
        </div>
      </div>

      <EditTaskDialog
        task={task}
        members={members}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Task"
        description={
          <>
            Are you sure you want to delete <strong className="text-foreground font-semibold">&ldquo;{task.title}&rdquo;</strong>? This action cannot be undone.
          </>
        }
        confirmText="Delete Task"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
