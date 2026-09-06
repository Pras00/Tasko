"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { CreateTaskDialog } from "@/components/kanban/create-task-dialog"
import { ManageMembersDialog } from "@/components/project/manage-members-dialog"
import {
  FolderKanban,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Trash2,
} from "lucide-react"
import { deleteProject } from "@/actions/project-actions"
import { toast } from "sonner"
import { ProjectRole, TaskStatus, TaskPriority } from "@prisma/client"
import { PROJECT_ROLES, TASK_PRIORITIES } from "@/lib/constants"

interface ProjectDetailViewProps {
  project: {
    id: string
    name: string
    description?: string | null
    ownerId: string
    currentUserRole: ProjectRole
    owner: {
      id: string
      name: string | null
      email: string
      image: string | null
    }
    members: Array<{
      id: string
      userId: string
      role: ProjectRole
      user: {
        id: string
        name: string | null
        email: string
        image: string | null
      }
    }>
    tasks: Array<{
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
    }>
  }
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [priorityFilter, setPriorityFilter] = React.useState("ALL")
  const [assigneeFilter, setAssigneeFilter] = React.useState("ALL")

  const roleMeta = PROJECT_ROLES.find((r) => r.id === project.currentUserRole)
  const isOwner = project.currentUserRole === "OWNER"

  const completedCount = project.tasks.filter((t) => t.status === "DONE").length
  const totalCount = project.tasks.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const handleDeleteProject = async () => {
    if (!confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      const res = await deleteProject(project.id)
      if (res.success) {
        toast.success(res.message)
        router.push("/projects")
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error("Failed to delete project")
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center gap-2">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Project Header Card */}
      <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <FolderKanban className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{project.name}</h1>
              <Badge
                variant="outline"
                className={`text-xs font-bold px-2.5 py-0.5 rounded-xl ${roleMeta?.badgeClass}`}
              >
                Your role: {project.currentUserRole}
              </Badge>
            </div>
            {project.description && (
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <ManageMembersDialog
              projectId={project.id}
              members={project.members}
              currentUserRole={project.currentUserRole}
              ownerId={project.ownerId}
            />

            <CreateTaskDialog
              projectId={project.id}
              members={project.members}
              trigger={
                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shadow-sm shadow-indigo-500/20 text-xs font-semibold">
                  <Plus className="w-4 h-4" />
                  <span>New Task</span>
                </Button>
              }
            />

            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteProject}
                className="rounded-xl h-9 w-9 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress & Stats Bar */}
        <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              <strong>{totalCount}</strong> tasks total
            </span>
            <span>•</span>
            <span>
              <strong>{completedCount}</strong> completed ({progressPercent}%)
            </span>
            <span>•</span>
            <span>
              <strong>{project.members.length}</strong> team members
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-48">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-foreground">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Discovery & Productivity Bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card/40 p-3 rounded-2xl border border-border/40 backdrop-blur-xs">
        {/* Search Query */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl text-xs bg-background/60"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-input bg-background/80 px-2.5 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0"
          >
            <option value="ALL">All Priorities</option>
            {TASK_PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="rounded-xl border border-input bg-background/80 px-2.5 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0"
          >
            <option value="ALL">All Assignees</option>
            <option value="UNASSIGNED">Unassigned</option>
            {project.members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.user.name || m.user.email}
              </option>
            ))}
          </select>

          {/* Clear Filters Button if active */}
          {(searchQuery || priorityFilter !== "ALL" || assigneeFilter !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setPriorityFilter("ALL")
                setAssigneeFilter("ALL")
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline p-1 h-auto shrink-0"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        projectId={project.id}
        initialTasks={project.tasks}
        members={project.members}
        filterQuery={searchQuery}
        filterPriority={priorityFilter}
        filterAssignee={assigneeFilter}
      />
    </div>
  )
}
