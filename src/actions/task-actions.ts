"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createTaskSchema, updateTaskSchema, CreateTaskInput, UpdateTaskInput } from "@/lib/validations/task"
import { revalidatePath } from "next/cache"
import { TaskStatus, TaskPriority, ProjectRole } from "@prisma/client"

export async function createTask(projectId: string, input: CreateTaskInput) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  const userId = session.user.id

  // 1. Verify user is project member
  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: { projectId, userId },
    },
  })

  if (!member) {
    return { success: false, message: "You are not a member of this project" }
  }

  // 2. Validate input schema
  const validation = createTaskSchema.safeParse(input)
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Invalid task data",
    }
  }

  const { title, description, status, priority, assigneeId, deadline } = validation.data

  // 3. If assigneeId is provided, verify assignee is a project member!
  if (assigneeId) {
    const assigneeMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId: assigneeId },
      },
    })
    if (!assigneeMember) {
      return { success: false, message: "Selected assignee is not a member of this project" }
    }
  }

  try {
    // Determine highest order for this status column
    const highestOrderTask = await prisma.task.findFirst({
      where: { projectId, status: status as TaskStatus },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const newOrder = highestOrderTask ? highestOrderTask.order + 1000 : 1000

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description: description || null,
        status: status as TaskStatus,
        priority: priority as TaskPriority,
        assigneeId: assigneeId || null,
        createdById: userId,
        deadline: deadline ? new Date(deadline) : null,
        order: newOrder,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, image: true },
        },
        creator: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    })

    revalidatePath(`/projects/${projectId}`)
    revalidatePath("/dashboard")

    return { success: true, message: "Task created successfully", task }
  } catch (error) {
    console.error("Create task error:", error)
    return { success: false, message: "Failed to create task" }
  }
}

export async function updateTask(taskId: string, input: UpdateTaskInput) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  const userId = session.user.id

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { members: true } } },
  })

  if (!task) {
    return { success: false, message: "Task not found" }
  }

  // Check if caller is a project member
  const member = task.project.members.find((m) => m.userId === userId)
  if (!member) {
    return { success: false, message: "You are not a member of this project" }
  }

  const validation = updateTaskSchema.safeParse(input)
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Invalid task data",
    }
  }

  const data = validation.data

  // If changing assignee, verify new assignee is in project
  if (data.assigneeId) {
    const validAssignee = task.project.members.some((m) => m.userId === data.assigneeId)
    if (!validAssignee) {
      return { success: false, message: "Selected assignee is not a member of this project" }
    }
  }

  try {
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.status !== undefined && { status: data.status as TaskStatus }),
        ...(data.priority !== undefined && { priority: data.priority as TaskPriority }),
        ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId || null }),
        ...(data.deadline !== undefined && { deadline: data.deadline ? new Date(data.deadline) : null }),
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, image: true },
        },
        creator: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    })

    revalidatePath(`/projects/${task.projectId}`)
    revalidatePath("/dashboard")

    return { success: true, message: "Task updated successfully", task: updated }
  } catch (error) {
    console.error("Update task error:", error)
    return { success: false, message: "Failed to update task" }
  }
}

export async function updateTaskStatusAndOrder(
  taskId: string,
  newStatus: TaskStatus,
  newOrder: number
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  const userId = session.user.id

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { projectId: true, project: { select: { members: { select: { userId: true } } } } },
  })

  if (!task) {
    return { success: false, message: "Task not found" }
  }

  const isMember = task.project.members.some((m) => m.userId === userId)
  if (!isMember) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
        order: newOrder,
      },
    })

    revalidatePath(`/projects/${task.projectId}`)
    return { success: true, task: updated }
  } catch (error) {
    console.error("Update task status error:", error)
    return { success: false, message: "Failed to update task status" }
  }
}

export async function deleteTask(taskId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  const userId = session.user.id

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { members: true } } },
  })

  if (!task) {
    return { success: false, message: "Task not found" }
  }

  const member = task.project.members.find((m) => m.userId === userId)
  if (!member) {
    return { success: false, message: "Unauthorized" }
  }

  // Only Owner, Admin, or the task creator can delete the task
  const canDelete =
    member.role === ProjectRole.OWNER ||
    member.role === ProjectRole.ADMIN ||
    task.createdById === userId

  if (!canDelete) {
    return { success: false, message: "You don't have permission to delete this task" }
  }

  try {
    await prisma.task.delete({
      where: { id: taskId },
    })

    revalidatePath(`/projects/${task.projectId}`)
    revalidatePath("/dashboard")

    return { success: true, message: "Task deleted successfully" }
  } catch (error) {
    console.error("Delete task error:", error)
    return { success: false, message: "Failed to delete task" }
  }
}
