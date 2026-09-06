import { TaskStatus, TaskPriority, ProjectRole } from "@/types";

export const TASK_STATUSES: {
  id: TaskStatus;
  title: string;
  badgeClass: string;
  bgLight: string;
  borderColor: string;
}[] = [
  {
    id: "TODO",
    title: "To Do",
    badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    bgLight: "bg-sky-50/50 dark:bg-sky-950/20",
    borderColor: "border-sky-200 dark:border-sky-900/40",
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    bgLight: "bg-amber-50/50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-900/40",
  },
  {
    id: "IN_REVIEW",
    title: "In Review",
    badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    bgLight: "bg-violet-50/50 dark:bg-violet-950/20",
    borderColor: "border-violet-200 dark:border-violet-900/40",
  },
  {
    id: "DONE",
    title: "Done",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    bgLight: "bg-emerald-50/50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-900/40",
  },
];

export const TASK_PRIORITIES: {
  id: TaskPriority;
  label: string;
  badgeClass: string;
  color: string;
}[] = [
  {
    id: "LOW",
    label: "Low",
    badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    color: "text-slate-500",
  },
  {
    id: "MEDIUM",
    label: "Medium",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    color: "text-blue-500",
  },
  {
    id: "HIGH",
    label: "High",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    color: "text-amber-500",
  },
  {
    id: "URGENT",
    label: "Urgent",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    color: "text-rose-500",
  },
];

export const PROJECT_ROLES: {
  id: ProjectRole;
  label: string;
  description: string;
  badgeClass: string;
}[] = [
  {
    id: "OWNER",
    label: "Owner",
    description: "Full control over project, settings, members, and all tasks",
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    id: "ADMIN",
    label: "Admin",
    description: "Can manage tasks, assign members, and invite new members",
    badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  {
    id: "MEMBER",
    label: "Member",
    description: "Can view project and collaborate on assigned tasks",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
];
