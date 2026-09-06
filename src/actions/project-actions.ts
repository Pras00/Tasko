"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createProjectSchema, CreateProjectInput } from "@/lib/validations/project"
import { revalidatePath } from "next/cache"
import { ProjectRole } from "@prisma/client"

export async function getProjects() {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  const userId = session.user.id

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true, image: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      },
      tasks: {
        select: { id: true, status: true },
      },
      _count: {
        select: { tasks: true, members: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  return projects.map((project) => {
    const completedTasks = project.tasks.filter((t) => t.status === "DONE").length
    const totalTasks = project.tasks.length

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      ownerId: project.ownerId,
      owner: project.owner,
      members: project.members,
      membersCount: project.members.length,
      tasksCount: totalTasks,
      completedTasksCount: completedTasks,
      progressPercent: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }
  })
}

export async function getProjectById(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const userId = session.user.id

  // Check if user is owner or member
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true, image: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { joinedAt: "asc" },
      },
      tasks: {
        include: {
          assignee: {
            select: { id: true, name: true, email: true, image: true },
          },
          creator: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!project) {
    return null
  }

  // Determine current user's role in this project
  const currentMembership = project.members.find((m) => m.userId === userId)
  const currentUserRole: ProjectRole =
    project.ownerId === userId ? ProjectRole.OWNER : currentMembership?.role || ProjectRole.MEMBER

  return {
    ...project,
    currentUserRole,
  }
}

export async function createProject(input: CreateProjectInput) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  const validation = createProjectSchema.safeParse(input)
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Invalid project data",
    }
  }

  const { name, description } = validation.data
  const userId = session.user.id

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: ProjectRole.OWNER,
          },
        },
      },
    })

    revalidatePath("/projects")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Project created successfully",
      project,
    }
  } catch (error) {
    console.error("Create project error:", error)
    return { success: false, message: "Failed to create project" }
  }
}

export async function updateProject(
  projectId: string,
  input: CreateProjectInput
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  const userId = session.user.id

  // Check authorization (OWNER or ADMIN)
  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: { projectId, userId },
    },
  })

  if (!member || (member.role !== ProjectRole.OWNER && member.role !== ProjectRole.ADMIN)) {
    return { success: false, message: "Only project Owner or Admin can update project settings" }
  }

  const validation = createProjectSchema.safeParse(input)
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Invalid input data",
    }
  }

  try {
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: validation.data.name,
        description: validation.data.description || null,
      },
    })

    revalidatePath(`/projects/${projectId}`)
    revalidatePath("/projects")

    return { success: true, message: "Project updated successfully", project: updated }
  } catch (error) {
    console.error("Update project error:", error)
    return { success: false, message: "Failed to update project" }
  }
}

export async function deleteProject(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  const userId = session.user.id

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  })

  if (!project) {
    return { success: false, message: "Project not found" }
  }

  if (project.ownerId !== userId) {
    return { success: false, message: "Only the project Owner can delete this project" }
  }

  try {
    await prisma.project.delete({
      where: { id: projectId },
    })

    revalidatePath("/projects")
    revalidatePath("/dashboard")

    return { success: true, message: "Project deleted successfully" }
  } catch (error) {
    console.error("Delete project error:", error)
    return { success: false, message: "Failed to delete project" }
  }
}
