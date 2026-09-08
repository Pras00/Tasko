"use client"

import * as React from "react"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import { TaskStatus, TaskPriority } from "@prisma/client"
import { TASK_STATUSES } from "@/lib/constants"
import { TaskCard } from "@/components/kanban/task-card"
import { CreateTaskDialog } from "@/components/kanban/create-task-dialog"
import { updateTaskStatusAndOrder } from "@/actions/task-actions"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMounted } from "@/hooks/use-mounted"

interface TaskType {
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

interface KanbanBoardProps {
  projectId: string
  initialTasks: TaskType[]
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
  filterQuery?: string
  filterPriority?: string
  filterAssignee?: string
}

export function KanbanBoard({
  projectId,
  initialTasks,
  members,
  filterQuery = "",
  filterPriority = "ALL",
  filterAssignee = "ALL",
}: KanbanBoardProps) {
  const [tasks, setTasks] = React.useState<TaskType[]>(initialTasks)
  const [prevInitialTasks, setPrevInitialTasks] = React.useState<TaskType[]>(initialTasks)
  const isMounted = useMounted()

  // Sync state when initialTasks prop changes from server
  if (initialTasks !== prevInitialTasks) {
    setPrevInitialTasks(initialTasks)
    setTasks(initialTasks)
  }

  // Filter tasks based on search & filters (ready for Phase 4)
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      // Query filter (title & description)
      if (filterQuery.trim()) {
        const q = filterQuery.toLowerCase()
        const titleMatch = task.title.toLowerCase().includes(q)
        const descMatch = task.description?.toLowerCase().includes(q) || false
        if (!titleMatch && !descMatch) return false
      }

      // Priority filter
      if (filterPriority !== "ALL" && task.priority !== filterPriority) {
        return false
      }

      // Assignee filter
      if (filterAssignee !== "ALL") {
        if (filterAssignee === "UNASSIGNED" && task.assigneeId) return false
        if (filterAssignee !== "UNASSIGNED" && task.assigneeId !== filterAssignee) return false
      }

      return true
    })
  }, [tasks, filterQuery, filterPriority, filterAssignee])

  const onDragStart = () => {
    // Subtle haptic feedback on mobile touch devices when card lifts
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(30)
      } catch {}
    }
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // Dropped outside a valid droppable
    if (!destination) return

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const destStatus = destination.droppableId as TaskStatus

    // Clone tasks for optimistic update
    const previousTasks = [...tasks]

    // Separate tasks in destination column
    const destTasks = tasks
      .filter((t) => t.status === destStatus && t.id !== draggableId)
      .sort((a, b) => a.order - b.order)

    // Calculate new order
    let newOrder = 1000
    if (destTasks.length === 0) {
      newOrder = 1000
    } else if (destination.index === 0) {
      newOrder = destTasks[0].order / 2
    } else if (destination.index >= destTasks.length) {
      newOrder = destTasks[destTasks.length - 1].order + 1000
    } else {
      const prevOrder = destTasks[destination.index - 1].order
      const nextOrder = destTasks[destination.index].order
      newOrder = (prevOrder + nextOrder) / 2
    }

    // Apply optimistic update locally
    const updatedTasks = tasks.map((t) => {
      if (t.id === draggableId) {
        return {
          ...t,
          status: destStatus,
          order: newOrder,
        }
      }
      return t
    })

    setTasks(updatedTasks)

    // Send update to server action
    try {
      const res = await updateTaskStatusAndOrder(draggableId, destStatus, newOrder)
      if (!res.success) {
        // Rollback on server rejection
        setTasks(previousTasks)
        toast.error(res.message || "Failed to update task position")
      }
    } catch {
      setTasks(previousTasks)
      toast.error("Failed to move task")
    }
  }

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start pb-8">
        {TASK_STATUSES.map((status) => (
          <div
            key={status.id}
            className="rounded-2xl border border-border/60 bg-accent/20 p-4 min-h-[450px]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-sm">{status.title}</span>
            </div>
            <div className="space-y-3">
              <div className="h-28 rounded-xl bg-card/60 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start pb-8">
        {TASK_STATUSES.map((statusColumn) => {
          const columnTasks = filteredTasks
            .filter((t) => t.status === statusColumn.id)
            .sort((a, b) => a.order - b.order)

          return (
            <div
              key={statusColumn.id}
              className="flex flex-col rounded-2xl border border-border/60 bg-muted/40 p-3.5 shadow-sm transition-colors"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-border/40 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      statusColumn.id === "TODO"
                        ? "bg-sky-500"
                        : statusColumn.id === "IN_PROGRESS"
                        ? "bg-amber-500"
                        : statusColumn.id === "IN_REVIEW"
                        ? "bg-violet-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                    {statusColumn.title}
                  </h3>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-[11px] font-bold text-muted-foreground shadow-xs">
                    {columnTasks.length}
                  </span>
                </div>

                <CreateTaskDialog
                  projectId={projectId}
                  defaultStatus={statusColumn.id}
                  members={members}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                      title={`Add task to ${statusColumn.title}`}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  }
                />
              </div>

              {/* Droppable Column Area */}
              <Droppable droppableId={statusColumn.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-col gap-3 min-h-[380px] rounded-xl p-1 transition-colors ${
                      snapshot.isDraggingOver
                        ? "bg-indigo-500/5 ring-2 ring-indigo-500/20 ring-dashed"
                        : ""
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            style={{
                              ...dragProvided.draggableProps.style,
                              ...(dragSnapshot.isDragging ? { zIndex: 99999 } : {}),
                            }}
                          >
                            <TaskCard
                              task={task}
                              members={members}
                              isDragging={dragSnapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/60 p-6 text-center">
                        <p className="text-xs text-muted-foreground/70">No tasks</p>
                        <CreateTaskDialog
                          projectId={projectId}
                          defaultStatus={statusColumn.id}
                          members={members}
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline p-0 h-auto"
                            >
                              + Add a task
                            </Button>
                          }
                        />
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}

