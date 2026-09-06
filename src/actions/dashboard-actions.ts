"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export interface DashboardTask {
  id: string
  projectId: string
  title: string
  status: string
  priority: string
  deadline: Date | null
  projectName: string
}

export async function getDashboardMetrics() {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  const userId = session.user.id

  // 1. Fetch user projects
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      tasks: {
        include: {
          assignee: { select: { id: true, name: true, image: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  // 2. Aggregate metrics
  let totalTasks = 0
  let completedTasks = 0
  let inProgressTasks = 0
  let todoTasks = 0
  let inReviewTasks = 0
  let overdueTasksCount = 0
  let dueSoonTasksCount = 0

  const allTasks: DashboardTask[] = []
  const now = new Date()
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000)

  for (const project of projects) {
    for (const task of project.tasks) {
      allTasks.push({
        id: task.id,
        projectId: project.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline,
        projectName: project.name,
      })

      totalTasks++
      if (task.status === "DONE") completedTasks++
      if (task.status === "IN_PROGRESS") inProgressTasks++
      if (task.status === "TODO") todoTasks++
      if (task.status === "IN_REVIEW") inReviewTasks++

      if (task.deadline && task.status !== "DONE") {
        const d = new Date(task.deadline)
        if (d < now) {
          overdueTasksCount++
        } else if (d <= in48Hours) {
          dueSoonTasksCount++
        }
      }
    }
  }

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Urgent tasks (Overdue or high priority, sorted by deadline)
  const urgentTasks = allTasks
    .filter((t) => t.status !== "DONE")
    .sort((a, b) => {
      // Prioritize overdue, then closest deadline, then priority
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      }
      if (a.deadline) return -1
      if (b.deadline) return 1
      return 0
    })
    .slice(0, 5)

  return {
    totalProjects: projects.length,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    inReviewTasks,
    overdueTasksCount,
    dueSoonTasksCount,
    completionRate,
    recentProjects: projects.slice(0, 4).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      ownerId: p.ownerId,
      membersCount: p.members.length,
      tasksCount: p.tasks.length,
      completedCount: p.tasks.filter((t) => t.status === "DONE").length,
      progressPercent:
        p.tasks.length > 0
          ? Math.round(
              (p.tasks.filter((t) => t.status === "DONE").length / p.tasks.length) * 100
            )
          : 0,
      updatedAt: p.updatedAt,
    })),
    urgentTasks,
  }
}
