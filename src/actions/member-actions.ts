"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { addMemberSchema, AddMemberInput } from "@/lib/validations/member"
import { revalidatePath } from "next/cache"
import { ProjectRole } from "@prisma/client"

export async function addProjectMember(projectId: string, input: AddMemberInput) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  const userId = session.user.id

  // 1. Verify caller has OWNER or ADMIN role
  const callerMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: { projectId, userId },
    },
  })

  if (
    !callerMember ||
    (callerMember.role !== ProjectRole.OWNER && callerMember.role !== ProjectRole.ADMIN)
  ) {
    return { success: false, message: "Only Owner or Admin can add members to this project" }
  }

  // 2. Validate input
  const validation = addMemberSchema.safeParse(input)
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Invalid input data",
    }
  }

  const { email, role } = validation.data
  const normalizedEmail = email.toLowerCase().trim()

  // 3. Find target user by email
  const targetUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })

  if (!targetUser) {
    return {
      success: false,
      message: `No user found with email "${normalizedEmail}". Please ask them to register first.`,
    }
  }

  // 4. Check if already a member
  const existingMembership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: { projectId, userId: targetUser.id },
    },
  })

  if (existingMembership) {
    return { success: false, message: "User is already a member of this project" }
  }

  try {
    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: targetUser.id,
        role: role as ProjectRole,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    })

    revalidatePath(`/projects/${projectId}`)
    return { success: true, message: "Member added successfully", member }
  } catch (error) {
    console.error("Add member error:", error)
    return { success: false, message: "Failed to add member" }
  }
}

export async function removeProjectMember(projectId: string, targetUserId: string) {
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

  // Project owner cannot be removed!
  if (project.ownerId === targetUserId) {
    return { success: false, message: "Project owner cannot be removed from the project" }
  }

  // Check caller role
  const callerMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: { projectId, userId },
    },
  })

  if (
    !callerMember ||
    (callerMember.role !== ProjectRole.OWNER && callerMember.role !== ProjectRole.ADMIN)
  ) {
    return { success: false, message: "Only Owner or Admin can remove members" }
  }

  try {
    // Unassign tasks from this user in this project
    await prisma.task.updateMany({
      where: { projectId, assigneeId: targetUserId },
      data: { assigneeId: null },
    })

    await prisma.projectMember.delete({
      where: {
        projectId_userId: { projectId, userId: targetUserId },
      },
    })

    revalidatePath(`/projects/${projectId}`)
    return { success: true, message: "Member removed from project" }
  } catch (error) {
    console.error("Remove member error:", error)
    return { success: false, message: "Failed to remove member" }
  }
}

export async function updateProjectMemberRole(
  projectId: string,
  targetUserId: string,
  newRole: ProjectRole
) {
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

  // Only project OWNER can change roles!
  if (project.ownerId !== userId) {
    return { success: false, message: "Only the project Owner can modify member roles" }
  }

  if (project.ownerId === targetUserId) {
    return { success: false, message: "Cannot change the project owner's role" }
  }

  try {
    await prisma.projectMember.update({
      where: {
        projectId_userId: { projectId, userId: targetUserId },
      },
      data: { role: newRole },
    })

    revalidatePath(`/projects/${projectId}`)
    return { success: true, message: "Role updated successfully" }
  } catch (error) {
    console.error("Update role error:", error)
    return { success: false, message: "Failed to update role" }
  }
}
