export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface UserSummary {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
}

export interface ProjectMemberWithUser {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  createdAt: string | Date;
  user: UserSummary;
}

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string | null;
  assignee?: UserSummary | null;
  createdById: string;
  creator?: UserSummary | null;
  deadline?: string | Date | null;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  owner?: UserSummary;
  membersCount?: number;
  tasksCount?: number;
  completedTasksCount?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface DashboardMetrics {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  inReviewTasks: number;
  overdueTasksCount: number;
  dueSoonTasksCount: number;
  completionRate: number;
}
